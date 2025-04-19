use super::building::{AttackingBuilding, AttackingBuildingTrait, Building, BuildingTrait};
use super::generic_entity::{EntityTrait, Position};
use super::{Player, Zombie};
use std::any::Any;
use crate::entity_manager::manager::ENTITIES;
use crate::info::buildings::{self, BuildingInfoEnum, MeleeTowerInfo};
use crate::{CONFIG, PARTIES};
use crate::entity_manager::entity_types::EntityTypeEnum;

#[derive(Clone, Debug)]
pub struct SawTower {
    pub ranged_building: AttackingBuilding
}

impl SawTower {
    fn get_enemies_in_range(&mut self, _tick_number: u32) -> Option<Vec<u16>> {
        let building_info = buildings::get_building(&self.ranged_building.base_building.generic_entity.model);
        let building_info = match &building_info {
            BuildingInfoEnum::Melee(e) => e,
           _ => unreachable!()
        };

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

        let mut enemies_in_range: Vec<u16> = Vec::new();
        let mut target_found = false;

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
                        ENTITIES.with(|e| {
                            let entities = e.borrow();

                            let enemy_entity = entities.get(uid).unwrap();

                            let max_yaw_deviation = building_info.max_yaw_deviation;

                            let angle_to_enemy = self.ranged_building.base_building.generic_entity.position.angle_to(&enemy_entity.generic_entity().position);
                
                            let is_facing_enemy = self.ranged_building.base_building.generic_entity.position.is_facing(self.ranged_building.base_building.yaw, angle_to_enemy, max_yaw_deviation);
                
                            if !is_facing_enemy {
                                return;
                            }

                            enemies_in_range.push(*uid);
                            target_found = true;
                        });
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
        };

        if target_found == false {
            return None;
        }

        Some(enemies_in_range)
    }

    fn fire_melee(&mut self, enemies_in_range: Vec<u16>, building_info: &MeleeTowerInfo) {
        for enemy_uid in enemies_in_range.iter() {
            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let mut enemy_entity = entities.get_mut(enemy_uid).unwrap().clone();

                drop(entities);

                match enemy_entity {
                    EntityTypeEnum::Player(ref mut entity) => self.damage_player(entity, &building_info),
                    EntityTypeEnum::Zombie(ref mut entity) => self.damage_zombie(entity, &building_info),
                    _ => unreachable!()
                }
            })
        }
    }

    pub fn damage_player(&self, player_entity: &mut Player, building_info: &MeleeTowerInfo) {
        let tier_index_usize = (self.ranged_building.base_building.tier - 1) as usize;
        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);

        let damage_to_players = building_info.damage_to_players[tier_index_usize];
        let damage_per_tick = damage_to_players * tick_rate / 1000;

        let self_entity = EntityTypeEnum::SawTower(self.clone());

        player_entity.take_damage(damage_per_tick, &self_entity);
    }

    pub fn damage_zombie(&self, zombie_entity: &mut Zombie, building_info: &MeleeTowerInfo) {
        let tier_index_usize = (self.ranged_building.base_building.tier - 1) as usize;
        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);

        let damage_to_zombies = building_info.damage_to_zombies[tier_index_usize];
        let damage_per_tick = damage_to_zombies * tick_rate / 1000;

        let self_entity = EntityTypeEnum::SawTower(self.clone());

        zombie_entity.take_damage(damage_per_tick, &self_entity);
    }
}

impl BuildingTrait for SawTower {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let mut entity = SawTower {
            ranged_building: AttackingBuilding {
                aiming_yaw: 0,
                firing_tick: 0,
                range_cells: Vec::new(),
                base_building: Building::new(uid, position, rotation, "SawTower".to_owned()),
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

        let building_info = buildings::get_building(&self.ranged_building.base_building.generic_entity.model);
        let building_info = match &building_info {
            BuildingInfoEnum::Melee(e) => e,
           _ => unreachable!()
        };

        let tier_index_usize = (self.ranged_building.base_building.tier - 1) as usize;
        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);
        let firing_rate = building_info.ms_between_fires[tier_index_usize];
        let firing_rate_ticks = firing_rate / tick_rate as u32;

        if self.ranged_building.firing_tick + firing_rate_ticks <= tick_number {
            let enemies_in_range = self.get_enemies_in_range(tick_number);

            if enemies_in_range.is_none() {
                if self.ranged_building.firing_tick > 0 {
                    self.set_property("firing_tick", Box::new(0u32));
                };
                return;
            }

            self.set_property("firing_tick", Box::new(tick_number));
            self.fire_melee(enemies_in_range.unwrap(), &building_info);
        };

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

impl AttackingBuildingTrait for SawTower {
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

impl EntityTrait for SawTower {
    fn on_die(&self) {
        self.ranged_building.base_building.on_die();
    }
}