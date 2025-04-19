use super::building::{Building, BuildingTrait};
use super::generic_entity::{EntityTrait, Position};
use super::zombie::ZombieColours;
use super::AllEntityTypesEnum;
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::manager::ENTITIES;
use crate::info::wave_data::{Wave, ZombieType, INFINITE_WAVE_DATA, WAVE_DATA};
use crate::network::encode_rpc_types::Dead::DeathReasons;
use crate::pathfinding_rs::GridNode;
use crate::physics::{self, PIXEL_TO_WORLD};
use crate::{manager, pathfinding_rs, CONFIG, PARTIES, WORLD_HEIGHT, WORLD_WIDTH};
use rand::{thread_rng, Rng};
use rapier2d::prelude::*;
use std::any::Any;
use std::collections::{HashMap, HashSet};
use std::f32::consts::PI;
use std::cmp;
use std::net::IpAddr;
use pathfinding::prelude::astar_bag;

#[derive(Clone, Debug)]
pub struct SpellInfo {
    pub spell_name: String,
    pub timer_active: bool,
    pub timer_end_tick: u32,
    pub icon_end_tick: u32
}


#[derive(Clone, Debug)]
pub struct WaveData {
    pub spawn_ticks: HashMap<u32, Vec<ZombieType>>,
    pub wave_commenced: bool
}

#[derive(Clone, Debug)]
pub struct ZombiePathfindingGrid {
    pub grid: Vec<Vec<GridNode>>,
    pub width: i16,
    pub height: i16,
    pub x_offset: i16,
    pub y_offset: i16
}

#[derive(Clone, Debug)]
pub struct Factory {
    pub base_building: Building,
    pub aggro_enabled: bool,
    pub warming_up: bool,
    pub last_update_tick: u32,
    pub enemy_query_range: f32,
    pub enemies_queried: HashMap<Position, HashSet<u16>>,
    pub wave: u32,
    pub zombie_uids: Vec<u16>,
    pub timed_out: bool,
    pub timeout_info: SpellInfo,
    pub rapidfire_info: SpellInfo,
    pub wave_data: WaveData,
    pub zombie_pathfinding_grid: ZombiePathfindingGrid,
    pub cell_position: Position,
    pub last_building_update_tick: Option<u32>,

    pub hit_count_by_party: HashMap<u32, Hit>,
    pub hit_count_by_ip: HashMap<IpAddr, Hit>,

    pub radial_distribution: [f32; RADIAL_DISTRIBUTION_SECTOR_COUNT]
}

const RADIAL_DISTRIBUTION_SECTOR_COUNT: usize = 360;
const AGGRESSION_THRESHOLD: u16 = 5;
const HIT_DECAY_DELAY_MS: u32 = 30_000;

pub type Hit = (u16, u32);

const PATH_CLEAR_FREQUENCY_MS: u32 = 3000;

