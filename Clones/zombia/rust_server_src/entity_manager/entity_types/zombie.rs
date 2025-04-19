use super::building::BuildingTrait;
use super::generic_entity::{self, Position};
use super::Player;
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::manager::{self, ENTITIES};
use crate::physics::PIXEL_TO_WORLD;
use crate::{physics, CONFIG};
use rand::Rng;
use rapier2d::prelude::*;
use std::any::Any;
use std::f32::consts::PI;

pub const ZOMBIE_TIERS: usize = 8;

struct ZombieInfo {
    acceleration: [u8; ZOMBIE_TIERS],
    max_velocity: [u8; ZOMBIE_TIERS],
    damage_to_buildings: [u16; ZOMBIE_TIERS],
    damage_to_players: [u16; ZOMBIE_TIERS],
    range: [u8; ZOMBIE_TIERS],
    ms_between_fires: [u32; ZOMBIE_TIERS],
    health: [u16; ZOMBIE_TIERS],
    radius: [f32; ZOMBIE_TIERS]
}

const GREY_ZOMBIE_INFO: ZombieInfo = ZombieInfo {
    acceleration: [2, 2, 3, 2, 2, 2, 2, 2],
    max_velocity: [40, 40, 50, 40, 45, 50, 60, 65],
    damage_to_buildings: [5, 5, 15, 30, 50, 60, 70, 80],
    damage_to_players: [2, 2, 2, 2, 2, 3, 3, 4],
    range: [16, 16, 16, 16, 16, 16, 16, 16],
    ms_between_fires: [500, 500, 400, 500, 500, 500, 500, 400],
    health: [120, 150, 180, 200, 220, 240, 250, 250],
    radius: [18.0, 20.0, 20.0, 20.0, 22.0, 24.0, 24.0, 24.0]
};

const GREEN_ZOMBIE_INFO: ZombieInfo = ZombieInfo {
    acceleration: [4, 3, 3, 2, 2, 2, 2, 2],
    max_velocity: [35, 35, 40, 40, 45, 50, 60, 65],
    damage_to_buildings: [110, 112, 112, 115, 115, 125, 130, 130],
    damage_to_players: [5, 5, 6, 6, 7, 7, 8, 10],
    range: [16, 16, 16, 16, 16, 16, 16, 16],
    ms_between_fires: [500, 500, 400, 500, 500, 500, 500, 500],
    health: [250, 250, 250, 260, 280, 300, 320, 350],
    radius: [18.0, 20.0, 20.0, 20.0, 22.0, 24.0, 24.0, 24.0]
};

const BLUE_ZOMBIE_INFO: ZombieInfo = ZombieInfo {
    acceleration: [5, 4, 3, 2, 2, 2, 2, 2],
    max_velocity: [35, 35, 40, 40, 45, 50, 60, 65],
    damage_to_buildings: [125, 130, 125, 130, 130, 145, 150, 150],
    damage_to_players: [10, 15, 15, 20, 25, 25, 30, 50],
    range: [16, 16, 16, 16, 16, 16, 16, 16],
    ms_between_fires: [400, 400, 400, 400, 400, 400, 400, 300],
    health: [350, 375, 400, 400, 400, 500, 500, 600],
    radius: [18.0, 20.0, 22.0, 22.0, 24.0, 26.0, 26.0, 26.0]
};

const RED_ZOMBIE_INFO: ZombieInfo = ZombieInfo {
    acceleration: [5, 4, 3, 2, 2, 2, 2, 2],
    max_velocity: [35, 35, 40, 40, 45, 50, 60, 70],
    damage_to_buildings: [180, 200, 220, 250, 250, 250, 250, 300],
    damage_to_players: [50, 80, 100, 100, 100, 100, 100, 100],
    range: [16, 16, 16, 16, 16, 16, 16, 16],
    ms_between_fires: [400, 400, 400, 400, 400, 400, 500, 600],
    health: [1200, 1500, 1200, 1500, 1800, 1900, 2000, 2400],
    radius: [18.0, 20.0, 22.0, 22.0, 24.0, 26.0, 26.0, 26.0]
};

#[derive(Clone, Debug, Copy)]
pub enum ZombieColours {
    Grey,
    Green,
    Blue,
    Red,
}

