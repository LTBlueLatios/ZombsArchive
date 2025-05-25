use super::building::BuildingTrait;
use super::generic_entity::{self, EntityTrait, Position};
use super::{Player, Zombie};
use rapier2d::prelude::*;
use crate::info::buildings::TIERS;
use crate::physics::{self, ActiveHooksEnum, PIXEL_TO_WORLD};
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::manager::{self, ENTITIES};
use crate::{GameModes, CONFIG, PARTIES};
use std::any::Any;
use std::f32::consts::PI;

use crate::physics::RIGID_BODY_SET;

pub const ROCKET_PROJECTILE_LOW_VELOCITY: [f32; TIERS] = [4.0, 4.0, 4.0, 5.0, 5.0, 6.0, 6.0, 8.0];
pub const ROCKET_PROJECTILE_LOW_SPEED_TIME_TICKS: [u32; TIERS] = [5; TIERS];

#[derive(Clone, Debug)]
pub enum ProjectileTypeEnum {
    ArrowTower,
    CannonTower,
    MageTower,
    RocketTower,
    PlayerArrow,
    PlayerDynamite
}

#[derive(Clone, Debug)]
pub struct Projectile {
    pub creation_tick: u32,
    pub acceleration: Option<f32>,
    pub generic_entity: generic_entity::GenericEntity,
    pub projectile_type: ProjectileTypeEnum,
    pub radius: f32,
    pub death_tick: u32,
    pub velocity: nalgebra::Matrix<f32, nalgebra::Const<2>, nalgebra::Const<1>, nalgebra::ArrayStorage<f32, 2, 1>>,
    pub tier: u8,
    pub rigid_body_handle: Option<RigidBodyHandle>,
    pub party_id: u32,
    pub yaw: u16,
    pub damage_to_zombies: u16,
    pub damage_to_players: u16,
    pub damage_to_buildings: u16,
    pub knockback_distance: u8,
    pub colliding_entities: Vec<u16>,
    pub aoe_range: u16,
    pub dead: bool,
    pub parent_uid: u16
}

impl Projectile {
    pub fn new(uid: u16, position: Position, rotation: u16) -> Self {
        let resource_instance = Projectile {
            creation_tick: 0,
            acceleration: None,
            projectile_type: ProjectileTypeEnum::ArrowTower,
            generic_entity: generic_entity::GenericEntity::new(uid, "ArrowProjectile".to_owned(), position),
            radius: 16.0,
            death_tick: 0,
            rigid_body_handle: None,
            velocity: vector![0.0, 0.0],
            tier: 1,
            yaw: rotation,
            party_id: 0,
            damage_to_zombies: 0,
            damage_to_players: 0,
            damage_to_buildings: 0,
            knockback_distance: 0,
            colliding_entities: Vec::new(),
            aoe_range: 0,
            dead: false,
            parent_uid: 0
        };

        return resource_instance;
    }

    pub fn die(&self) {
        self.set_property("dead", Box::new(true));

        manager::queue_kill_entity(self.generic_entity.uid);

        let self_entity = EntityTypeEnum::Projectile(self.clone());

        // Rocket projectiles deal zero impact damage or knockback, and deal AOE damage
        if matches!(self.projectile_type, ProjectileTypeEnum::RocketTower) ||
        matches!(self.projectile_type, ProjectileTypeEnum::PlayerDynamite) {
            let primary_building_uid = PARTIES.with(|p| {
                let parties = p.borrow();
    
                let party = match parties.get(&self.party_id) {
                    Some(p) => p,
                    None => return None
                };
    
                party.primary_building_uid
            });

            if matches!(self.projectile_type, ProjectileTypeEnum::RocketTower) {
                if primary_building_uid.is_none() {
                    return;
                }
            }
    
            let query_shape = Ball::new((self.aoe_range / PIXEL_TO_WORLD as u16) as f32);
            let query_filter = QueryFilter::default();
    
            let mut enemy_uids: Vec<u16> = Vec::new();
            let mut parent_player_entity: Option<Player> = None;
    
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
                        let entities = e.borrow();

                        let entity_is_enemy = match self.projectile_type {
                            ProjectileTypeEnum::PlayerDynamite => {
                                let parent_player = entities.get(&self.parent_uid);
            
                                let mut is_enemy: bool = false;
            
                                if let Some(parent_player) = parent_player {
                                    if let EntityTypeEnum::Player(player_entity) = parent_player {
                                        let hit_entity = entities.get(&entity_uid).unwrap();
                
                                        is_enemy = player_entity.check_entity_is_enemy(hit_entity);
            
                                        parent_player_entity = Some(player_entity.clone());
                                    }
                                }
                                is_enemy
                            },
                            ProjectileTypeEnum::RocketTower => {
                                if let Some(primary_building_uid) = primary_building_uid {
                                    let primary_building = entities.get(&primary_building_uid).unwrap();
            
                                    let EntityTypeEnum::Factory(primary_building) = primary_building else {
                                        unreachable!();
                                    };
            
                                    let hit_entity = entities.get(&entity_uid).unwrap();
            
                                    primary_building.check_entity_is_enemy(&hit_entity)
                                } else {
                                    false
                                }
                            },
                            _ => unreachable!()
                        };
    
                        if entity_is_enemy == true {
                            enemy_uids.push(entity_uid);
                        }
                    });
    
