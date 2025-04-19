use crate::{entity_manager::manager::{self, ENTITIES}, physics::PIXEL_TO_WORLD};

use super::{building::AttackingBuildingTrait, generic_entity::{GenericEntity, Position}, EntityTypeEnum};
use rapier2d::prelude::*;
use crate::physics;

#[derive(Clone, Debug)]
pub enum SpellIndicatorTypesEnum {
    Rapidfire
}

impl SpellIndicatorTypesEnum {
    pub fn to_index(&self) -> u8 {
        match self {
            SpellIndicatorTypesEnum::Rapidfire => 0
        }
    }
}

#[derive(Clone, Debug)]
pub struct SpellIndicator {
    pub generic_entity: GenericEntity,
    pub spell_type: SpellIndicatorTypesEnum,
    pub radius: f32,
    pub death_tick: u32
}

impl SpellIndicator {
    pub fn new(uid: u16, position: Position) -> Self {
        SpellIndicator {
            generic_entity: GenericEntity::new(uid, "SpellIndicator".to_owned(), position),
            spell_type: SpellIndicatorTypesEnum::Rapidfire,
            radius: 0.0,
            death_tick: 0
        }
    }

    pub fn initialise_physics(&self) {
        let collision_group = InteractionGroups::new(
            Group::all(),
            Group::empty()
        );

        physics::create_rigid_body(&self.generic_entity.uid, physics::RigidBodyType::Fixed,  &self.generic_entity.position, 0, physics::ColliderShapes::Ball { radius: self.radius }, collision_group, None, None);
    }

    pub fn on_tick(&mut self, tick_number: u32) {
        if tick_number >= self.death_tick {
            manager::queue_kill_entity(self.generic_entity.uid);
            return;
        }

        match self.spell_type {
            SpellIndicatorTypesEnum::Rapidfire => {
                let query_shape = Ball::new(self.radius / PIXEL_TO_WORLD as f32);
                let query_filter = QueryFilter::default();

                physics::intersections_with_shape(
                    &self.generic_entity.position,
                    0,
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
                            let mut entities = e.borrow_mut();
    
                            let entity = entities.get_mut(&entity_uid).unwrap();
                
                            match entity {
                                EntityTypeEnum::ArrowTower(ref mut entity) => entity.set_buffed(true),
                                EntityTypeEnum::CannonTower(ref mut entity) => entity.set_buffed(true),
                                EntityTypeEnum::LightningTower(ref mut entity) => entity.set_buffed(true),
                                EntityTypeEnum::MageTower(ref mut entity) => entity.set_buffed(true),
                                EntityTypeEnum::RocketTower(ref mut entity) => entity.set_buffed(true),
                                EntityTypeEnum::SawTower(ref mut entity) => entity.set_buffed(true),
                                _ => return
                            };
                        });
        
                        true
                });
            }
        }
    }
}