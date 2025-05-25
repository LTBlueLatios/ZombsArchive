use super::building::{AttackingBuilding, AttackingBuildingTrait, Building, BuildingTrait};
use super::generic_entity::{EntityTrait, Position};
use super::{Player, Zombie};
use std::any::Any;
use std::collections::{HashMap, HashSet};
use crate::info::buildings::{self, BuildingInfoEnum, RangedTowerInfo, TIERS};
use crate::CONFIG;
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::{PARTIES, ENTITIES};

const ATTACK_TARGET_LIMIT: [u8; TIERS] = [2, 3, 3, 4, 4, 6, 8, 10];
const MAX_BEAM_BRIDGE_DIST_PIXELS: u32 = 192;
const MAX_BEAM_BRIDGE_DIST_PIXELS_SQUARED: u32 = MAX_BEAM_BRIDGE_DIST_PIXELS.pow(2);

#[derive(Clone, Debug)]
pub struct LightningTower {
    pub ranged_building: AttackingBuilding,
    pub target_beams: Vec<(i16, i16)>
}

impl LightningTower {
    fn find_target(&mut self, enemies_queried: &HashMap<Position, HashSet<u16>>, enemies_to_attack_uids: &mut Vec<(u16, Position)>, last_target_position: Position, attack_target_limit: u8) {
        let mut closest_enemy: (u16, u32) = (0, u32::MAX);
        let mut target_found: bool = false;

        for i in self.ranged_building.range_cells.iter() {
            match i {
                Some(cell_pos) => {
                    let cell = match enemies_queried.get(&cell_pos) {
                        Some(cell) => cell,
                        None => continue,
                    };

                    if cell.len() <= 0 {
                        continue;
                    }

                    for uid in cell.iter() {
                        if enemies_to_attack_uids.iter().any(|(enemy_uid, _)| *uid == *enemy_uid) {
                            continue;
                        }

                        ENTITIES.with(|e| {
                            let entities = e.borrow();

                            let enemy_entity = entities.get(uid).unwrap();

                            let enemy_position = &enemy_entity.generic_entity().position;

                            let dist_to_last_pos = last_target_position.distance_to(enemy_position);

                            // If this is the first enemy entity, the bridging distance does not apply
                            if enemies_to_attack_uids.len() > 0 {
                                if dist_to_last_pos > MAX_BEAM_BRIDGE_DIST_PIXELS_SQUARED {
                                    return;
                                }
                            }

                            if dist_to_last_pos < closest_enemy.1 {
                                closest_enemy = (*uid, dist_to_last_pos);
                                target_found = true;
                            }
                        })
                    }
                    continue;
                }
                None => {
                    if target_found == true {
                        break;
                    } else {
                        continue;
                    }
                }
            }
        }

        if target_found == true {
            let enemy_position = ENTITIES.with(|e| {
                let entities = e.borrow();

                let enemy_entity = entities.get(&closest_enemy.0).unwrap();

                enemy_entity.generic_entity().position.clone()
            });

            enemies_to_attack_uids.push((closest_enemy.0, enemy_position));

            if enemies_to_attack_uids.len() < attack_target_limit as usize {
                self.find_target(enemies_queried, enemies_to_attack_uids, enemy_position, attack_target_limit);
            }
        }
    }

    fn engage_enemies(&mut self, tick_number: u32) {
        let building_info = buildings::get_building(&self.ranged_building.base_building.generic_entity.model);
        let building_info = match &building_info {
            BuildingInfoEnum::Ranged(e) => e,
           _ => unreachable!()
        };
        let tier_index_usize = (self.ranged_building.base_building.tier - 1) as usize;
        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);
        let firing_rate = building_info.ms_between_fires[tier_index_usize];
        let firing_rate_ticks = firing_rate / tick_rate as u32;

        if self.ranged_building.firing_tick + firing_rate_ticks > tick_number {
            return;
        };

        // recursively call a function
        // find_target(last_target_position), starts at 0
        // on the first run it will find the closest enemy to the tower
        // on the second run it will find the closest enemy to the last target, etc.
        let enemies_queried = PARTIES.with(|p| {
            let parties = p.borrow();

            let party = parties.get(&self.ranged_building.base_building.party_id).unwrap();

            let primary_building_uid = party.primary_building_uid.unwrap();

            ENTITIES.with(|e| {
                let entities = e.borrow();

                match entities.get(&primary_building_uid).unwrap() {
                    EntityTypeEnum::Factory(e) => e.enemies_queried.clone(),
                    _ => unreachable!(),
                }
            })
        });

