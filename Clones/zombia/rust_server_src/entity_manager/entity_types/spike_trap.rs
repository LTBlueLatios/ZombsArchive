use super::building::{Building, BuildingTrait};
use super::generic_entity::{EntityTrait, GenericEntity, Position};
use super::Zombie;
use std::any::Any;
use crate::entity_manager::manager::ENTITIES;
use crate::info::buildings::{self, BuildingInfoEnum};
use crate::{manager, CONFIG};
use crate::entity_manager::entity_types::EntityTypeEnum;
use rapier2d::prelude::*;
use crate::physics::{self, ActiveHooksEnum};

#[derive(Clone, Debug)]
pub struct SpikeTrap {
    pub base_building: Building,
    pub firing_tick: u32
}

impl SpikeTrap {
    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.base_building.generic_entity.uid, |entity| {
            let EntityTypeEnum::SpikeTrap(entity) = entity else {
                panic!("Expected a SpikeTrap entity, but got a different type");
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
                "firing_tick" => {
                    if let Some(firing_tick) = value.downcast_ref::<u32>() {
                        entity.firing_tick = *firing_tick;

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

    pub fn on_collision(&self, hit_entity_uid: u16) {
        let hit_entity = ENTITIES.with(|e| {
            let entities = e.borrow();

            entities.get(&hit_entity_uid).unwrap().clone()
        });

        match hit_entity {
            EntityTypeEnum::Zombie(entity) => self.damage_zombie(&entity),
            _ => return
        };

        let tick_number = CONFIG.with(|c| c.borrow().tick_number);
        self.set_property("firing_tick", Box::new(tick_number));
    }

    pub fn damage_zombie(&self, zombie_entity: &Zombie) {
        let building_info = buildings::get_building(&self.base_building.generic_entity.model);
        let building_info = match &building_info {
            BuildingInfoEnum::Melee(e) => e,
           _ => unreachable!()
        };
        let tier_index_usize = (self.base_building.tier - 1) as usize;

        let damage = building_info.damage_to_zombies[tier_index_usize];

        let self_entity = EntityTypeEnum::SpikeTrap(self.clone());

        zombie_entity.take_damage(damage, &self_entity);

        // TODO: slow zombies
    }
}

impl BuildingTrait for SpikeTrap {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let entity = SpikeTrap {
            firing_tick: 0,
            base_building: Building {
                dead: false,
                tier: 1,
                health: 500,
                max_health: 500,
                generic_entity: GenericEntity::new(uid, "SpikeTrap".to_owned(), position),
                last_damaged_tick: 0,
                party_id: 0,
                height: 47.99,
                width: 47.99,
                yaw: rotation
            }
        };

        let collision_group = InteractionGroups::new(
            Group::GROUP_2,
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3 | Group::GROUP_4
        );

        physics::create_rigid_body(&entity.base_building.generic_entity.uid, physics::RigidBodyType::Fixed,  &position,
            0, physics::ColliderShapes::Rect { width: entity.base_building.width, height: entity.base_building.height },
            collision_group, Some(ActiveHooksEnum::FilterContactPairs), None);

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

impl EntityTrait for SpikeTrap {
    fn on_die(&self) {
        self.base_building.on_die();
    }
}