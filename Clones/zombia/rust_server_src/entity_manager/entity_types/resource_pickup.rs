use super::generic_entity::{self, EntityTrait, Position};
use rapier2d::prelude::*;
use crate::{physics, CONFIG};
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::manager::{self, ENTITIES};
use std::any::Any;
use std::f32::consts::PI;

#[derive(Clone, Debug)]
pub enum ResourcePickupTypeEnum {
    Wood,
    Stone
}

impl ResourcePickupTypeEnum {
    pub fn type_index(&self) -> u8 {
        match self {
            Self::Wood => 0,
            Self::Stone => 1
        }
    }
}

#[derive(Clone, Debug)]
pub struct ResourcePickup {
    pub creation_tick: u32,
    pub death_tick: u32,
    pub generic_entity: generic_entity::GenericEntity,
    pub resource_pickup_type: ResourcePickupTypeEnum,
    pub resource_amount: f32,
    pub radius: f32,
    pub target_player_uid: Option<u16>,
    pub yaw: u16,
    pub speed: i8
}

impl ResourcePickup {
    pub fn new(uid: u16, position: Position) -> Self {
        let pickup_instance = ResourcePickup {
            creation_tick: 0,
            death_tick: 0,
            generic_entity: generic_entity::GenericEntity::new(uid, "ResourcePickup".to_owned(), position),
            resource_pickup_type: ResourcePickupTypeEnum::Wood,
            resource_amount: 0.0,
            radius: 5.0,
            target_player_uid: None,
            yaw: 0,
            speed: 24
        };

        return pickup_instance;
    }

    pub fn initialise_physics(&self, _tick_number: u32) {
        let collision_group = InteractionGroups::new(
            Group::GROUP_4,
            Group::GROUP_2
        );

        physics::create_rigid_body(&self.generic_entity.uid, physics::RigidBodyType::Dynamic { linear_damping_factor: 0.0 },  &self.generic_entity.position, 0, physics::ColliderShapes::SensorBall { radius: self.radius }, collision_group, Some(physics::ActiveHooksEnum::FilterIntersectionPair), None);
    }

    pub fn on_tick(&mut self, tick_number: u32) {
        if tick_number >= self.death_tick {
            manager::kill_entity(&self.generic_entity.uid);
            return;
        }

        if self.speed > 0 {
            let speed = ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let self_entity = entities.get_mut(&self.generic_entity.uid).unwrap();

                let EntityTypeEnum::ResourcePickup(resource_pickup) = self_entity else {
                    unreachable!()
                };

                resource_pickup.speed -= 4;
                resource_pickup.speed
            });

            let speed = speed.max(0);

            let x_impulse = (self.yaw as f32 * PI / 180.0).sin() * speed as f32;
            let y_impulse = (self.yaw as f32 * PI / 180.0).cos() * speed as f32;

            let impulse = vector![
                x_impulse,
                -y_impulse
            ];

            physics::set_velocity_of_body(&self.generic_entity.uid, impulse, true);
        }

        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate) as u32;

        // Don't let pickups be picked up right after they're spawned
        if tick_number - self.creation_tick < 1000 / tick_rate {
            return;
        }

        let target_player = match self.target_player_uid {
            Some(uid) => {
                ENTITIES.with(|e| {
                    let entities = e.borrow();
                    let entity = entities.get(&uid);

                    match entity {
                        Some(EntityTypeEnum::Player(e)) => Some(e.clone()),
                        _ => None
                    }
                })
            },
            None => return
        };

        let target_player = match target_player {
            Some(e) => e,
            None => return
        };

        let dist_to_player = (self.generic_entity.position.distance_to(&target_player.generic_entity.position) as f32).sqrt();

        if dist_to_player < 12.0 {
            let resource = match &self.resource_pickup_type {
                ResourcePickupTypeEnum::Wood => "wood",
                ResourcePickupTypeEnum::Stone => "stone"
            };

            let player_resource_count = match &self.resource_pickup_type {
                ResourcePickupTypeEnum::Wood => target_player.wood,
                ResourcePickupTypeEnum::Stone => target_player.stone
            };

            target_player.set_property(&resource, Box::new(player_resource_count + self.resource_amount));
            manager::kill_entity(&self.generic_entity.uid);
            return;
        } else {
            let angle_to_player = self.generic_entity.position.angle_to(&target_player.generic_entity.position) as f32;

            let x_impulse = (angle_to_player * PI / 180.0).sin() * 50.0;
            let y_impulse = (angle_to_player * PI / 180.0).cos() * 50.0;
    
            let impulse = vector![
                x_impulse,
                -y_impulse
            ];
    
            physics::set_velocity_of_body(&self.generic_entity.uid, impulse, true);
        }
    }

    pub fn set_target(&mut self, player_uid: u16) {
        self.target_player_uid = Some(player_uid);
    }

    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.generic_entity.uid, |entity| {
            let EntityTypeEnum::ResourcePickup(entity) = entity else {
                unreachable!();
            };

            // this boolean is only used with variables that should be tracked to be sent to the client
            let mut should_update_client: bool = false;

            match property_name {
                "position" => {
                    if let Some(position) = value.downcast_ref::<Position>() {
                        entity.generic_entity.position = *position;

                        should_update_client = true;
                    }
                },
                "target_player_uid" => {
                    if let Some(target_player_uid) = value.downcast_ref::<Option<u16>>() {
                        entity.target_player_uid = *target_player_uid;
                    }
                },
                _ => unreachable!()
            }

            if should_update_client == true {
                manager::flag_property_as_changed(self.generic_entity.uid, property_name);
            }
        });
    }
}

impl EntityTrait for ResourcePickup {
    fn on_die(&self) {
        // println!("ResourcePickup died!");
    }
}