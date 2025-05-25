use rapier2d::prelude::*;
use std::collections::HashMap;
use std::cell::RefCell;
use crate::entity_manager::entity_types::{Door, EntityTypeEnum, Player, SpikeTrap};
use crate::entity_manager::manager::ENTITIES;
use crate::manager;
use crate::entity_manager::entity_types::generic_entity::Position;
use crate::{WORLD_HEIGHT, WORLD_WIDTH};

#[derive(Debug, Clone)]
struct PhysicsHooks {}

fn handle_door_collision(door_entity: &Door, player_entity: &Player) -> Option<SolverFlags> {
    if door_entity.base_building.party_id == player_entity.party_id {
        return None;
    }
    Some(SolverFlags::COMPUTE_IMPULSES)
}

fn handle_player_building_collision(player_entity: &Player, building_entity: &EntityTypeEnum) -> Option<SolverFlags> {
    if player_entity.can_building_walk == false {
        return Some(SolverFlags::COMPUTE_IMPULSES);
    }

    let building_party_id = match &building_entity {
        &EntityTypeEnum::ArrowTower(e) => e.ranged_building.base_building.party_id,
        &EntityTypeEnum::CannonTower(e) => e.ranged_building.base_building.party_id,
        &EntityTypeEnum::Door(e) => e.base_building.party_id,
        &EntityTypeEnum::Drill(e) => e.base_building.party_id,
        &EntityTypeEnum::Harvester(e) => e.base_building.party_id,
        &EntityTypeEnum::LargeWall(e) => e.base_building.party_id,
        &EntityTypeEnum::LightningTower(e) => e.ranged_building.base_building.party_id,
        &EntityTypeEnum::MageTower(e) => e.ranged_building.base_building.party_id,
        &EntityTypeEnum::RocketTower(e) => e.ranged_building.base_building.party_id,
        &EntityTypeEnum::SawTower(e) => e.ranged_building.base_building.party_id,
        &EntityTypeEnum::Wall(e) => e.base_building.party_id,
        _ => 0
    };

    if player_entity.party_id == building_party_id {
        return None;
    }

    return Some(SolverFlags::COMPUTE_IMPULSES);
}

impl rapier2d::prelude::PhysicsHooks for PhysicsHooks {
    fn filter_contact_pair(&self, context: &PairFilterContext) -> Option<SolverFlags> {
        if context.rigid_body1.is_none() {
            return Some(SolverFlags::COMPUTE_IMPULSES);
        }
        if context.rigid_body2.is_none() {
            return Some(SolverFlags::COMPUTE_IMPULSES);
        }

        let body_uid_1 = context.bodies[context.rigid_body1.unwrap()].user_data as u16;
        let body_uid_2 = context.bodies[context.rigid_body2.unwrap()].user_data as u16;

        let mut spike_trap_collision: (bool, Option<SpikeTrap>, u16) = (false, None, 0);

        let return_val = ENTITIES.with(|e| {
            let entities = e.borrow();

            let entity_1 = entities.get(&body_uid_1);
            let entity_2 = entities.get(&body_uid_2);

            let entity_1 = match entity_1 {
                Some(e) => e,
                None => {
                    return Some(SolverFlags::COMPUTE_IMPULSES);
                }
            };

            let entity_2 = match entity_2 {
                Some(e) => e,
                None => {
                    return Some(SolverFlags::COMPUTE_IMPULSES);
                }
            };

            {
                if matches!(entity_1, EntityTypeEnum::Door(_)) &&
                matches!(entity_2, EntityTypeEnum::Player(_)) {
                    let EntityTypeEnum::Door(door_entity) = entity_1 else {
                        unreachable!();
                    };

                    let EntityTypeEnum::Player(player_entity) = entity_2 else {
                        unreachable!();
                    };

                    return handle_door_collision(&door_entity, &player_entity);
                };

                if matches!(entity_2, EntityTypeEnum::Door(_)) &&
                matches!(entity_1, EntityTypeEnum::Player(_)) {
                    let EntityTypeEnum::Door(door_entity) = entity_2 else {
                        unreachable!();
                    };

                    let EntityTypeEnum::Player(player_entity) = entity_1 else {
                        unreachable!();
                    };

                    return handle_door_collision(&door_entity, &player_entity);
                };
            }

            {
                if matches!(entity_1, EntityTypeEnum::SpikeTrap(_)) {
                    let EntityTypeEnum::SpikeTrap(spike_trap_entity) = entity_1.clone() else {
                        unreachable!();
                    };

                    spike_trap_collision = (true, Some(spike_trap_entity), body_uid_2);
                };

                if matches!(entity_2, EntityTypeEnum::SpikeTrap(_)) {
                    let EntityTypeEnum::SpikeTrap(spike_trap_entity) = entity_2.clone() else {
                        unreachable!();
                    };

                    spike_trap_collision = (true, Some(spike_trap_entity), body_uid_2);
                };
            }

            {
                if matches!(entity_2, EntityTypeEnum::Player(_)) {
                    let EntityTypeEnum::Player(player_entity) = entity_2 else {
                        unreachable!();
                    };
    
                    return handle_player_building_collision(player_entity, &entity_1);
                };

                if matches!(entity_1, EntityTypeEnum::Player(_)) {
                    let EntityTypeEnum::Player(player_entity) = entity_1 else {
                        unreachable!();
                    };
    
                    return handle_player_building_collision(player_entity, &entity_2);
                };
            }

            Some(SolverFlags::COMPUTE_IMPULSES)
        });

        if spike_trap_collision.0 == true {
            let spike_trap = spike_trap_collision.1.unwrap();

            spike_trap.on_collision(spike_trap_collision.2);

            return None;
        }

        return_val
    }