        let attack_target_limit = ATTACK_TARGET_LIMIT[tier_index_usize];

        let mut enemies_to_attack_uids: Vec<(u16, Position)> = Vec::new();

        if enemies_queried.len() <= 0 {
            if self.ranged_building.firing_tick != 0 {
                self.set_property("firing_tick", Box::new(0));
            }

            return;
        }

        self.find_target(&enemies_queried, &mut enemies_to_attack_uids, self.ranged_building.base_building.generic_entity.position.clone(), attack_target_limit);

        let mut target_beams: Vec<(i16, i16)> = Vec::new();

        for (enemy_uid, enemy_position) in enemies_to_attack_uids.iter() {
            target_beams.push((enemy_position.x, enemy_position.y));

            self.attack_enemy(*enemy_uid, building_info);
        }

        if target_beams.len() > 0 {
            self.set_property("firing_tick", Box::new(tick_number));
        } else {
            if self.ranged_building.firing_tick != 0 {
                self.set_property("firing_tick", Box::new(0));
            }
        }

        self.set_property("target_beams", Box::new(target_beams.clone()));
    }

    fn attack_enemy(&self, enemy_uid: u16, building_info: &RangedTowerInfo) {
        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let mut enemy_entity = entities.get_mut(&enemy_uid).unwrap().clone();

            drop(entities);

            match enemy_entity {
                EntityTypeEnum::Player(ref mut entity) => self.damage_player(entity, &building_info),
                EntityTypeEnum::Zombie(ref mut entity) => self.damage_zombie(entity, &building_info),
                _ => unreachable!()
            }
        })
    }

    fn damage_player(&self, player_entity: &mut Player, building_info: &RangedTowerInfo) {
        let tier_index_usize = (self.ranged_building.base_building.tier - 1) as usize;
        let damage_to_players = building_info.damage_to_players[tier_index_usize];

        let self_entity = EntityTypeEnum::LightningTower(self.clone());

        player_entity.take_damage(damage_to_players, &self_entity);
    }

    fn damage_zombie(&self, player_entity: &mut Zombie, building_info: &RangedTowerInfo) {
        let tier_index_usize = (self.ranged_building.base_building.tier - 1) as usize;
        let damage_to_zombies = building_info.damage_to_zombies[tier_index_usize];

        let self_entity = EntityTypeEnum::LightningTower(self.clone());

        player_entity.take_damage(damage_to_zombies, &self_entity);
    }
}

impl BuildingTrait for LightningTower {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let mut entity = LightningTower {
            target_beams: Vec::new(),
            ranged_building: AttackingBuilding {
                aiming_yaw: 0,
                firing_tick: 0,
                range_cells: Vec::new(),
                base_building: Building::new(uid, position, rotation, "LightningTower".to_owned()),
                rapidfire_buffed: false
            }
        };

        entity.ranged_building.range_cells = entity.update_range_cells().unwrap();

        return entity;
    }

    fn upgrade(&self, tick_number: u32) {
        self.ranged_building.base_building.upgrade(tick_number);
        self.update_range_cells();
    }

    fn on_tick(&mut self, tick_number: u32) {
        self.ranged_building.base_building.on_tick(tick_number);

        self.engage_enemies(tick_number);
    }

    fn take_damage(&self, damage: u16, entity: &EntityTypeEnum) -> u16 {
        self.ranged_building.base_building.take_damage(damage, entity)
    }

    fn die(&mut self) {
        self.ranged_building.base_building.die();
    }

    fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        self.ranged_building.base_building.set_property(property_name, value);
    }
}

impl AttackingBuildingTrait for LightningTower {
    fn update_range_cells(&self) -> Option<Vec<Option<Position>>> {
        let range_cells = self.ranged_building.update_range_cells().unwrap();

        self.set_property("range_cells", Box::new(range_cells.clone()));

        Some(range_cells)
    }

    fn get_closest_enemy(&mut self, tick_number: u32) -> Option<u16> {
        self.ranged_building.get_closest_enemy(tick_number)
    }

    fn fire_ranged(&self, _enemy_uid: u16) {
        unreachable!()
    }

    fn set_buffed(&mut self, buffed: bool) {
        self.ranged_building.set_buffed(buffed);
    }
}

impl EntityTrait for LightningTower {
    fn on_die(&self) {
        self.ranged_building.base_building.on_die();
    }
}