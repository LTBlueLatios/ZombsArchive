use super::building::{Building, BuildingTrait};
use super::generic_entity::{EntityTrait, Position};
use crate::entity_manager::manager::ENTITIES;
use crate::info::buildings::{self, BuildingInfoEnum};
use crate::{CONFIG, PARTIES};
use std::any::Any;
use crate::manager;
use crate::entity_manager::entity_types::EntityTypeEnum;

#[derive(Clone, Debug)]
pub struct Drill {
    pub base_building: Building
}

impl Drill {
    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.base_building.generic_entity.uid, |entity| {
            let EntityTypeEnum::Drill(entity) = entity else {
                panic!("Expected a Drill entity, but got a different type");
            };

            // this boolean is only used with variables that should be tracked to be sent to the client
            let mut should_update_client: bool = false;

            match property_name {
                "position" => {
                    if let Some(position) = value.downcast_ref::<Position>() {
                        entity.base_building.generic_entity.position = *position;

                        should_update_client = true;
                    }
                },
                "party_id" => {
                    if let Some(party_id) = value.downcast_ref::<u32>() {
                        entity.base_building.party_id = *party_id;

                        should_update_client = true;
                    }
                },
                "tier" => {
                    if let Some(tier) = value.downcast_ref::<u8>() {
                        entity.base_building.tier = *tier;

                        should_update_client = true;
                    }
                },
                _ => panic!("Unknown property '{}'", property_name),
            }

            if should_update_client == true {
                manager::flag_property_as_changed(self.base_building.generic_entity.uid, property_name);
            }
        })
    }
}

impl BuildingTrait for Drill {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let entity = Drill {
            base_building: Building::new(uid, position, rotation, "Drill".to_owned())
        };

        return entity;
    }

    fn on_tick(&mut self, tick_number: u32) {
        self.base_building.on_tick(tick_number);

        let building_info = buildings::get_building(&self.base_building.generic_entity.model);
        let building_info = match &building_info {
            BuildingInfoEnum::Drill(e) => e,
           _ => unreachable!()
        };
        let tier_index_usize = (self.base_building.tier - 1) as usize;
        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);

        let gold_per_second = building_info.gold_per_second[tier_index_usize] as f32;
        let gold_per_tick = gold_per_second / 1000.0 * tick_rate as f32;

        PARTIES.with(|p| {
            let parties = p.borrow();
            let self_party = parties.get(&self.base_building.party_id).unwrap();

            for uid in self_party.members.iter() {
                let player_entity_clone = ENTITIES.with(|e| {
                    let entities = e.borrow();
                    let player_entity = entities.get(uid).unwrap();

                    match player_entity {
                        EntityTypeEnum::Player(e) => e.clone(),
                        _ => unreachable!()
                    }
                });

                player_entity_clone.set_property("gold", Box::new(player_entity_clone.gold + gold_per_tick));
            }
        });
    }

    fn upgrade(&self, tick_number: u32) {
        self.base_building.upgrade(tick_number);
    }

    fn take_damage(&self, damage: u16, entity: &EntityTypeEnum) -> u16 {
        self.base_building.take_damage(damage, entity)
    }

    fn die(&mut self) {
        self.base_building.die();
    }

    fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        self.base_building.set_property(property_name, value);
    }
}

impl EntityTrait for Drill {
    fn on_die(&self) {
        self.base_building.on_die();
    }
}