    fn filter_intersection_pair(&self, context: &PairFilterContext) -> bool {

        //                             in-range, player uid, pickup uid
        let mut resource_pickup_in_range: (bool, u16, u16) = (false, 0, 0);

        let mut projectile_hit_entity: bool = false;
        let mut entities_colliding_with_projectile: Vec<u16> = Vec::new();
        let mut projectile_uid: u16 = 0;

        if context.rigid_body1.is_none() {
            return true;
        }
        if context.rigid_body2.is_none() {
            return true;
        }

        let body_uid_1 = context.bodies[context.rigid_body1.unwrap()].user_data as u16;
        let body_uid_2 = context.bodies[context.rigid_body2.unwrap()].user_data as u16;

        let return_val: bool = ENTITIES.with(|e| {
            let entities = e.borrow();

            let entity_1 = entities.get(&body_uid_1);
            let entity_2 = entities.get(&body_uid_2);

            let entity_1 = match entity_1 {
                Some(e) => e,
                None => {
                    return true;
                }
            };

            let entity_2 = match entity_2 {
                Some(e) => e,
                None => {
                    return true;
                }
            };

            // Projectiles
            {
                if matches!(entity_1, EntityTypeEnum::Projectile(_)) {
                    let EntityTypeEnum::Projectile(_projectile_entity) = entity_1 else {
                        unreachable!();
                    };

                    projectile_hit_entity = true;
                    entities_colliding_with_projectile.push(body_uid_2);
                    projectile_uid = body_uid_1;

                    return false;
                };

                if matches!(entity_2, EntityTypeEnum::Projectile(_)) {
                    let EntityTypeEnum::Projectile(_projectile_entity) = entity_2 else {
                        unreachable!();
                    };

                    projectile_hit_entity = true;
                    entities_colliding_with_projectile.push(body_uid_1);
                    projectile_uid = body_uid_2;

                    return false;
                };
            }

            // Player and resource-pickups
            {
                if matches!(entity_1, EntityTypeEnum::ResourcePickup(_)) &&
                matches!(entity_2, EntityTypeEnum::Player(_)) {
                    resource_pickup_in_range = (true, body_uid_2, body_uid_1);

                    return false;
                };

                if matches!(entity_2, EntityTypeEnum::ResourcePickup(_)) &&
                matches!(entity_1, EntityTypeEnum::Player(_)) {
                    resource_pickup_in_range = (true, body_uid_1, body_uid_2);

                    return false;
                };
            }

            true
        });

        if resource_pickup_in_range.0 == true {
            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let resource_pickup = entities.get_mut(&resource_pickup_in_range.2).unwrap();

                let EntityTypeEnum::ResourcePickup(resource_pickup) = resource_pickup else {
                    unreachable!();
                };

                resource_pickup.set_target(resource_pickup_in_range.1);
            });
        }

        if projectile_hit_entity == true {
            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let projectile = entities.get_mut(&projectile_uid).unwrap();

                let EntityTypeEnum::Projectile(projectile_entity) = projectile else {
                    unreachable!();
                };

                projectile_entity.colliding_entities = entities_colliding_with_projectile;
            });
        }

        return_val
    }
}

pub const PIXEL_TO_WORLD: u16 = 48;

