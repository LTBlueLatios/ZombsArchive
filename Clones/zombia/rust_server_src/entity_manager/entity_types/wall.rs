use super::building::{Building, BuildingTrait};
use super::generic_entity::{EntityTrait, Position};
use std::any::Any;
use crate::manager;
use crate::entity_manager::entity_types::EntityTypeEnum;

#[derive(Clone, Debug)]
pub struct Wall {
    pub base_building: Building
}

impl Wall {
    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.base_building.generic_entity.uid, |entity| {
            let EntityTypeEnum::Wall(entity) = entity else {
                panic!("Expected a Wall entity, but got a different type");
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

impl BuildingTrait for Wall {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let entity = Wall {
            base_building: Building::new(uid, position, rotation, "Wall".to_owned())
        };

        return entity;
    }

    fn upgrade(&self, tick_number: u32) {
        self.base_building.upgrade(tick_number);
    }

    fn on_tick(&mut self, tick_number: u32) {
        self.base_building.on_tick(tick_number);
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

impl EntityTrait for Wall {
    fn on_die(&self) {
        self.base_building.on_die();
    }
}