impl ZombieColours {
    pub fn colour_as_index(&self) -> u8 {
        match self {
            Self::Grey => 0,
            Self::Green => 1,
            Self::Blue => 2,
            Self::Red => 3,
        }
    }
}

#[derive(Clone, Debug)]
pub struct Zombie {
    pub generic_entity: generic_entity::GenericEntity,
    pub acceleration: u8,
    pub max_velocity: u8,
    pub zombie_colour: ZombieColours,
    pub radius: f32,
    pub dead: bool,
    pub last_damaged_tick: u32,
    pub firing_tick: u32,
    pub health: u16,
    pub max_health: u16,
    pub damage_to_players: u16,
    pub damage_to_buildings: u16,
    pub range: u8,
    pub tier: u8,
    pub target_uid: Option<u16>,
    pub yaw: u16,
    pub target_yaw: u16,
    pub ms_between_fires: u32,
    pub target_position: Position,
    pub last_path_updated_tick: u32
}

const PATHFIND_FREQUENCY_MS: u32 = 3000;

impl Zombie {
    pub fn new(uid: u16, position: Position, rotation: u16) -> Self {
        let zombie_instance = Zombie {
            generic_entity: generic_entity::GenericEntity::new(uid, "Zombie".to_owned(), position),
            damage_to_buildings: 0,
            damage_to_players: 0,
            acceleration: 0,
            max_velocity: 0,
            zombie_colour: ZombieColours::Grey,
            dead: false,
            radius: 10.0,
            last_damaged_tick: 0,
            firing_tick: 0,
            range: 0,
            health: 100,
            max_health: 100,
            ms_between_fires: 0,
            tier: 1,
            target_uid: None,
            yaw: rotation,
            target_yaw: rotation,
            target_position: Position { x: 0, y: 0 },
            last_path_updated_tick: 0
        };

        return zombie_instance;
    }