thread_local! {
    pub static PHYSICS_PIPELINE: RefCell<PhysicsPipeline> = RefCell::new(PhysicsPipeline::new());
    pub static RIGID_BODY_SET: RefCell<RigidBodySet> = RefCell::new(RigidBodySet::new());
    pub static COLLIDER_SET: RefCell<ColliderSet> = RefCell::new(ColliderSet::new());
    pub static GRAVITY: RefCell<Vector<f32>> = RefCell::new(vector![0.0, 0.0]);
    pub static INTEGRATION_PARAMETERS: RefCell<IntegrationParameters> = RefCell::new(IntegrationParameters::default());
    pub static ISLAND_MANAGER: RefCell<IslandManager> = RefCell::new(IslandManager::new());
    pub static BROAD_PHASE: RefCell<DefaultBroadPhase> = RefCell::new(DefaultBroadPhase::new());
    pub static NARROW_PHASE: RefCell<NarrowPhase> = RefCell::new(NarrowPhase::new());
    pub static IMPULSE_JOINT_SET: RefCell<ImpulseJointSet> = RefCell::new(ImpulseJointSet::new());
    pub static MULTIBODY_JOINT_SET: RefCell<MultibodyJointSet> = RefCell::new(MultibodyJointSet::new());
    pub static CCD_SOLVER: RefCell<CCDSolver> = RefCell::new(CCDSolver::new());
    pub static QUERY_PIPELINE: RefCell<QueryPipeline> = RefCell::new(QueryPipeline::new());
    pub static PHYSICS_HOOKS: RefCell<PhysicsHooks> = RefCell::new(PhysicsHooks {});
    pub static EVENT_HANDLER: RefCell<()> = RefCell::new(());

    pub static UID_HANDLE_MAP: RefCell<HashMap<u16, RigidBodyHandle>> = RefCell::new(HashMap::new());

    // These are the collision groups:
    /*
    0: Resources
    1: Players, zombies, NPC's, etc.
    2: Buildings
    3: Projectiles

    0 can collide with 1 and 3
    1 can collide with 0, 1, 2 and 3
    2 can collide with 1 and 3
    3 can collide with 0, 1 and 2

    https://rapier.rs/docs/user_guides/javascript/colliders#collision-groups-and-solver-groups
    */
}

pub fn create_world_borders() {
    let bound_thickness = 8.0f32;
    let world_width = (WORLD_WIDTH / PIXEL_TO_WORLD as i16) as f32;
    let world_height = (WORLD_HEIGHT / PIXEL_TO_WORLD as i16) as f32;

    let top_bound = ColliderBuilder::cuboid(world_width / 2.0, bound_thickness)
        .translation(vector![world_width / 2.0, -bound_thickness]);
    let right_bound = ColliderBuilder::cuboid(bound_thickness, world_height / 2.0)
        .translation(vector![world_width + bound_thickness, world_height / 2.0]);
    let bottom_bound = ColliderBuilder::cuboid(world_width / 2.0, bound_thickness)
        .translation(vector![world_width / 2.0, world_height + bound_thickness]);
    let left_bound = ColliderBuilder::cuboid(bound_thickness, world_height / 2.0)
        .translation(vector![-bound_thickness, world_height / 2.0]);

    COLLIDER_SET.with(|collider_set| {
        let mut collider_set = collider_set.borrow_mut();

        collider_set.insert(top_bound);
        collider_set.insert(right_bound);
        collider_set.insert(bottom_bound);
        collider_set.insert(left_bound);
    });
}

#[derive(PartialEq)]
pub enum RigidBodyType {
    Dynamic { linear_damping_factor: f32 },
    Fixed,
    Kinematic { velocity: Vector<Real> }
}

pub enum ColliderShapes {
    Ball { radius: f32 },
    SensorBall { radius: f32 },
    Rect { width: f32, height: f32 }
}

pub enum ActiveHooksEnum {
    FilterContactPairs,
    FilterIntersectionPair
}