                    true
            });

            if enemy_uids.len() <= 0 {
                return;
            }

            if matches!(self.projectile_type, ProjectileTypeEnum::PlayerDynamite) {
                let parent_player_entity = parent_player_entity.unwrap();
                let mut player_damages = parent_player_entity.last_player_damages.clone();

                let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

                for enemy_uid in enemy_uids.iter() {
                    ENTITIES.with(|e| {
                        let mut entities = e.borrow_mut();
                        let enemy_entity = entities.get_mut(enemy_uid).unwrap().clone();

                        drop(entities);

                        let damage_dealt = match &enemy_entity {
                            EntityTypeEnum::Player(entity) => {
                                if matches!(game_mode, GameModes::Scarcity) {
                                    0
                                } else {
                                    entity.take_damage(self.damage_to_players, &self_entity)
                                }
                            },
                            EntityTypeEnum::Zombie(entity) => entity.take_damage(self.damage_to_zombies, &self_entity),
                            _ => 0
                        };

                        if damage_dealt > 0 {
                            player_damages.push((enemy_entity.generic_entity().position.clone(), damage_dealt));
                        }
                    });
                }
                parent_player_entity.set_property("last_player_damages", Box::new(player_damages));
            } else {
                for enemy_uid in enemy_uids.iter() {
                    ENTITIES.with(|e| {
                        let mut entities = e.borrow_mut();
                        let enemy_entity = entities.get_mut(enemy_uid).unwrap().clone();

                        drop(entities);

                        match enemy_entity {
                            EntityTypeEnum::Player(entity) => entity.take_damage(self.damage_to_players, &self_entity),
                            EntityTypeEnum::Zombie(entity) => entity.take_damage(self.damage_to_zombies, &self_entity),
                            _ => unreachable!()
                        }
                    });
                }
            }
        }
    }

    pub fn initialise_physics(&mut self, tick_number: u32) {
        self.creation_tick = tick_number;

        let collision_group = InteractionGroups::new(
            Group::GROUP_4,
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3
        );

        match &self.projectile_type {
            ProjectileTypeEnum::RocketTower => {
                let tier_index_usize = (self.tier - 1) as usize;
        
                let projectile_low_velocity= vector![
                    (self.yaw as f32 * PI / 180.0).sin() * ROCKET_PROJECTILE_LOW_VELOCITY[tier_index_usize],
                    -(self.yaw as f32 * PI / 180.0).cos() * ROCKET_PROJECTILE_LOW_VELOCITY[tier_index_usize]
                ];
        
                let rigid_body_handle = physics::create_rigid_body(&self.generic_entity.uid, physics::RigidBodyType::Kinematic { velocity: projectile_low_velocity },  &self.generic_entity.position, 0, physics::ColliderShapes::SensorBall { radius: self.radius }, collision_group, Some(ActiveHooksEnum::FilterIntersectionPair), Some(ActiveCollisionTypes::default() | ActiveCollisionTypes::KINEMATIC_FIXED));

                self.rigid_body_handle = Some(rigid_body_handle);

            },
            _ => {
                let rigid_body_handle = physics::create_rigid_body(&self.generic_entity.uid, physics::RigidBodyType::Kinematic { velocity: self.velocity },  &self.generic_entity.position, 0, physics::ColliderShapes::SensorBall { radius: self.radius }, collision_group, Some(ActiveHooksEnum::FilterIntersectionPair), Some(ActiveCollisionTypes::default() | ActiveCollisionTypes::KINEMATIC_FIXED));
        
                self.rigid_body_handle = Some(rigid_body_handle);
            }
        }
    }

    pub fn on_collision(&self, hit_entity_uid: u16) {
        let primary_building_uid = PARTIES.with(|p| {
            let parties = p.borrow();

            let party = match parties.get(&self.party_id) {
                Some(p) => p,
                None => return None
            };

            party.primary_building_uid
        });

        let mut should_die: bool = false;
        let mut parent_player_entity: Option<Player> = None;
        let mut damage_dealt: Option<u16> = None;
        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        let hit_entity_position = ENTITIES.with(|e| {
            let entities = e.borrow();

            match entities.get(&hit_entity_uid) {
                Some(_) => {},
                None => return None
            }

            let entity_is_enemy = match self.projectile_type {
                ProjectileTypeEnum::PlayerArrow => {
                    let parent_player = entities.get(&self.parent_uid);

                    let mut is_enemy: bool = false;

                    if let Some(parent_player) = parent_player {
                        if let EntityTypeEnum::Player(player_entity) = parent_player {
                            let hit_entity = entities.get(&hit_entity_uid).unwrap();
    
                            is_enemy = player_entity.check_entity_is_enemy(hit_entity);

                            parent_player_entity = Some(player_entity.clone());
                        }
                    }
                    is_enemy
                },
                _ => {
                    if let Some(primary_building_uid) = primary_building_uid {
                        let primary_building = entities.get(&primary_building_uid).unwrap();

                        let EntityTypeEnum::Factory(primary_building) = primary_building else {
                            unreachable!();
                        };

                        let hit_entity = entities.get(&hit_entity_uid).unwrap();

                        primary_building.check_entity_is_enemy(&hit_entity)
                    } else {
                        false
                    }
                }
            };

            drop(entities);

            let mut entities = e.borrow_mut();

            let mut hit_entity = entities.get_mut(&hit_entity_uid).unwrap().clone();

            drop(entities);

            if entity_is_enemy == true {
                let mut should_knockback: bool = true;
                
                match self.projectile_type {
                    ProjectileTypeEnum::ArrowTower |
                    ProjectileTypeEnum::MageTower |
                    ProjectileTypeEnum::CannonTower => {
                        match hit_entity {
                            EntityTypeEnum::Player(ref mut entity) => self.damage_player(entity),
                            EntityTypeEnum::Zombie(ref mut entity) => self.damage_zombie(entity),
                            _ => return None
                        };
                    },
                    ProjectileTypeEnum::RocketTower => {},
                    ProjectileTypeEnum::PlayerDynamite => {},
                    ProjectileTypeEnum::PlayerArrow => {
                        let damage = match hit_entity {
                            EntityTypeEnum::Zombie(ref mut entity) => self.damage_zombie(entity),
                            EntityTypeEnum::Player(ref mut entity) => {
                                if matches!(game_mode, GameModes::Scarcity) {
                                    should_knockback = false;
                                    0
                                } else {
                                    self.damage_player(entity)
                                }
                            },
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
                            EntityTypeEnum::Wall(_) => {
                                if matches!(game_mode, GameModes::Scarcity) {
                                    0
                                } else {
                                    self.damage_building(&mut hit_entity)
                                }
                            },
                            _ => return None
                        };

                        damage_dealt = Some(damage);
                    },
                }

                should_die = true;

                match self.projectile_type {
                    ProjectileTypeEnum::ArrowTower |
                    ProjectileTypeEnum::MageTower |
                    ProjectileTypeEnum::PlayerArrow => {
                        if should_knockback == true {
                            self.knock_entity_back(&hit_entity);
                        }
                    },
                    ProjectileTypeEnum::RocketTower => {},
                    ProjectileTypeEnum::CannonTower => {},
                    ProjectileTypeEnum::PlayerDynamite => {}
                };
            }

            Some(hit_entity.generic_entity().position.clone())
        });

        if should_die == true {
            if matches!(self.projectile_type, ProjectileTypeEnum::PlayerArrow) {
                let damage_dealt = damage_dealt.unwrap();

                let parent_player_entity = parent_player_entity.unwrap();
                let mut player_damages = parent_player_entity.last_player_damages.clone();

                player_damages.push((hit_entity_position.unwrap(), damage_dealt));

                parent_player_entity.set_property("last_player_damages", Box::new(player_damages));
            }
            // Cannon projectiles deal damage to the single entity they collide with, then deal AOE knockback
            if matches!(self.projectile_type, ProjectileTypeEnum::CannonTower) {
                let query_shape = Ball::new((self.aoe_range / PIXEL_TO_WORLD) as f32);
                let query_filter = QueryFilter::default();
        
                let mut enemy_uids: Vec<u16> = Vec::new();
        
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
                            let entities = e.borrow();
    
                            let primary_building = entities.get(&primary_building_uid.unwrap()).unwrap();
                
                            let EntityTypeEnum::Factory(primary_building) = primary_building else {
                                unreachable!();
                            };
        
                            match entities.get(&entity_uid) {
                                Some(entity) => {
                                    if primary_building.check_entity_is_enemy(entity) == true {
                                        enemy_uids.push(entity_uid);
                                    }
                                }
                                None => {}
                            };
                        });
        
                        true
                });
    
                for enemy_uid in enemy_uids.iter() {
                    ENTITIES.with(|e| {
                        let entities = e.borrow();
                        let enemy_entity = entities.get(enemy_uid).unwrap();
    
                        self.knock_entity_back(enemy_entity);
                    });
                }
            }

            self.die();
        }
    }

    fn knock_entity_back(&self, hit_entity: &EntityTypeEnum) {
        let speed = self.knockback_distance as f32;
        let yaw_f32 = self.yaw as f32;

        let x_impulse = (yaw_f32 * PI / 180.0).sin() * speed;
        let y_impulse = (yaw_f32 * PI / 180.0).cos() * speed;

        let impulse = vector![
            x_impulse,
            -y_impulse
        ];

        physics::apply_impulse_to_body(&hit_entity.generic_entity().uid, impulse, true);
    }

    fn damage_player(&self, player_entity: &mut Player) -> u16 {
        let self_entity = EntityTypeEnum::Projectile(self.clone());

        player_entity.take_damage(self.damage_to_players, &self_entity)
    }

    fn damage_building(&self, building_entity: &EntityTypeEnum) -> u16 {
        let self_entity = EntityTypeEnum::Projectile(self.clone());

        match building_entity {
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
        }
    }

    fn damage_zombie(&self, zombie_entity: &mut Zombie) -> u16 {
        let self_entity = EntityTypeEnum::Projectile(self.clone());

        zombie_entity.take_damage(self.damage_to_zombies, &self_entity)
    }

    pub fn on_tick(&mut self, tick_number: u32) {
        if tick_number >= self.death_tick {
            self.die();
            return;
        }

        let tier_index_usize = (self.tier - 1) as usize;

        match &self.projectile_type {
            ProjectileTypeEnum::RocketTower => {
                let low_speed_time_ticks = ROCKET_PROJECTILE_LOW_SPEED_TIME_TICKS[tier_index_usize];
                if tick_number - self.creation_tick == low_speed_time_ticks {
                    RIGID_BODY_SET.with(|rigid_body_set| {
                        let mut rigid_body_set = rigid_body_set.borrow_mut();

                        let rigid_body = rigid_body_set.get_mut(self.rigid_body_handle.unwrap()).unwrap();

                        rigid_body.set_linvel(self.velocity, true);
                    });
                }
            },
            _ => {}
        }

        if self.colliding_entities.len() > 0 {
            for hit_entity_uid in self.colliding_entities.iter() {
                self.on_collision(*hit_entity_uid);
            }

            let mut colliding_entities = self.colliding_entities.clone();
            colliding_entities.clear();
            self.set_property("colliding_entities", Box::new(colliding_entities));
        }
    }

    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        // println!("{}", property_name);
        manager::with_entity(self.generic_entity.uid, |entity| {
            let EntityTypeEnum::Projectile(entity) = entity else {
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
                "colliding_entities" => {
                    if let Ok(colliding_entities) = value.downcast::<Vec<u16>>() {
                        entity.colliding_entities = *colliding_entities;
                    }
                },
                "dead" => {
                    if let Some(dead) = value.downcast_ref::<bool>() {
                        entity.dead = *dead;
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

impl EntityTrait for Projectile {
    fn on_die(&self) {
    }
}