impl Factory {
    pub fn update_party_building(&mut self, building_positions: Vec<Position>, building_entity: &EntityTypeEnum, building_dead: bool) {
        // Building radial distribution for zombie spawns
        let sector_angle = (2.0 * std::f32::consts::PI) / RADIAL_DISTRIBUTION_SECTOR_COUNT as f32;
        let mut sector_weights = [0.0; RADIAL_DISTRIBUTION_SECTOR_COUNT];

        let mut building_count = 0.0f32;

        for building_pos in building_positions {
            let angle_to_building = self.base_building.generic_entity.position.angle_to(&building_pos) as f32;

            let normalised_angle = if angle_to_building >= 0.0 {
                angle_to_building
            } else {
                angle_to_building + 2.0 * std::f32::consts::PI
            };

            let normalised_angle_radians = normalised_angle.to_radians();

            let sector_index = ((normalised_angle_radians / sector_angle).floor() as usize) % RADIAL_DISTRIBUTION_SECTOR_COUNT;

            sector_weights[sector_index] += 1.0;

            building_count += 1.0;
        }

        if building_count <= 0.0 {
            building_count = 1.0;
        }

        self.radial_distribution = sector_weights.map(|weight| weight / building_count);

        // Pathfinding weight

        // The factory's cells shouldn't be weighted
        if building_entity.generic_entity().uid == self.base_building.generic_entity.uid {
            return;
        }

        let current_tick = CONFIG.with(|c| c.borrow().tick_number);

        self.last_building_update_tick = Some(current_tick);

        let (building_width, building_height) = match building_entity {
            EntityTypeEnum::ArrowTower(entity) => (entity.ranged_building.base_building.width,entity.ranged_building.base_building.height),
            EntityTypeEnum::CannonTower(entity) => (entity.ranged_building.base_building.width,entity.ranged_building.base_building.height),
            EntityTypeEnum::MageTower(entity) => (entity.ranged_building.base_building.width,entity.ranged_building.base_building.height),
            EntityTypeEnum::RocketTower(entity) => (entity.ranged_building.base_building.width,entity.ranged_building.base_building.height),
            EntityTypeEnum::LightningTower(entity) => (entity.ranged_building.base_building.width,entity.ranged_building.base_building.height),
            EntityTypeEnum::SawTower(entity) => (entity.ranged_building.base_building.width,entity.ranged_building.base_building.height),
            EntityTypeEnum::Wall(entity) => (entity.base_building.width,entity.base_building.height),
            EntityTypeEnum::LargeWall(entity) => (entity.base_building.width,entity.base_building.height),
            EntityTypeEnum::Door(entity) => (entity.base_building.width,entity.base_building.height),
            EntityTypeEnum::Drill(entity) => (entity.base_building.width,entity.base_building.height),
            // Spike Traps and Harvesters are ignored in pathfinding
            EntityTypeEnum::SpikeTrap(_) |
            EntityTypeEnum::Harvester(_) => return,
            _ => unreachable!()
        };

        let building_weight = 500;

        // 1x1
        if building_width == 47.99 && building_height == 47.99 {
            let building_cell_pos_x = (building_entity.generic_entity().position.x - 24 - self.zombie_pathfinding_grid.x_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;
            let building_cell_pos_y = (building_entity.generic_entity().position.y - 24 - self.zombie_pathfinding_grid.y_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;

            let grid_node = &mut self.zombie_pathfinding_grid.grid[building_cell_pos_x as usize][building_cell_pos_y as usize];

            if building_dead == true {
                grid_node.weight -= building_weight;
            } else {
                grid_node.weight += building_weight;
            }
        }

        // 2x2
        if building_width == 95.99 && building_height == 95.99 {
            // Top left cell
            let building_cell_pos_x = (building_entity.generic_entity().position.x - 48 - self.zombie_pathfinding_grid.x_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;
            let building_cell_pos_y = (building_entity.generic_entity().position.y - 48 - self.zombie_pathfinding_grid.y_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;

            let grid_node = &mut self.zombie_pathfinding_grid.grid[building_cell_pos_x as usize][building_cell_pos_y as usize];

            if building_dead == true {
                grid_node.weight -= building_weight;
            } else {
                grid_node.weight += building_weight;
            }

            // Top right cell
            let building_cell_pos_x = (building_entity.generic_entity().position.x - self.zombie_pathfinding_grid.x_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;
            let building_cell_pos_y = (building_entity.generic_entity().position.y - 48 - self.zombie_pathfinding_grid.y_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;

            let grid_node = &mut self.zombie_pathfinding_grid.grid[building_cell_pos_x as usize][building_cell_pos_y as usize];

            if building_dead == true {
                grid_node.weight -= building_weight;
            } else {
                grid_node.weight += building_weight;
            }

            // Bottom left cell
            let building_cell_pos_x = (building_entity.generic_entity().position.x - 48 - self.zombie_pathfinding_grid.x_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;
            let building_cell_pos_y = (building_entity.generic_entity().position.y - self.zombie_pathfinding_grid.y_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;

            let grid_node = &mut self.zombie_pathfinding_grid.grid[building_cell_pos_x as usize][building_cell_pos_y as usize];

            if building_dead == true {
                grid_node.weight -= building_weight;
            } else {
                grid_node.weight += building_weight;
            }

            // Bottom right cell
            let building_cell_pos_x = (building_entity.generic_entity().position.x - self.zombie_pathfinding_grid.x_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;
            let building_cell_pos_y = (building_entity.generic_entity().position.y - self.zombie_pathfinding_grid.y_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;

            let grid_node = &mut self.zombie_pathfinding_grid.grid[building_cell_pos_x as usize][building_cell_pos_y as usize];

            if building_dead == true {
                grid_node.weight -= building_weight;
            } else {
                grid_node.weight += building_weight;
            }
        }
    }

    pub fn get_zombie_path(&mut self, zombie_position: &Position) -> Position {
        let zombie_cell_pos_x = (zombie_position.x - zombie_position.x % pathfinding_rs::GRID_SIZE_TO_WORLD - self.zombie_pathfinding_grid.x_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;
        let zombie_cell_pos_y = (zombie_position.y - zombie_position.y % pathfinding_rs::GRID_SIZE_TO_WORLD - self.zombie_pathfinding_grid.y_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;

        if zombie_cell_pos_x < 0 || zombie_cell_pos_x > self.zombie_pathfinding_grid.width {
            return self.base_building.generic_entity.position.clone();
        }

        if zombie_cell_pos_y < 0 || zombie_cell_pos_y > self.zombie_pathfinding_grid.width {
            return self.base_building.generic_entity.position.clone();
        }

        let zombie_grid_node = &self.zombie_pathfinding_grid.grid[zombie_cell_pos_x as usize][zombie_cell_pos_y as usize];

        if zombie_grid_node.next_step.len() > 0 {
            let mut rng = thread_rng();
            let next_step_index = rng.gen_range(0..zombie_grid_node.next_step.len());

            let next_position = zombie_grid_node.next_step[next_step_index];

            return next_position.clone();
        }

        let self_grid_node = &self.zombie_pathfinding_grid.grid[self.cell_position.x as usize][self.cell_position.y as usize];

        let path = astar_bag(
            zombie_grid_node,
            |p| p.successors(&self.zombie_pathfinding_grid),
            |n| n.heuristic(&self_grid_node),
            |n| *n == *self_grid_node
        );

        match path {
            Some((solution, _cost)) => {
                for path in solution {
                    for i in 0..path.len().saturating_sub(1) {
                        let current = &path[i];
                        let next = &path[i + 1];

                        let (x, y) = (current.cell_position.0 as usize, current.cell_position.1 as usize);
                        let (next_x, next_y) = (next.cell_position.0 as usize, next.cell_position.1 as usize);

                        let mut next_position = self.zombie_pathfinding_grid.grid[next_x][next_y].position.clone();

                        // Make the zombies target the center of the cell instead of the origin
                        next_position.x += pathfinding_rs::GRID_SIZE_TO_WORLD / 2;
                        next_position.y += pathfinding_rs::GRID_SIZE_TO_WORLD / 2;

                        let actual_node = &mut self.zombie_pathfinding_grid.grid[x][y];

                        let mut existing_steps: HashSet<_> = actual_node.next_step.iter().cloned().collect();

                        if existing_steps.insert(next_position.clone()) {
                            actual_node.next_step.push(next_position);
                        }
                    }

                    let path_step = path[path.len() - 1].position;

                    return path_step.clone();
                }
            },
            None => {
                return self.base_building.generic_entity.position.clone();
            }
        }

        return self.base_building.generic_entity.position.clone();
    }

    pub fn check_entity_is_enemy(&self, entity: &EntityTypeEnum) -> bool {
        match &entity {
            &EntityTypeEnum::Player(entity) => {
                if entity.party_id == self.base_building.party_id {
                    return false;
                } else {
                    return self.is_aggressive(entity.party_id, entity.ip_address);
                }
            },
            &EntityTypeEnum::Zombie(_) => {
                return true;
            }
            _ => return false,
        }
    }

    pub fn register_hit(&self, party_id: u32, ip_address: IpAddr) {
        let (tick_number, tick_rate) = CONFIG.with(|c| {
            let config = c.borrow();

            (config.tick_number, config.tick_rate)
        });

        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let self_entity = entities.get_mut(&self.base_building.generic_entity.uid).unwrap();

            let EntityTypeEnum::Factory(self_entity) = self_entity else {
                unreachable!();
            };

            let hit_expiry_tick = tick_number + HIT_DECAY_DELAY_MS / tick_rate as u32;

            let entry = self_entity.hit_count_by_party.entry(party_id).or_insert((0, hit_expiry_tick));
            entry.0 += 1;
            entry.1 = hit_expiry_tick;

            let entry = self_entity.hit_count_by_ip.entry(ip_address).or_insert((0, hit_expiry_tick));
            entry.0 += 1;
            entry.1 = hit_expiry_tick;
        });
    }

    pub fn is_aggressive(&self, party_id: u32, ip_address: IpAddr) -> bool {
        self.hit_count_by_party.get(&party_id).map_or(0, |(count, _)| *count) >= AGGRESSION_THRESHOLD
            || self.hit_count_by_ip.get(&ip_address).map_or(0, |(count, _)| *count) >= AGGRESSION_THRESHOLD
    }

    pub fn update_aggression_state(&self, tick_number: u32) {
        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let self_entity = entities.get_mut(&self.base_building.generic_entity.uid).unwrap();

            let EntityTypeEnum::Factory(self_entity) = self_entity else {
                unreachable!();
            };

            self_entity.hit_count_by_party.retain(|_, (count, expiry_tick)| {
                if tick_number >= *expiry_tick {
                    return false; // Remove expired entries
                }
                *count > 0
            });
    
            self_entity.hit_count_by_ip.retain(|_, (count, expiry_tick)| {
                if tick_number >= *expiry_tick {
                    return false;
                }
                *count > 0
            });
        });
    }

    fn get_wave_data(&self, wave_number: u32) -> Wave {
        let val = WAVE_DATA.with(|wd| {
            let wave_data = wd.borrow();
            
            if let Some(wave) = wave_data.get(&wave_number) {
                return Some(wave.clone());
            }

            None
        });

        if let Some(wave_data) = val {
            return wave_data;
        }

        let val = INFINITE_WAVE_DATA.with(|iwd| {
            let infinite_wave_data = iwd.borrow();

            if let Some(infinite_wave) = infinite_wave_data.iter().find(|iw| iw.applies_to(wave_number)) {
                return Some(infinite_wave.generate_wave(wave_number));
            }

            None
        });

        if let Some(wave_data) = val {
            return wave_data;
        }

        unreachable!();
    }

    pub fn toggle_day_night(&self, is_day: bool) {
        if is_day == false {
            if self.timed_out == true {
                self.set_property("timed_out", Box::new(false));
                return;
            }

            let new_wave = self.wave + 1;

            self.set_property("wave", Box::new(new_wave));
            self.set_property("wave_commenced", Box::new(true));

            let cycle_data = CONFIG.with(|c| c.borrow().day_night_cycle.clone());

            let wave_data = self.get_wave_data(new_wave);

            let mut spawn_ticks: HashMap<u32, Vec<ZombieType>> = HashMap::new();

            for spawn_rule in wave_data.spawn_rules.iter() {
                let first_spawn_tick = cycle_data.night_start_tick + (spawn_rule.start_percentage * cycle_data.night_length_ticks as f32) as u32;
                let last_spawn_tick = cycle_data.night_start_tick + (spawn_rule.end_percentage * cycle_data.night_length_ticks as f32) as u32;

                let ticks_between_spawns = cmp::max((last_spawn_tick - first_spawn_tick) / spawn_rule.count, 1);

                for tick in (first_spawn_tick..last_spawn_tick).step_by(ticks_between_spawns as usize) {
                    spawn_ticks.entry(tick).or_insert_with(Vec::new).push(spawn_rule.zombie_type.clone())
                }
            }

            let wave_data = WaveData {
                spawn_ticks,
                wave_commenced: true
            };

            self.set_property("wave_data", Box::new(wave_data));

            // for _ in 0..1000 {
            //     let position = self.generate_zombie_position();

            //     self.spawn_zombie(ZombieColours::Grey, 1, position);
            // }
        } else {
            self.set_property("wave_commenced", Box::new(false));
        }
    }

    pub fn spawn_zombies(&self) {
        if self.wave_data.wave_commenced == false {
            return;
        }

        let tick_number = CONFIG.with(|c| c.borrow().tick_number);

        let wave_data = match self.wave_data.spawn_ticks.get(&tick_number) {
            Some(e) => e,
            None => return
        };

        for zombie_type in wave_data.iter() {
            let position = self.generate_zombie_position();

            self.spawn_zombie(zombie_type.colour, zombie_type.tier, position);
        }
    }

    pub fn spawn_zombie(&self, zombie_colour: ZombieColours, tier: u8, position: Position) {
        let zombie_entity = manager::create_entity(
            AllEntityTypesEnum::Zombie,
            None,
            position,
            0,
            Some(|entity| {
                let mut zombie_entity = match entity {
                    EntityTypeEnum::Zombie(entity) => entity,
                    _ => unreachable!(),
                };

                zombie_entity.zombie_colour = zombie_colour;
                zombie_entity.tier = tier;
                zombie_entity.target_uid = Some(self.base_building.generic_entity.uid);

                zombie_entity.initialise();

                EntityTypeEnum::Zombie(zombie_entity)
            }),
        )
        .unwrap();

        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let self_entity = entities.get_mut(&self.base_building.generic_entity.uid).unwrap();

            let EntityTypeEnum::Factory(self_entity) = self_entity else {
                unreachable!();
            };

            self_entity.zombie_uids.push(zombie_entity.generic_entity().uid);
        });
    }

    fn weighted_random_sector(&self) -> usize {
        let total_weight: f32 = self.radial_distribution.iter().sum();

        // If there are no buildings, pick a completely ranodm sector
        if total_weight <= 0.0 {
            return rand::thread_rng().gen_range(0..self.radial_distribution.len());
        }

        let mut rng = rand::thread_rng();
        let random_value = rng.gen_range(0.0..total_weight);

        let mut cumulative_weight = 0.0;
        for (i, &weight) in self.radial_distribution.iter().enumerate() {
            cumulative_weight += weight;
            if random_value <= cumulative_weight {
                return i;
            }
        }

        self.radial_distribution.len() - 1 // Fallback
    }

    fn generate_zombie_position(&self) -> Position {
        let random_sector = self.weighted_random_sector();
        let sector_angle = (random_sector as f32 - 90.0) * PI / 180.0;

        // TODO: min_distance must depend on the buildings
        // They must spawn a bit further out than the furthest building
        let min_distance: f32 = 1400.0;

        let self_pos = &self.base_building.generic_entity.position;
        let self_x = self_pos.x as f32;
        let self_y = self_pos.y as f32;

        let spawn_x = self_x + sector_angle.cos() * min_distance;
        let spawn_y = self_y + sector_angle.sin() * min_distance;

        let mut rng = rand::thread_rng();
        let random_angle = rng.gen_range(0.0..(2.0 * PI));
        let random_offset = rng.gen_range(0.0..192.0);

        let x = (spawn_x + random_offset * random_angle.cos())
            .clamp(0.0, WORLD_WIDTH as f32)
            .round() as i16;

        let y = (spawn_y + random_offset * random_angle.sin())
            .clamp(0.0, WORLD_HEIGHT as f32)
            .round() as i16;

        Position { x, y }

        // let mut rng = rand::thread_rng();
        // let rand_angle = rng.gen_range(0.0..(2.0 * PI));

        // let this_position = &self.base_building.generic_entity.position;

        // let x = this_position.x as f32 + 1000.0 * rand_angle.cos();
        // let y = this_position.y as f32 + 1000.0 * rand_angle.sin();

        // Position {
        //     x: x as i16,
        //     y: y as i16,
        // }
    }

    pub fn on_zombie_died(&self, zombie_uid: u16) {
        if self.zombie_uids.contains(&zombie_uid) {
            let mut zombie_uids = self.zombie_uids.clone();

            if let Some(index) = zombie_uids.iter().position(|&x| x == zombie_uid) {
                zombie_uids.remove(index);
            } else {
                return;
            }

            self.set_property("zombie_uids", Box::new(zombie_uids));
        }
    }
}

impl BuildingTrait for Factory {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let mut factory_entity = Factory {
            aggro_enabled: false,
            warming_up: false,
            last_update_tick: 0,
            enemy_query_range: 50.0,
            enemies_queried: HashMap::new(),
            wave: 0,
            zombie_uids: Vec::new(),
            timed_out: false,
            timeout_info: SpellInfo {
                spell_name: "Timeout".to_string(),
                timer_active: false,
                timer_end_tick: 0,
                icon_end_tick: 0
            },
            rapidfire_info: SpellInfo {
                spell_name: "Rapidfire".to_string(),
                timer_active: false,
                timer_end_tick: 0,
                icon_end_tick: 0
            },
            base_building: Building::new(uid, position, rotation, "Factory".to_owned()),
            wave_data: WaveData {
                spawn_ticks: HashMap::new(),
                wave_commenced: false
            },
            zombie_pathfinding_grid: ZombiePathfindingGrid {
                // width * 2
                grid: Vec::new(),
                width: 48,
                height: 48,
                x_offset: 0,
                y_offset: 0
            },
            cell_position: Position { x: 0, y: 0 },
            last_building_update_tick: None,
            hit_count_by_party: HashMap::new(),
            hit_count_by_ip: HashMap::new(),
            radial_distribution: [0.0; RADIAL_DISTRIBUTION_SECTOR_COUNT]
        };

        // Generate the zombie pathfinding grid

        factory_entity.zombie_pathfinding_grid.grid.resize_with((factory_entity.zombie_pathfinding_grid.width * 2) as usize, Vec::new);

        // Position.x and Position.y are always divisible by 24
        let grid_start_pos_x = factory_entity.base_building.generic_entity.position.x - factory_entity.zombie_pathfinding_grid.width / 2 * pathfinding_rs::GRID_SIZE_TO_WORLD;
        // let grid_end_pos_x = factory_entity.base_building.generic_entity.position.x + factory_entity.zombie_pathfinding_grid.width / 2 * pathfinding_rs::GRID_SIZE_TO_WORLD;
        factory_entity.zombie_pathfinding_grid.x_offset = grid_start_pos_x;

        let grid_start_pos_y = factory_entity.base_building.generic_entity.position.y - factory_entity.zombie_pathfinding_grid.height / 2 * pathfinding_rs::GRID_SIZE_TO_WORLD;
        // let grid_end_pos_y = factory_entity.base_building.generic_entity.position.y + factory_entity.zombie_pathfinding_grid.height / 2 * pathfinding_rs::GRID_SIZE_TO_WORLD;
        factory_entity.zombie_pathfinding_grid.y_offset = grid_start_pos_y;

        factory_entity.cell_position.x = (position.x - position.x % pathfinding_rs::GRID_SIZE_TO_WORLD - grid_start_pos_x) / pathfinding_rs::GRID_SIZE_TO_WORLD;
        factory_entity.cell_position.y = (position.y - position.y % pathfinding_rs::GRID_SIZE_TO_WORLD - grid_start_pos_y) / pathfinding_rs::GRID_SIZE_TO_WORLD;

        for x in 0..factory_entity.zombie_pathfinding_grid.width * 2 {
            factory_entity.zombie_pathfinding_grid.grid[x as usize] = Vec::with_capacity((factory_entity.zombie_pathfinding_grid.height * 2) as usize);

            for y in 0..factory_entity.zombie_pathfinding_grid.height * 2 {
                factory_entity.zombie_pathfinding_grid.grid[x as usize].push(pathfinding_rs::GridNode {
                    position: Position {
                        x: x * pathfinding_rs::GRID_SIZE_TO_WORLD + factory_entity.zombie_pathfinding_grid.x_offset,
                        y: y * pathfinding_rs::GRID_SIZE_TO_WORLD + factory_entity.zombie_pathfinding_grid.y_offset
                    },
                    cell_position: (x as u16, y as u16),
                    weight: 1,
                    next_step: Vec::new()
                })
            }
        }

        let self_position = position.clone();

        let query_shape = Cuboid::new(vector![factory_entity.zombie_pathfinding_grid.width as f32, factory_entity.zombie_pathfinding_grid.height as f32]);
        let query_filter = QueryFilter::default();

        physics::intersections_with_shape(
            &self_position,
            0,
            query_shape,
            query_filter,
            |handle, collider_set, rigid_body_set| -> bool {
                let rigid_body = physics::get_rigid_body_from_collider_handle(
                    handle,
                    &collider_set,
                    &rigid_body_set,
                );

                if let Some(rigid_body) = rigid_body {
                    let entity_uid = rigid_body.user_data as u16;

                    ENTITIES.with(|e| {
                        let entities = e.borrow();

                        let entity = entities.get(&entity_uid);

                        if let Some(entity) = entity {
                            if entity.generic_entity().model.as_str() != "Resource" {
                                return;
                            }

                            let EntityTypeEnum::Resource(resource_entity) = entity else {
                                return;
                            };

                            let resource_position = &entity.generic_entity().position;

                            let resource_radius = resource_entity.radius;

                            let top_left_cell_x = (resource_position.x as f32 - resource_radius).floor() as i16;
                            let top_left_cell_y = (resource_position.y as f32 - resource_radius).floor() as i16;

                            let bottom_right_cell_x = (resource_position.x as f32 + resource_radius).ceil() as i16;
                            let bottom_right_cell_y = (resource_position.y as f32 + resource_radius).ceil() as i16;

                            for x in (top_left_cell_x..bottom_right_cell_x).step_by(pathfinding_rs::GRID_SIZE_TO_WORLD as usize) {
                                for y in (top_left_cell_y..bottom_right_cell_y).step_by(pathfinding_rs::GRID_SIZE_TO_WORLD as usize) {
                                    let cell_x = (x - x % pathfinding_rs::GRID_SIZE_TO_WORLD - factory_entity.zombie_pathfinding_grid.x_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;
                                    let cell_y = (y - y % pathfinding_rs::GRID_SIZE_TO_WORLD - factory_entity.zombie_pathfinding_grid.y_offset) / pathfinding_rs::GRID_SIZE_TO_WORLD;

                                    if cell_x < 0 || cell_x > factory_entity.zombie_pathfinding_grid.width {
                                        return;
                                    }
                            
                                    if cell_y < 0 || cell_y > factory_entity.zombie_pathfinding_grid.width {
                                        return;
                                    }

                                    let grid_node = &mut factory_entity.zombie_pathfinding_grid.grid[cell_x as usize][cell_y as usize];

                                    let closest_x = cmp::max(grid_node.position.x, cmp::min(resource_position.x, grid_node.position.x + pathfinding_rs::GRID_SIZE_TO_WORLD));
                                    let closest_y = cmp::max(grid_node.position.y, cmp::min(resource_position.y, grid_node.position.y + pathfinding_rs::GRID_SIZE_TO_WORLD));

                                    let dist = ((closest_x - resource_position.x).pow(2) + (closest_y - resource_position.y).pow(2)) as f32;

                                    if dist <= resource_radius.powf(2.0) {
                                        grid_node.weight = u32::MAX;
                                    }
                                }
                            }
                        }
                    });
                }

                true
        });

        // for tick in (cycle_data.night_start_tick..cycle_data.night_length_ticks + number_of_spawn_ticks).step_by(ticks_between_spawns as usize) {


        // let zombie_entity = manager::create_entity(
        //     AllEntityTypesEnum::Zombie,
        //     None,
        //     Position { x: grid_start_pos_x, y: grid_start_pos_y},
        //     0,
        //     Some(|e| {
        //         let mut zombie_entity = match e {
        //             EntityTypeEnum::Zombie(entity) => entity,
        //             _ => unreachable!(),
        //         };

        //         zombie_entity.zombie_colour = ZombieColours::Grey;
        //         zombie_entity.tier = 1;
        //         zombie_entity.target_uid = Some(entity.base_building.generic_entity.uid);

        //         zombie_entity.initialise();

        //         EntityTypeEnum::Zombie(zombie_entity)
        //     }),
        // )
        // .unwrap();

        // entity.zombie_uids.push(zombie_entity.generic_entity().uid);

        return factory_entity;
    }

    fn on_tick(&mut self, tick_number: u32) {
        if tick_number == self.last_update_tick {
            return;
        }

        self.set_property("last_update_tick", Box::new(tick_number));

        self.base_building.on_tick(tick_number);

        self.update_aggression_state(tick_number);

        // Check status of timeout timer
        if self.timeout_info.timer_active == true {
            if tick_number >= self.timeout_info.timer_end_tick {
                self.set_property("timeout_timer_active", Box::new(false));
            }
        }

        if self.rapidfire_info.timer_active == true {
            if tick_number >= self.rapidfire_info.timer_end_tick {
                self.set_property("rapidfire_timer_active", Box::new(false));
            }
        }

        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);

        match self.last_building_update_tick {
            Some(last_building_update_tick) => {
                if tick_number >= last_building_update_tick + PATH_CLEAR_FREQUENCY_MS / tick_rate as u32 {
                    ENTITIES.with(|e| {
                        let mut entities = e.borrow_mut();
                        let self_entity = entities.get_mut(&self.base_building.generic_entity.uid).unwrap();

                        let EntityTypeEnum::Factory(self_entity) = self_entity else {
                            unreachable!();
                        };

                        self_entity.last_building_update_tick = None;

                        for column in self_entity.zombie_pathfinding_grid.grid.iter_mut() {
                            for node in column.iter_mut() {
                                node.next_step.clear();
                            }
                        }
                    });
                }
            },
            None => {}
        }

        self.enemies_queried.clear();

        let mut enemies_queried: HashMap<Position, HashSet<u16>> = HashMap::new();

        let self_translation = self.base_building.generic_entity.position.clone();

        let query_shape = Cuboid::new(vector![self.enemy_query_range, self.enemy_query_range]);
        let query_filter = QueryFilter::default();

        physics::intersections_with_shape(
            &self_translation,
            0,
            query_shape,
            query_filter,
            |handle, collider_set, rigid_body_set| -> bool {
                let rigid_body = physics::get_rigid_body_from_collider_handle(
                    handle,
                    &collider_set,
                    &rigid_body_set,
                );
                if let Some(rigid_body) = rigid_body {
                    let entity_uid = rigid_body.user_data as u16;

                    let enemy_entity_exists = ENTITIES.with(|e| {
                        let entities = e.borrow();

                        let entity = entities.get(&entity_uid);

                        match entity {
                            Some(entity) => {
                                if self.check_entity_is_enemy(entity) {
                                    true
                                } else {
                                    false
                                }
                            }
                            None => false,
                        }
                    });

                    if !enemy_entity_exists {
                        return true;
                    };

                    let entity_translation = rigid_body.translation();

                    let entity_rounded_position = Position {
                        x: (entity_translation.x.floor() * PIXEL_TO_WORLD as f32) as i16,
                        y: (entity_translation.y.floor() * PIXEL_TO_WORLD as f32) as i16,
                    };

                    let hash_set = enemies_queried
                        .entry(entity_rounded_position)
                        .or_insert_with(HashSet::<u16>::new);

                    hash_set.insert(entity_uid);
                }

                true
            },
        );

        self.set_property("enemies_queried", Box::new(enemies_queried));

        self.spawn_zombies();
    }

    fn upgrade(&self, tick_number: u32) {
        self.base_building.upgrade(tick_number);
    }

    fn take_damage(&self, damage: u16, entity: &EntityTypeEnum) -> u16 {
        match entity {
            EntityTypeEnum::Player(player_entity) => {
                self.register_hit(player_entity.party_id, player_entity.ip_address);
            },
            _ => {}
        };

        self.base_building.take_damage(damage, entity)
    }

    fn die(&mut self) {
        self.base_building.die();
    }

    fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.base_building.generic_entity.uid, |entity| {
            let EntityTypeEnum::Factory(entity) = entity else {
                panic!("Expected a Factory entity, but got a different type");
            };

            // this boolean is only used with variables that should be tracked to be sent to the client
            let mut should_update_client: bool = false;

            match property_name {
                "position" => {
                    if let Some(position) = value.downcast_ref::<Position>() {
                        entity.base_building.generic_entity.position = *position;

                        should_update_client = true;
                    }
                }
                "zombie_uids" => {
                    if let Ok(zombie_uids) = value.downcast::<Vec<u16>>() {
                        entity.zombie_uids = *zombie_uids;
                    }
                }
                "party_id" => {
                    if let Some(party_id) = value.downcast_ref::<u32>() {
                        entity.base_building.party_id = *party_id;

                        should_update_client = true;
                    }
                }
                "tier" => {
                    if let Some(tier) = value.downcast_ref::<u8>() {
                        entity.base_building.tier = *tier;

                        should_update_client = true;
                    }
                }
                "wave" => {
                    if let Some(wave) = value.downcast_ref::<u32>() {
                        entity.wave = *wave;
                    }
                }
                "last_update_tick" => {
                    if let Some(last_update_tick) = value.downcast_ref::<u32>() {
                        entity.last_update_tick = *last_update_tick;
                    }
                }
                "enemies_queried" => {
                    if let Ok(enemies_queried) = value.downcast::<HashMap<Position, HashSet<u16>>>()
                    {
                        entity.enemies_queried = *enemies_queried;
                    }
                },
                "timed_out" => {
                    if let Some(timed_out) = value.downcast_ref::<bool>() {
                        entity.timed_out = *timed_out;
                    }
                },
                "timeout_timer_active" => {
                    if let Some(timer_active) = value.downcast_ref::<bool>() {
                        entity.timeout_info.timer_active = *timer_active;
                    }
                },
                "timeout_timer_end_tick" => {
                    if let Some(timer_end_tick) = value.downcast_ref::<u32>() {
                        entity.timeout_info.timer_end_tick = *timer_end_tick;
                    }
                },
                "rapidfire_timer_active" => {
                    if let Some(timer_active) = value.downcast_ref::<bool>() {
                        entity.rapidfire_info.timer_active = *timer_active;
                    }
                },
                "rapidfire_timer_end_tick" => {
                    if let Some(timer_end_tick) = value.downcast_ref::<u32>() {
                        entity.rapidfire_info.timer_end_tick = *timer_end_tick;
                    }
                },
                "wave_commenced" => {
                    if let Some(wave_commenced) = value.downcast_ref::<bool>() {
                        entity.wave_data.wave_commenced = *wave_commenced;
                    }
                },
                "wave_data" => {
                    if let Ok(wave_data) = value.downcast::<WaveData>()
                    {
                        entity.wave_data = *wave_data;
                    }
                }
                _ => panic!("Unknown property '{}'", property_name),
            }

            if should_update_client == true {
                manager::flag_property_as_changed(
                    self.base_building.generic_entity.uid,
                    property_name,
                );
            }
        })
    }
}

impl EntityTrait for Factory {
    fn on_die(&self) {
        for zombie_uid in &self.zombie_uids {
            manager::kill_entity(&zombie_uid);
        }

        let (building_uids, member_uids) = PARTIES.with(|parties| {
            let parties = parties.borrow_mut();
    
            let party = parties.get(&self.base_building.party_id).unwrap();

            (party.buildings.clone(), party.members.clone())
        });
    
        for uid in building_uids.iter() {
            if *uid == self.base_building.generic_entity.uid {
                continue;
            }
            manager::kill_entity(&uid);
        }

        for uid in member_uids.iter() {
            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let member_entity = entities.get_mut(uid).unwrap();

                let EntityTypeEnum::Player(player_entity) = member_entity else {
                    unreachable!();
                };

                player_entity.die(DeathReasons::FactoryDied);
            })
        }

        self.base_building.on_die();
    }
}