pub fn create_rigid_body(
    uid: &u16,
    body_type: RigidBodyType,
    translation: &Position,
    body_rotation: u16,
    collider_shape: ColliderShapes,
    collision_groups: InteractionGroups,
    active_hooks: Option<ActiveHooksEnum>,
    active_collision_types: Option<ActiveCollisionTypes>
) -> RigidBodyHandle {
    let mut vel: Option<Vector<Real>> = None;

    let rigid_body = match body_type {
        RigidBodyType::Dynamic { linear_damping_factor} => RigidBodyBuilder::dynamic().linear_damping(linear_damping_factor),
        RigidBodyType::Fixed => RigidBodyBuilder::fixed(),
        RigidBodyType::Kinematic { velocity } => {
            vel = Some(velocity);
            RigidBodyBuilder::kinematic_velocity_based()
        }
    };

    let translation = vector![
        (translation.x as f32 / PIXEL_TO_WORLD as f32),
        (translation.y as f32 / PIXEL_TO_WORLD as f32)
    ];

    let mut rigid_body = rigid_body.translation(translation)
        .user_data(*uid as u128);

    if vel.is_some() {
        rigid_body = rigid_body.linvel(vel.unwrap());
    }

    let rigid_body = rigid_body.build();

    let collider = match collider_shape {
        ColliderShapes::Ball { radius } => ColliderBuilder::ball(radius / PIXEL_TO_WORLD as f32),
        ColliderShapes::SensorBall { radius } => ColliderBuilder::ball(radius / PIXEL_TO_WORLD as f32).sensor(true),
        ColliderShapes::Rect { width, height } => {
            let mut rotated_width = width;
            let mut rotated_height = height;

            if body_rotation == 0 || body_rotation == 180 {
                rotated_width = width;
                rotated_height = height;
            } else if body_rotation == 90 || body_rotation == 270 {
                rotated_width = height;
                rotated_height = width;
            }

            ColliderBuilder::cuboid(rotated_width / 2.0 / PIXEL_TO_WORLD as f32, rotated_height / 2.0 / PIXEL_TO_WORLD as f32)
        }
    };

    let mut collider = collider.collision_groups(collision_groups);

    match active_hooks {
        Some(hook) => {
            match hook {
                ActiveHooksEnum::FilterContactPairs => {
                    collider = collider.active_hooks(ActiveHooks::FILTER_CONTACT_PAIRS);
                },
                ActiveHooksEnum::FilterIntersectionPair => {
                    collider = collider.active_hooks(ActiveHooks::FILTER_INTERSECTION_PAIR);
                }
            }
        },
        None => {}
    };

    match active_collision_types {
        Some(collision_type) => {
            collider = collider.active_collision_types(collision_type)
        },
        None => {}
    }

    let body_handle = RIGID_BODY_SET.with(|rigid_body_set| {
        let mut rigid_body_set = rigid_body_set.borrow_mut();

        let body_handle = rigid_body_set.insert(rigid_body);

        COLLIDER_SET.with(|collider_set| {
            let mut collider_set = collider_set.borrow_mut();
    
            collider_set.insert_with_parent(collider, body_handle, &mut rigid_body_set);
        });

        return body_handle;
    });

    UID_HANDLE_MAP.with(|uid_handle_map| {
        let mut uid_handle_map = uid_handle_map.borrow_mut();

        uid_handle_map.insert(*uid, body_handle);
    });

    body_handle
}

pub fn remove_rigid_body(uid: u16) {
    let rigid_body_handle = UID_HANDLE_MAP.with(|uid_handle_map| {
        let uid_handle_map = uid_handle_map.borrow();

        if !uid_handle_map.contains_key(&uid) {
            panic!("Tried to remove rigid body that doesn't exist!");
        }

        uid_handle_map.get(&uid).unwrap().clone()
    });

    RIGID_BODY_SET.with(|rigid_body_set| {
        let mut rigid_body_set = rigid_body_set.borrow_mut();

        ISLAND_MANAGER.with(|island_manager| {
            let mut island_manager = island_manager.borrow_mut();

            COLLIDER_SET.with(|collider_set| {
                let mut collider_set = collider_set.borrow_mut();

                IMPULSE_JOINT_SET.with(|impulse_joint_set| {
                    let mut impulse_joint_set = impulse_joint_set.borrow_mut();

                    MULTIBODY_JOINT_SET.with(|multibody_joint_set| {
                        let mut multibody_joint_set = multibody_joint_set.borrow_mut();

                        rigid_body_set.remove(
                            rigid_body_handle,
                            &mut island_manager,
                            &mut collider_set,
                            &mut impulse_joint_set,
                            &mut multibody_joint_set,
                            true
                        );
                    });
                });
            });
        });
    });
}

