use super::building::{Building, BuildingTrait};
use super::generic_entity::{EntityTrait, GenericEntity, Position};
use std::any::Any;
use crate::info::buildings::{self, BuildingInfoEnum};
use crate::manager;
use crate::entity_manager::entity_types::EntityTypeEnum;
use rapier2d::prelude::*;
use crate::physics::{self, ActiveHooksEnum};

#[derive(Clone, Debug)]
pub struct Door {
    pub base_building: Building
}

impl Door {
    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.base_building.generic_entity.uid, |entity| {
            let EntityTypeEnum::Door(entity) = entity else {
                panic!("Expected a Door entity, but got a different type");
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

impl BuildingTrait for Door {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let mut building = Door {
            base_building: Building {
                dead: false,
                tier: 1,
                health: 0,
                max_health: 0,
                generic_entity: GenericEntity::new(uid, "Door".to_owned(), position),
                last_damaged_tick: 0,
                party_id: 0,
                height: 95.99,
                width: 95.99,
                yaw: rotation,
            }
        };

        let building_info = buildings::get_building(&building.base_building.generic_entity.model);

        let BuildingInfoEnum::Base(building_info) = building_info else {
            unreachable!();
        };

        building.base_building.health = building_info.health[0];
        building.base_building.max_health = building_info.health[0];
        building.base_building.height = building_info.height;
        building.base_building.width = building_info.width;

        let collision_group = InteractionGroups::new(
            Group::GROUP_2,
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3 | Group::GROUP_4,
        );

        physics::create_rigid_body(
            &building.base_building.generic_entity.uid,
            physics::RigidBodyType::Fixed,
            &position,
            0,
            physics::ColliderShapes::Rect {
                width: building.base_building.width,
                height: building.base_building.height,
            },
            collision_group,
            Some(ActiveHooksEnum::FilterContactPairs),
            None
        );

        return building;
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

impl EntityTrait for Door {
    fn on_die(&self) {
        self.base_building.on_die();
    }
}