    pub fn initialise(&mut self) {
        let tier_index_usize = (self.tier - 1) as usize;

        match self.zombie_colour {
            ZombieColours::Grey => {
                self.health = GREY_ZOMBIE_INFO.health[tier_index_usize];
                self.max_health = GREY_ZOMBIE_INFO.health[tier_index_usize];
                self.radius = GREY_ZOMBIE_INFO.radius[tier_index_usize];
                self.acceleration = GREY_ZOMBIE_INFO.acceleration[tier_index_usize];
                self.max_velocity = GREY_ZOMBIE_INFO.max_velocity[tier_index_usize];
                self.damage_to_buildings = GREY_ZOMBIE_INFO.damage_to_buildings[tier_index_usize];
                self.damage_to_players = GREY_ZOMBIE_INFO.damage_to_players[tier_index_usize];
                self.ms_between_fires = GREY_ZOMBIE_INFO.ms_between_fires[tier_index_usize];
                self.range = GREY_ZOMBIE_INFO.range[tier_index_usize];
            }
            ZombieColours::Green => {
                self.health = GREEN_ZOMBIE_INFO.health[tier_index_usize];
                self.max_health = GREEN_ZOMBIE_INFO.health[tier_index_usize];
                self.radius = GREEN_ZOMBIE_INFO.radius[tier_index_usize];
                self.acceleration = GREEN_ZOMBIE_INFO.acceleration[tier_index_usize];
                self.max_velocity = GREEN_ZOMBIE_INFO.max_velocity[tier_index_usize];
                self.damage_to_buildings = GREEN_ZOMBIE_INFO.damage_to_buildings[tier_index_usize];
                self.damage_to_players = GREEN_ZOMBIE_INFO.damage_to_players[tier_index_usize];
                self.ms_between_fires = GREEN_ZOMBIE_INFO.ms_between_fires[tier_index_usize];
                self.range = GREEN_ZOMBIE_INFO.range[tier_index_usize];
            }
            ZombieColours::Blue => {
                self.health = BLUE_ZOMBIE_INFO.health[tier_index_usize];
                self.max_health = BLUE_ZOMBIE_INFO.health[tier_index_usize];
                self.radius = BLUE_ZOMBIE_INFO.radius[tier_index_usize];
                self.acceleration = BLUE_ZOMBIE_INFO.acceleration[tier_index_usize];
                self.max_velocity = BLUE_ZOMBIE_INFO.max_velocity[tier_index_usize];
                self.damage_to_buildings = BLUE_ZOMBIE_INFO.damage_to_buildings[tier_index_usize];
                self.damage_to_players = BLUE_ZOMBIE_INFO.damage_to_players[tier_index_usize];
                self.ms_between_fires = BLUE_ZOMBIE_INFO.ms_between_fires[tier_index_usize];
                self.range = BLUE_ZOMBIE_INFO.range[tier_index_usize];
            }
            ZombieColours::Red => {
                self.health = RED_ZOMBIE_INFO.health[tier_index_usize];
                self.max_health = RED_ZOMBIE_INFO.health[tier_index_usize];
                self.radius = RED_ZOMBIE_INFO.radius[tier_index_usize];
                self.acceleration = RED_ZOMBIE_INFO.acceleration[tier_index_usize];
                self.max_velocity = RED_ZOMBIE_INFO.max_velocity[tier_index_usize];
                self.damage_to_buildings = RED_ZOMBIE_INFO.damage_to_buildings[tier_index_usize];
                self.damage_to_players = RED_ZOMBIE_INFO.damage_to_players[tier_index_usize];
                self.ms_between_fires = RED_ZOMBIE_INFO.ms_between_fires[tier_index_usize];
                self.range = RED_ZOMBIE_INFO.range[tier_index_usize];
            }
        }
    
        let collision_group = InteractionGroups::new(
            Group::GROUP_2,
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3 | Group::GROUP_4,
        );

        physics::create_rigid_body(
            &self.generic_entity.uid,
            physics::RigidBodyType::Dynamic {
                linear_damping_factor: 24.0,
            },
            &self.generic_entity.position,
            0,
            physics::ColliderShapes::Ball {
                radius: self.radius,
            },
            collision_group,
            None,
            None
        );
    }

    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.generic_entity.uid, |entity| {
            let EntityTypeEnum::Zombie(zombie_entity) = entity else {
                unreachable!()
            };

            // this boolean is only used with variables that should be tracked to be sent to the client
            let mut should_update_client: bool = false;

            match property_name {
                "position" => {
                    if let Some(position) = value.downcast_ref::<Position>() {
                        zombie_entity.generic_entity.position = *position;

                        should_update_client = true;
                    }
                }
                "yaw" => {
                    if let Some(yaw) = value.downcast_ref::<u16>() {
                        zombie_entity.yaw = *yaw;

                        should_update_client = true;
                    }
                }
                "health" => {
                    if let Some(health) = value.downcast_ref::<u16>() {
                        zombie_entity.health = *health;

                        should_update_client = true;
                    }
                }
                "firing_tick" => {
                    if let Some(firing_tick) = value.downcast_ref::<u32>() {
                        zombie_entity.firing_tick = *firing_tick;

                        should_update_client = true;
                    }
                }
                "dead" => {
                    if let Some(dead) = value.downcast_ref::<bool>() {
                        zombie_entity.dead = *dead;
                    }
                }
                _ => panic!("Unknown property '{}'", property_name),
            }

            if should_update_client == true {
                manager::flag_property_as_changed(self.generic_entity.uid, property_name);
            }
        })
    }

    pub fn on_tick(&mut self, tick_number: u32) {
        let (is_day, tick_rate, day_length_ticks) = CONFIG.with(|c| {
            let config = c.borrow();

            (
                config.day_night_cycle.is_day,
                config.tick_rate,
                config.day_night_cycle.day_length_ticks,
            )
        });

        if is_day == true {
            let day_damage = self.max_health / (day_length_ticks as u16 / 2);

            let self_entity = EntityTypeEnum::Zombie(self.clone());

            self.take_damage(day_damage, &self_entity);
        }

        if tick_number - self.firing_tick > self.ms_between_fires / tick_rate as u32 {
            self.engage_enemies(tick_number);
        }

        let dist_to_target = self.generic_entity.position.distance_to(&self.target_position) / PIXEL_TO_WORLD as u32;

        // How far away (in cell count) the zombie has to be before it's forced to update its path
        // This number is the number of cells squared
        let path_update_distance: u32 = 8;

        let mut rng = rand::thread_rng();
        let random_offset: i32 = rng.gen_range(-1500..=750);

        let pathfind_frequency = if random_offset > 0 {
            PATHFIND_FREQUENCY_MS + random_offset as u32
        } else {
            PATHFIND_FREQUENCY_MS - random_offset.abs() as u32
        };

        // If it's been too long since the last pathfind...
        if tick_number - self.last_path_updated_tick > pathfind_frequency / tick_rate as u32 ||
            dist_to_target < path_update_distance
            {
            match self.target_uid {
                None => {},
                Some(uid) => {
                    ENTITIES.with(|e| {
                        let mut entities = e.borrow_mut();
                        let entity = entities.get_mut(&uid).unwrap();
    
                        let EntityTypeEnum::Factory(factory_entity) = entity else {
                            unreachable!();
                        };
    
                        let new_target_position = factory_entity.get_zombie_path(&self.generic_entity.position);

                        let self_entity = entities.get_mut(&self.generic_entity.uid).unwrap();
    
                        let EntityTypeEnum::Zombie(self_entity) = self_entity else {
                            unreachable!();
                        };

                        self_entity.target_position = new_target_position.clone();
                        self_entity.last_path_updated_tick = tick_number;

                        // This only updates the clone of the zombie, not the actual zombie, to be used below
                        self.target_position = new_target_position;
                    });
                }
            }
        }

        let angle_to_target_position = self.generic_entity.position.angle_to(&self.target_position);

        if angle_to_target_position != self.target_yaw {
            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let self_entity = entities.get_mut(&self.generic_entity.uid).unwrap();

                let EntityTypeEnum::Zombie(self_entity) = self_entity else {
                    unreachable!()
                };

                self_entity.target_yaw = angle_to_target_position;
            });
        }

        self.update_yaw();

        self.apply_impulse_at_yaw(30, Some(angle_to_target_position));
    }

    pub fn update_yaw(&self) {
        const YAW_INCREMENT: f32 = 14.0;

        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let self_entity = entities.get_mut(&self.generic_entity.uid).unwrap();

            let EntityTypeEnum::Zombie(self_entity) = self_entity else {
                unreachable!()
            };

            let current_yaw = self_entity.yaw as f32;
            let target_yaw = self_entity.target_yaw as f32;

            let diff = ((target_yaw - current_yaw + 360.0) % 360.0).min(360.0 - ((target_yaw - current_yaw + 360.0) % 360.0));

            if diff > YAW_INCREMENT {
                if ((target_yaw - current_yaw + 360.0) % 360.0) < 180.0 {
                    self_entity.yaw = ((current_yaw + YAW_INCREMENT) % 360.0) as u16;
                } else {
                    self_entity.yaw = ((current_yaw + 360.0 - YAW_INCREMENT) % 360.0) as u16;
                }
            } else {
                self_entity.yaw = target_yaw as u16;
            }

            manager::flag_property_as_changed(self.generic_entity.uid, "yaw");
        });
    }

    pub fn engage_enemies(&self, tick_number: u32) {
        let query_shape = Ball::new((self.radius + self.range as f32) / PIXEL_TO_WORLD as f32);
        let query_filter = QueryFilter::default();

        let mut enemy_uids: Vec<u16> = Vec::new();

        physics::intersections_with_shape(
            &self.generic_entity.position,
            self.yaw,
            query_shape,
            query_filter,
            |collider_handle, _rigid_body_set, _collider_set| {
                let entity_uid = physics::get_entity_uid_from_collider_handle(collider_handle);

                // If there is no entity uid, the collider doesn't have a parent and may be the world boundaries
                let entity_uid = match entity_uid {
                    Some(uid) => uid,
                    None => {
                        return true;
                    }
                };

                if self.generic_entity.uid == entity_uid {
                    return true;
                }

                ENTITIES.with(|e| {
                    let entities = e.borrow();

                    match entities.get(&entity_uid) {
                        Some(entity) => {
                            match entity {
                                EntityTypeEnum::ArrowTower(_) => {},
                                EntityTypeEnum::CannonTower(_) => {},
                                EntityTypeEnum::Door(_) => {},
                                EntityTypeEnum::Drill(_) => {},
                                EntityTypeEnum::Factory(_) => {},
                                EntityTypeEnum::Harvester(_) => {},
                                EntityTypeEnum::LargeWall(_) => {},
                                EntityTypeEnum::LightningTower(_) => {},
                                EntityTypeEnum::MageTower(_) => {},
                                EntityTypeEnum::Player(_) => {},
                                EntityTypeEnum::RocketTower(_) => {},
                                EntityTypeEnum::SawTower(_) => {},
                                EntityTypeEnum::Wall(_) => {},
                                _ => {
                                    return;
                                }
                            }

                            enemy_uids.push(entity_uid);
                        }
                        None => {}
                    };
                });


                true
        });
    
        if enemy_uids.len() <= 0 {
            return;
        }
    
        self.set_property("firing_tick", Box::new(tick_number));

        for enemy_uid in enemy_uids {
            self.attack(enemy_uid);
        }
    }

    pub fn attack(&self, enemy_uid: u16) {
        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let mut enemy_entity = entities.get_mut(&enemy_uid).unwrap().clone();

            drop(entities);

            match enemy_entity {
                EntityTypeEnum::ArrowTower(_) |
                EntityTypeEnum::CannonTower(_) |
                EntityTypeEnum::Door(_) |
                EntityTypeEnum::Drill(_) |
                EntityTypeEnum::Factory(_) |
                EntityTypeEnum::Harvester(_) |
                EntityTypeEnum::LargeWall(_) |
                EntityTypeEnum::LightningTower(_) |
                EntityTypeEnum::MageTower(_) |
                EntityTypeEnum::RocketTower(_) |
                EntityTypeEnum::SawTower(_) |
                EntityTypeEnum::Wall(_) => self.damage_building(&mut enemy_entity),
                EntityTypeEnum::Player(ref mut player_entity) => self.damage_player(player_entity),
                _ => unreachable!()
            }
        });
    }

    pub fn damage_building(&self, entity: &mut EntityTypeEnum) {
        let self_entity = EntityTypeEnum::Zombie(self.clone());

        match entity {
            EntityTypeEnum::ArrowTower(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::CannonTower(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::Door(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::Drill(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::Factory(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::Harvester(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::LargeWall(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::LightningTower(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::MageTower(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::RocketTower(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::SawTower(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            EntityTypeEnum::Wall(entity) => entity.take_damage(self.damage_to_buildings, &self_entity),
            _ => unreachable!()
        };
    }

    pub fn damage_player(&self, player_entity: &mut Player) {
        let self_entity = EntityTypeEnum::Zombie(self.clone());

        player_entity.take_damage(self.damage_to_players, &self_entity);
    }

    pub fn take_damage(&self, damage: u16, _entity: &EntityTypeEnum) -> u16 {
        let mut damage_taken = 0;

        let mut self_health = self.health;

        if damage > self_health {
            damage_taken += self_health;
            self_health = 0;
        } else {
            self_health -= damage;
            damage_taken += damage;
        }

        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let self_entity = entities.get_mut(&self.generic_entity.uid).unwrap();

            let EntityTypeEnum::Zombie(self_entity) = self_entity else {
                unreachable!();
            };

            if self_entity.health != self_health {
                self_entity.health = self_health;
                manager::flag_property_as_changed(self.generic_entity.uid, "health");
            }
            
            if self_entity.health <= 0 {
                self_entity.die();
            }
        });

        damage_taken
    }

    pub fn die(&mut self) {
        if self.dead == true {
            return;
        }

        self.dead = true;

        manager::queue_kill_entity(self.generic_entity.uid);
    }

    fn apply_impulse_at_yaw(&self, speed: u8, yaw: Option<u16>) {
        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate) as f32;

        let yaw_f32 = match yaw {
            Some(yaw) => yaw as f32,
            None => self.yaw as f32,
        };

        let speed = speed as f32;

        let x_impulse = (yaw_f32 * PI / 180.0).sin() * speed / 1000.0 * tick_rate;
        let y_impulse = (yaw_f32 * PI / 180.0).cos() * speed / 1000.0 * tick_rate;

        let impulse = vector![x_impulse, -y_impulse];

        physics::apply_impulse_to_body(&self.generic_entity.uid, impulse, true);
    }
}

impl generic_entity::EntityTrait for Zombie {
    fn on_die(&self) {
        let factory_entity = match self.target_uid {
            Some(uid) => match manager::get_entity(uid) {
                Some(EntityTypeEnum::Factory(e)) => e,
                _ => unreachable!(),
            },
            None => unreachable!(),
        };

        factory_entity.on_zombie_died(self.generic_entity.uid);

        self.generic_entity.on_die();
    }
}