pub fn get_entity_uid_from_collider_handle(collider_handle: ColliderHandle) -> Option<u16> {
    COLLIDER_SET.with(|collider_set| {
        let collider_set = collider_set.borrow();

        if !collider_set.contains(collider_handle) {
            panic!("Tried to get uid of a collider that doesn't exist!");
        }
    
        let collider = collider_set.get(collider_handle).unwrap();

        let collider_parent = collider.parent();
    
        if collider_parent.is_none() {
            return None
        }
    
        let rigid_body_handle = collider_parent.unwrap();
        
        RIGID_BODY_SET.with(|rigid_body_set| {
            let rigid_body_set = rigid_body_set.borrow();
    
            let rigid_body = rigid_body_set.get(rigid_body_handle).unwrap();

            return Some(rigid_body.user_data as u16);
        })
    })
}

pub fn step_physics() {
    PHYSICS_PIPELINE.with(|physics_pipeline| {
        let mut physics_pipeline = physics_pipeline.borrow_mut();

        RIGID_BODY_SET.with(|rigid_body_set| {
            let mut rigid_body_set = rigid_body_set.borrow_mut();

            ISLAND_MANAGER.with(|island_manager| {
                let mut island_manager = island_manager.borrow_mut();

                COLLIDER_SET.with(|collider_set| {
                    let mut collider_set = collider_set.borrow_mut();

                    IMPULSE_JOINT_SET.with(|impulse_joint_set| {
                        let mut impulse_joint_set = impulse_joint_set.borrow_mut();

                        MULTIBODY_JOINT_SET.with(|multibody_joint_set| {
                            let mut multibody_joint_set = multibody_joint_set.borrow_mut();

                            BROAD_PHASE.with(|broad_phase| {
                                let mut broad_phase = broad_phase.borrow_mut();

                                NARROW_PHASE.with(|narrow_phase| {
                                    let mut narrow_phase = narrow_phase.borrow_mut();
    
                                    CCD_SOLVER.with(|ccd_solver| {
                                        let mut ccd_solver = ccd_solver.borrow_mut();

                                        QUERY_PIPELINE.with(|query_pipeline| {
                                            let mut query_pipeline = query_pipeline.borrow_mut();

                                            let gravity = GRAVITY.with(|gravity| gravity.borrow().clone());
    
                                            let integration_parameters = INTEGRATION_PARAMETERS.with(|integration_parameters| integration_parameters.borrow().clone());
                                            let physics_hooks = PHYSICS_HOOKS.with(|physics_hooks| physics_hooks.borrow().clone());
                                            let event_handler = EVENT_HANDLER.with(|event_handler| event_handler.borrow().clone());

                                            physics_pipeline.step(
                                                &gravity,
                                                &integration_parameters,
                                                &mut island_manager,
                                                &mut *broad_phase,
                                                &mut narrow_phase,
                                                &mut rigid_body_set,
                                                &mut collider_set,
                                                &mut impulse_joint_set,
                                                &mut multibody_joint_set,
                                                &mut ccd_solver,
                                                Some(&mut query_pipeline),
                                                &physics_hooks,
                                                &event_handler,
                                            );

                                            for body in island_manager.active_dynamic_bodies().iter() {
                                                let rigid_body = rigid_body_set.get(*body).unwrap();
                                        
                                                let entity = manager::get_entity(rigid_body.user_data as u16);
                                        
                                                let entity = entity.unwrap();
                                        
                                                let body_translation = rigid_body.translation();
                                        
                                                entity.set_property("position", Box::new(Position { x: (body_translation.x * PIXEL_TO_WORLD as f32) as i16, y: (body_translation.y * PIXEL_TO_WORLD as f32) as i16 }));
                                            }

                                            for body in island_manager.active_kinematic_bodies().iter() {
                                                let rigid_body = rigid_body_set.get(*body).unwrap();
                                        
                                                let entity = manager::get_entity(rigid_body.user_data as u16);
                                        
                                                let entity = entity.unwrap();
                                        
                                                let body_translation = rigid_body.translation();
                                        
                                                entity.set_property("position", Box::new(Position { x: (body_translation.x * PIXEL_TO_WORLD as f32) as i16, y: (body_translation.y * PIXEL_TO_WORLD as f32) as i16 }));
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

pub fn apply_impulse_to_body(entity_uid: &u16, impulse: nalgebra::Matrix<f32, nalgebra::Const<2>, nalgebra::Const<1>, nalgebra::ArrayStorage<f32, 2, 1>>, wake_up: bool) {
    UID_HANDLE_MAP.with(|uid_handle_map| {
        let uid_handle_map = uid_handle_map.borrow();

        let rigid_body_handle = uid_handle_map.get(entity_uid).expect("There was no body with this uid!");

        RIGID_BODY_SET.with(|rigid_body_set| {
            let mut rigid_body_set = rigid_body_set.borrow_mut();
    
            let rigid_body = rigid_body_set.get_mut(*rigid_body_handle).unwrap();
        
            rigid_body.apply_impulse(impulse, wake_up);
        })
    })
}

pub fn set_velocity_of_body(entity_uid: &u16, impulse: nalgebra::Matrix<f32, nalgebra::Const<2>, nalgebra::Const<1>, nalgebra::ArrayStorage<f32, 2, 1>>, wake_up: bool) {
    UID_HANDLE_MAP.with(|uid_handle_map| {
        let uid_handle_map = uid_handle_map.borrow();

        let rigid_body_handle = uid_handle_map.get(entity_uid).expect("There was no body with this uid!");

        RIGID_BODY_SET.with(|rigid_body_set| {
            let mut rigid_body_set = rigid_body_set.borrow_mut();
    
            let rigid_body = rigid_body_set.get_mut(*rigid_body_handle).unwrap();
        
            rigid_body.set_linvel(impulse, wake_up);
        })
    })
}

pub fn set_rigid_body_translation(entity_uid: &u16, position: &Position, wake_up: bool) {
    UID_HANDLE_MAP.with(|uid_handle_map| {
        let uid_handle_map = uid_handle_map.borrow();

        let rigid_body_handle = uid_handle_map.get(entity_uid).expect("There was no body with this uid!");

        RIGID_BODY_SET.with(|rigid_body_set| {
            let mut rigid_body_set = rigid_body_set.borrow_mut();
    
            let rigid_body = rigid_body_set.get_mut(*rigid_body_handle).unwrap();

            let translation: nalgebra::Matrix<f32, nalgebra::Const<2>, nalgebra::Const<1>, nalgebra::ArrayStorage<f32, 2, 1>> = vector![
                (position.x / PIXEL_TO_WORLD as i16) as f32,
                (position.y / PIXEL_TO_WORLD as i16) as f32
            ];
        
            rigid_body.set_translation(translation, wake_up);
        })
    })
}

pub fn intersections_with_shape<F>(
    position: &Position,
    yaw: u16,
    query_shape: impl Shape,
    query_filter: QueryFilter,
    mut callback: F,
) where
    F: FnMut(ColliderHandle, &ColliderSet, &RigidBodySet) -> bool,
{
    let translation: nalgebra::Matrix<f32, nalgebra::Const<2>, nalgebra::Const<1>, nalgebra::ArrayStorage<f32, 2, 1>> = vector![
        (position.x / PIXEL_TO_WORLD as i16) as f32,
        (position.y / PIXEL_TO_WORLD as i16) as f32
    ];

    let query_shape_pos = Isometry::new(translation, yaw as f32);

    RIGID_BODY_SET.with(|rigid_body_set| {
        let rigid_body_set = rigid_body_set.borrow();

        COLLIDER_SET.with(|collider_set| {
            let collider_set = collider_set.borrow();

            QUERY_PIPELINE.with(|query_pipeline| {
                let query_pipeline = query_pipeline.borrow();

                query_pipeline.intersections_with_shape(
                    &rigid_body_set,
                    &collider_set,
                    &query_shape_pos,
                    &query_shape,
                    query_filter,
                    |handle| {
                        callback(handle, &collider_set, &rigid_body_set)
                    },
                );
            });
        });
    });
}

pub fn get_rigid_body_from_collider_handle<'a>(
    collider_handle: ColliderHandle,
    colliders: &ColliderSet,
    rigid_bodies: &'a RigidBodySet,
) -> Option<&'a RigidBody> {
    if let Some(collider) = colliders.get(collider_handle) {
        if let Some(parent_handle) = collider.parent() {
            return rigid_bodies.get(parent_handle);
        }
    }

    None
}

pub fn set_collision_groups(rigid_body_handle: RigidBodyHandle, collision_group: InteractionGroups) {
    RIGID_BODY_SET.with(|rigid_body_set| {
        let rigid_body_set = rigid_body_set.borrow();

        let collider_handle = rigid_body_set.get(rigid_body_handle).unwrap().colliders()[0];

        COLLIDER_SET.with(|collider_set| {
            let mut collider_set = collider_set.borrow_mut();

            let collider = collider_set.get_mut(collider_handle).unwrap();

            collider.set_collision_groups(collision_group);
        });
    });
}