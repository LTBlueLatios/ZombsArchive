use super::generic_entity::{self, GenericEntity, Position};
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::manager;
use crate::ENTITIES;
use crate::PARTIES;
use crate::{
    info::buildings::{self, BuildingInfoEnum},
    physics::{self, PIXEL_TO_WORLD},
    CONFIG,
    WORLD_HEIGHT, WORLD_WIDTH
};
use rapier2d::prelude::*;
use std::{any::Any, collections::HashMap};

#[derive(Clone, Debug)]
pub struct Building {
    pub generic_entity: GenericEntity,
    pub last_damaged_tick: u32,
    pub dead: bool,
    pub party_id: u32,
    pub height: f32,
    pub width: f32,
    pub health: u16,
    pub max_health: u16,
    pub tier: u8,
    pub yaw: u16
}

impl Building {
    pub fn new(uid: u16, position: Position, rotation: u16, model: String) -> Self {
        let mut building = Building {
            dead: false,
            tier: 1,
            health: 0,
            max_health: 0,
            generic_entity: GenericEntity::new(uid, model, position),
            last_damaged_tick: 0,
            party_id: 0,
            height: 95.99,
            width: 95.99,
            yaw: rotation
        };

        let building_info = buildings::get_building(&building.generic_entity.model);

        match building_info {
            BuildingInfoEnum::Base(info) => {
                building.health = info.health[0];
                building.max_health = info.health[0];
                building.height = info.height;
                building.width = info.width;
            },
            BuildingInfoEnum::Drill(info) => {
                building.health = info.base_info.health[0];
                building.max_health = info.base_info.health[0];
                building.height = info.base_info.height;
                building.width = info.base_info.width;
            },
            BuildingInfoEnum::Harvester(info) => {
                building.health = info.base_info.health[0];
                building.max_health = info.base_info.health[0];
                building.height = info.base_info.height;
                building.width = info.base_info.width;
            },
            BuildingInfoEnum::Melee(info) => {
                building.health = info.base_info.health[0];
                building.max_health = info.base_info.health[0];
                building.height = info.base_info.height;
                building.width = info.base_info.width;
            },
            BuildingInfoEnum::Ranged(info) => {
                building.health = info.base_info.health[0];
                building.max_health = info.base_info.health[0];
                building.height = info.base_info.height;
                building.width = info.base_info.width;
            }
        }

        let collision_group = InteractionGroups::new(
            Group::GROUP_2,
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3 | Group::GROUP_4,
        );

        physics::create_rigid_body(
            &building.generic_entity.uid,
            physics::RigidBodyType::Fixed,
            &position,
            rotation,
            physics::ColliderShapes::Rect {
                width: building.width,
                height: building.height,
            },
            collision_group,
            None,
            None
        );

        return building;
    }
}

impl generic_entity::EntityTrait for Building {
    fn on_die(&self) {
        PARTIES.with(|p| {
            let mut parties = p.borrow_mut();

            let building_party = parties.get_mut(&self.party_id).unwrap();

            building_party.update_buildings(vec![(self.generic_entity.uid, true)]);
        });
    }
}

pub trait BuildingTrait {
    fn new(uid: u16, position: Position, rotation: u16) -> Self;
    fn on_tick(&mut self, tick_number: u32);
    fn upgrade(&self, tick_number: u32);
    fn take_damage(&self, damage: u16, entity: &EntityTypeEnum) -> u16;
    fn die(&mut self);
    fn set_property(&self, property_name: &str, value: Box<dyn Any>);
}

impl BuildingTrait for Building {
    fn new(_uid: u16, _position: Position, _rotation: u16) -> Self {
        unreachable!()
    }

    fn on_tick(&mut self, tick_number: u32) {
        if self.health < self.max_health {
            let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);
    
            let building_info = buildings::get_building(&self.generic_entity.model);
            let tier_index_usize = (self.tier - 1) as usize;
    
            let (ms_before_health_regen, health_regen_per_second) = match building_info {
                BuildingInfoEnum::Base(info) => {
                    (info.ms_before_health_regen[tier_index_usize], info.health_regen_per_second[tier_index_usize])
                }
                BuildingInfoEnum::Ranged(info) => {
                    (info.base_info.ms_before_health_regen[tier_index_usize], info.base_info.health_regen_per_second[tier_index_usize])
                }
                BuildingInfoEnum::Melee(info) => {
                    (info.base_info.ms_before_health_regen[tier_index_usize], info.base_info.health_regen_per_second[tier_index_usize])
                }
                BuildingInfoEnum::Drill(info) => {
                    (info.base_info.ms_before_health_regen[tier_index_usize], info.base_info.health_regen_per_second[tier_index_usize])
                }
                BuildingInfoEnum::Harvester(info) => {
                    (info.base_info.ms_before_health_regen[tier_index_usize], info.base_info.health_regen_per_second[tier_index_usize])
                }
            };
    
            let ticks_before_health_regen = (ms_before_health_regen / tick_rate) as u32;

            if tick_number - self.last_damaged_tick >= ticks_before_health_regen {
                let health_regen_per_tick = health_regen_per_second * tick_rate / 1000;

                let mut health = self.health + health_regen_per_tick;

                if health > self.max_health {
                    health = self.max_health;
                }

                self.set_property("health", Box::new(health));
            }
        }
    }

    fn upgrade(&self, _tick_number: u32) {
        let tier = self.tier + 1;
        let tier_index_usize = self.tier as usize;

        self.set_property("tier", Box::new(tier));

        let building_info = buildings::get_building(&self.generic_entity.model);

        let health_ratio = self.health as f32 / self.max_health as f32;

        match building_info {
            BuildingInfoEnum::Base(info) => {
                let max_health = info.health[tier_index_usize];
                self.set_property("max_health", Box::new(max_health));

                let health = (health_ratio * max_health as f32) as u16;
                self.set_property("health", Box::new(health));
            },
            BuildingInfoEnum::Drill(info) => {
                let max_health = info.base_info.health[tier_index_usize];
                self.set_property("max_health", Box::new(max_health));

                let health = (health_ratio * max_health as f32) as u16;
                self.set_property("health", Box::new(health));
            },
            BuildingInfoEnum::Harvester(info) => {
                let max_health = info.base_info.health[tier_index_usize];
                self.set_property("max_health", Box::new(max_health));

                let health = (health_ratio * max_health as f32) as u16;
                self.set_property("health", Box::new(health));
            },
            BuildingInfoEnum::Melee(info) => {
                // Spike Traps don't have health
                if self.generic_entity.model == "SpikeTrap" {
                    return;
                };

                let max_health = info.base_info.health[tier_index_usize];
                self.set_property("max_health", Box::new(max_health));

                let health = (health_ratio * max_health as f32) as u16;
                self.set_property("health", Box::new(health));
            },
            BuildingInfoEnum::Ranged(info) => {
                let max_health = info.base_info.health[tier_index_usize];
                self.set_property("max_health", Box::new(max_health));

                let health = (health_ratio * max_health as f32) as u16;
                self.set_property("health", Box::new(health));
            }
        }
    }

    fn take_damage(&self, damage: u16, entity: &EntityTypeEnum) -> u16 {
        let tick_number = CONFIG.with(|c| c.borrow().tick_number);

        // need to call register_hit on factory, but the entities lock is already open when this function is being run

        let mut damage_taken = 0;
        let mut self_health = self.health;

        if damage > self.health {
            damage_taken += self_health;
            self_health = 0;
        } else {
            self_health -= damage;
            damage_taken += damage;
        }

        ENTITIES.with(|e| {
            let entities = e.borrow();

            PARTIES.with(|p| {
                let parties = p.borrow();
    
                let party = parties.get(&self.party_id).unwrap();
    
                let primary_building_uid = party.primary_building_uid.unwrap();

                if primary_building_uid == self.generic_entity.uid {
                    return;
                }
    
                let primary_building = entities.get(&primary_building_uid).unwrap().clone();

                let primary_building = match primary_building {
                    EntityTypeEnum::Factory(e) => e,
                    _ => unreachable!()
                };

                drop(entities);
    
                match entity {
                    EntityTypeEnum::Player(player_entity) => {
                        primary_building.register_hit(player_entity.party_id, player_entity.ip_address);
                    },
                    _ => {}
                }
            });

            let mut entities = e.borrow_mut();

            let self_entity = entities.get_mut(&self.generic_entity.uid).unwrap();

            match self_entity {
                EntityTypeEnum::Factory(entity) => {
                    if entity.base_building.health != self_health {
                        entity.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::ArrowTower(entity) => {
                    if entity.ranged_building.base_building.health != self_health {
                        entity.ranged_building.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.ranged_building.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.ranged_building.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::CannonTower(entity) => {
                    if entity.ranged_building.base_building.health != self_health {
                        entity.ranged_building.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.ranged_building.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.ranged_building.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::MageTower(entity) => {
                    if entity.ranged_building.base_building.health != self_health {
                        entity.ranged_building.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.ranged_building.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.ranged_building.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::RocketTower(entity) => {
                    if entity.ranged_building.base_building.health != self_health {
                        entity.ranged_building.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.ranged_building.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.ranged_building.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::LightningTower(entity) => {
                    if entity.ranged_building.base_building.health != self_health {
                        entity.ranged_building.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.ranged_building.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.ranged_building.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::SawTower(entity) => {
                    if entity.ranged_building.base_building.health != self_health {
                        entity.ranged_building.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.ranged_building.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.ranged_building.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::Wall(entity) => {
                    if entity.base_building.health != self_health {
                        entity.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::LargeWall(entity) => {
                    if entity.base_building.health != self_health {
                        entity.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::SpikeTrap(entity) => {
                    if entity.base_building.health != self_health {
                        entity.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::Door(entity) => {
                    if entity.base_building.health != self_health {
                        entity.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::Drill(entity) => {
                    if entity.base_building.health != self_health {
                        entity.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.base_building.health <= 0 {
                        entity.die();
                    }
                },
                EntityTypeEnum::Harvester(entity) => {
                    if entity.base_building.health != self_health {
                        entity.base_building.health = self_health;
                        manager::flag_property_as_changed(self.generic_entity.uid, "health");
                    }

                    if damage_taken > 0 {
                        entity.base_building.last_damaged_tick = tick_number;
                        manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
                    }

                    if entity.base_building.health <= 0 {
                        entity.die();
                    }
                },
                _ => unreachable!()
            }
        });

        damage_taken
    }

    fn die(&mut self) {
        if self.dead == true {
            return;
        }

        self.dead = true;
        manager::queue_kill_entity(self.generic_entity.uid);
    }

    fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.generic_entity.uid, |entity| {
            // this boolean is only used with variables that should be tracked to be sent to the client
            let mut should_update_client: bool = false;

            match property_name {
                "attacking_side" => {
                    if let Some(attacking_side) = value.downcast_ref::<bool>() {
                        match entity {
                            EntityTypeEnum::RocketTower(e) => e.attacking_side = *attacking_side,
                            _ => unreachable!(),
                        };
                    }
                }
                "health" => {
                    if let Some(health) = value.downcast_ref::<u16>() {
                        match entity {
                            EntityTypeEnum::ArrowTower(e) => e.ranged_building.base_building.health = *health,
                            EntityTypeEnum::CannonTower(e) => e.ranged_building.base_building.health = *health,
                            EntityTypeEnum::Door(e) => e.base_building.health = *health,
                            EntityTypeEnum::Drill(e) => e.base_building.health = *health,
                            EntityTypeEnum::Factory(e) => e.base_building.health = *health,
                            EntityTypeEnum::Harvester(e) => e.base_building.health = *health,
                            EntityTypeEnum::LargeWall(e) => e.base_building.health = *health,
                            EntityTypeEnum::LightningTower(e) => e.ranged_building.base_building.health = *health,
                            EntityTypeEnum::MageTower(e) => e.ranged_building.base_building.health = *health,
                            EntityTypeEnum::RocketTower(e) => e.ranged_building.base_building.health = *health,
                            EntityTypeEnum::SawTower(e) => e.ranged_building.base_building.health = *health,
                            EntityTypeEnum::Wall(e) => e.base_building.health = *health,
                            _ => unreachable!(),
                        };

                        should_update_client = true;
                    }
                }
                "max_health" => {
                    if let Some(max_health) = value.downcast_ref::<u16>() {
                        match entity {
                            EntityTypeEnum::ArrowTower(e) => e.ranged_building.base_building.max_health = *max_health,
                            EntityTypeEnum::CannonTower(e) => e.ranged_building.base_building.max_health = *max_health,
                            EntityTypeEnum::Door(e) => e.base_building.max_health = *max_health,
                            EntityTypeEnum::Drill(e) => e.base_building.max_health = *max_health,
                            EntityTypeEnum::Factory(e) => e.base_building.max_health = *max_health,
                            EntityTypeEnum::Harvester(e) => e.base_building.max_health = *max_health,
                            EntityTypeEnum::LargeWall(e) => e.base_building.max_health = *max_health,
                            EntityTypeEnum::LightningTower(e) => e.ranged_building.base_building.max_health = *max_health,
                            EntityTypeEnum::MageTower(e) => e.ranged_building.base_building.max_health = *max_health,
                            EntityTypeEnum::RocketTower(e) => e.ranged_building.base_building.max_health = *max_health,
                            EntityTypeEnum::SawTower(e) => e.ranged_building.base_building.max_health = *max_health,
                            EntityTypeEnum::Wall(e) => e.base_building.max_health = *max_health,
                            _ => unreachable!(),
                        };

                        should_update_client = true;
                    }
                }
                "target_beams" => {
                    if let Ok(target_beams) = value.downcast::<Vec<(i16, i16)>>() {
                        match entity {
                            EntityTypeEnum::LightningTower(e) => e.target_beams = *target_beams,
                            _ => unreachable!(),
                        };

                        should_update_client = true;
                    }
                }
                "range_cells" => {
                    if let Ok(range_cells) = value.downcast::<Vec<Option<Position>>>() {
                        match entity {
                            EntityTypeEnum::ArrowTower(e) => {
                                e.ranged_building.range_cells = *range_cells
                            }
                            EntityTypeEnum::CannonTower(e) => {
                                e.ranged_building.range_cells = *range_cells
                            }
                            EntityTypeEnum::MageTower(e) => {
                                e.ranged_building.range_cells = *range_cells
                            }
                            EntityTypeEnum::RocketTower(e) => {
                                e.ranged_building.range_cells = *range_cells
                            }
                            EntityTypeEnum::LightningTower(e) => {
                                e.ranged_building.range_cells = *range_cells
                            }
                            EntityTypeEnum::SawTower(e) => {
                                e.ranged_building.range_cells = *range_cells
                            }
                            _ => unreachable!(),
                        };
                    }
                }
                "position" => {
                    if let Some(position) = value.downcast_ref::<Position>() {
                        match entity {
                            EntityTypeEnum::ArrowTower(e) => {
                                e.ranged_building.base_building.generic_entity.position = *position
                            }
                            EntityTypeEnum::CannonTower(e) => {
                                e.ranged_building.base_building.generic_entity.position = *position
                            }
                            EntityTypeEnum::MageTower(e) => {
                                e.ranged_building.base_building.generic_entity.position = *position
                            }
                            EntityTypeEnum::RocketTower(e) => {
                                e.ranged_building.base_building.generic_entity.position = *position
                            }
                            EntityTypeEnum::LightningTower(e) => {
                                e.ranged_building.base_building.generic_entity.position = *position
                            }
                            EntityTypeEnum::SawTower(e) => {
                                e.ranged_building.base_building.generic_entity.position = *position
                            }
                            _ => unreachable!(),
                        };

                        should_update_client = true;
                    }
                }
                "firing_tick" => {
                    if let Some(firing_tick) = value.downcast_ref::<u32>() {
                        match entity {
                            EntityTypeEnum::ArrowTower(e) => {
                                e.ranged_building.firing_tick = *firing_tick
                            }
                            EntityTypeEnum::CannonTower(e) => {
                                e.ranged_building.firing_tick = *firing_tick
                            }
                            EntityTypeEnum::MageTower(e) => {
                                e.ranged_building.firing_tick = *firing_tick
                            }
                            EntityTypeEnum::RocketTower(e) => {
                                e.ranged_building.firing_tick = *firing_tick
                            }
                            EntityTypeEnum::LightningTower(e) => {
                                e.ranged_building.firing_tick = *firing_tick
                            }
                            EntityTypeEnum::SawTower(e) => {
                                e.ranged_building.firing_tick = *firing_tick
                            }
                            _ => unreachable!(),
                        };

                        should_update_client = true;
                    }
                }
                "aiming_yaw" => {
                    if let Some(aiming_yaw) = value.downcast_ref::<u16>() {
                        match entity {
                            EntityTypeEnum::ArrowTower(e) => {
                                e.ranged_building.aiming_yaw = *aiming_yaw
                            }
                            EntityTypeEnum::CannonTower(e) => {
                                e.ranged_building.aiming_yaw = *aiming_yaw
                            }
                            EntityTypeEnum::MageTower(e) => {
                                e.ranged_building.aiming_yaw = *aiming_yaw
                            }
                            EntityTypeEnum::RocketTower(e) => {
                                e.ranged_building.aiming_yaw = *aiming_yaw
                            }
                            EntityTypeEnum::LightningTower(e) => {
                                e.ranged_building.aiming_yaw = *aiming_yaw
                            }
                            EntityTypeEnum::SawTower(e) => {
                                e.ranged_building.aiming_yaw = *aiming_yaw
                            }
                            _ => unreachable!(),
                        };

                        should_update_client = true;
                    }
                }
                "party_id" => {
                    if let Some(party_id) = value.downcast_ref::<u32>() {
                        match entity {
                            EntityTypeEnum::ArrowTower(e) => {
                                e.ranged_building.base_building.party_id = *party_id
                            }
                            EntityTypeEnum::CannonTower(e) => {
                                e.ranged_building.base_building.party_id = *party_id
                            }
                            EntityTypeEnum::MageTower(e) => {
                                e.ranged_building.base_building.party_id = *party_id
                            }
                            EntityTypeEnum::RocketTower(e) => {
                                e.ranged_building.base_building.party_id = *party_id
                            }
                            EntityTypeEnum::LightningTower(e) => {
                                e.ranged_building.base_building.party_id = *party_id
                            }
                            EntityTypeEnum::SawTower(e) => {
                                e.ranged_building.base_building.party_id = *party_id
                            }
                            _ => unreachable!(),
                        };

                        should_update_client = true;
                    }
                }
                "tier" => {
                    if let Some(tier) = value.downcast_ref::<u8>() {
                        match entity {
                            EntityTypeEnum::ArrowTower(e) => {
                                e.ranged_building.base_building.tier = *tier;
                            }
                            EntityTypeEnum::CannonTower(e) => {
                                e.ranged_building.base_building.tier = *tier;
                            }
                            EntityTypeEnum::Door(e) => {
                                e.base_building.tier = *tier;
                            }
                            EntityTypeEnum::Drill(e) => {
                                e.base_building.tier = *tier;
                            }
                            EntityTypeEnum::Factory(e) => {
                                e.base_building.tier = *tier;
                            }
                            EntityTypeEnum::Harvester(e) => {
                                e.base_building.tier = *tier;
                            }
                            EntityTypeEnum::LargeWall(e) => {
                                e.base_building.tier = *tier;
                            }
                            EntityTypeEnum::LightningTower(e) => {
                                e.ranged_building.base_building.tier = *tier;
                            }
                            EntityTypeEnum::MageTower(e) => {
                                e.ranged_building.base_building.tier = *tier;
                            }
                            EntityTypeEnum::RocketTower(e) => {
                                e.ranged_building.base_building.tier = *tier;
                            }
                            EntityTypeEnum::SawTower(e) => {
                                e.ranged_building.base_building.tier = *tier;
                            }
                            EntityTypeEnum::SpikeTrap(e) => {
                                e.base_building.tier = *tier;
                            }
                            EntityTypeEnum::Wall(e) => {
                                e.base_building.tier = *tier;
                            }
                            _ => unreachable!(),
                        };

                        should_update_client = true;
                    }
                }
                _ => panic!("Unknown property '{}'", property_name),
            }

            if should_update_client == true {
                manager::flag_property_as_changed(
                    self.generic_entity.uid,
                    property_name,
                );
            }
        })
    }
}

#[derive(Debug, Clone)]
pub struct AttackingBuilding {
    pub base_building: Building,
    pub aiming_yaw: u16,
    pub firing_tick: u32,
    // This vector contains cells that are within range of the building.
    // It is sorted so that the closest cells are first.
    // All cells of the same distance from the building are next to each other
    // and distances are separated by None
    // EX: Some(a), Some(b), None, Some(c), Some(d)
    // a and b are the same distance, c and d are the same distance, and None separates them
    pub range_cells: Vec<Option<Position>>,
    pub rapidfire_buffed: bool
}

pub trait AttackingBuildingTrait {
    fn get_closest_enemy(&mut self, tick_number: u32) -> Option<u16>;
    fn fire_ranged(&self, enemy_uid: u16);
    fn update_range_cells(&self) -> Option<Vec<Option<Position>>>;
    fn set_buffed(&mut self, buffed: bool);
}

impl AttackingBuildingTrait for AttackingBuilding {
    fn update_range_cells(&self) -> Option<Vec<Option<Position>>> {
        let pixel_to_world = PIXEL_TO_WORLD as i16;
        let self_position_x = self.base_building.generic_entity.position.x;
        let self_position_y = self.base_building.generic_entity.position.y;

        let self_position_x =
            ((self_position_x - self_position_x % pixel_to_world) / pixel_to_world) as i32;
        let self_position_y =
            ((self_position_y - self_position_y % pixel_to_world) / pixel_to_world) as i32;

        let building_info = buildings::get_building(&self.base_building.generic_entity.model);
        let tier_index_usize = (self.base_building.tier - 1) as usize;

        let building_range = match &building_info {
            BuildingInfoEnum::Ranged(e) => e.tower_range[tier_index_usize],
            BuildingInfoEnum::Melee(e) => e.tower_range[tier_index_usize],
            _ => unreachable!(),
        };

        // TODO: the range is not completely correct. should mix floor and ceil
        let building_range = (building_range as f32
            / pixel_to_world as f32)
            .round() as i32;
        let range_squared = building_range.pow(2);

        let mut range_cells: HashMap<i32, Vec<Position>> = HashMap::new();

        for x in (self_position_x - building_range)..=(self_position_x + building_range) {
            if x < 0 || x > WORLD_WIDTH as i32 {
                continue;
            }

            for y in (self_position_y - building_range)..=(self_position_y + building_range) {
                if y < 0 || y > WORLD_HEIGHT as i32 {
                    continue;
                }

                // We get the distance to the center of the cell instead of the top left corner
                let center_x = x as f32 + 0.5;
                let center_y = y as f32 + 0.5;

                let dist_to_self = (center_x - self_position_x as f32).powf(2.0)
                    + (center_y - self_position_y as f32).powf(2.0);

                if dist_to_self <= range_squared as f32 {
                    let vec = range_cells
                        .entry((dist_to_self * 10.0) as i32)
                        .or_insert_with(Vec::new);
                    vec.push(Position {
                        x: x as i16 * pixel_to_world,
                        y: y as i16 * pixel_to_world,
                    });
                }
            }
        }

        let mut distances: Vec<i32> = range_cells.keys().cloned().collect();
        distances.sort_unstable();

        let mut sorted_range_cells: Vec<Option<Position>> = Vec::new();

        for dist in distances {
            if let Some(positions) = range_cells.get(&dist) {
                for i in positions.iter() {
                    sorted_range_cells.push(Some(*i));
                }
            }
            sorted_range_cells.push(None);
        }

        Some(sorted_range_cells)
    }

    fn fire_ranged(&self, _enemy_uid: u16) {}

    fn get_closest_enemy(&mut self, _tick_number: u32) -> Option<u16> {
        let enemies_queried = PARTIES.with(|p| {
            let parties = p.borrow();

            let party = parties.get(&self.base_building.party_id).unwrap();

            let primary_building_uid = party.primary_building_uid.unwrap();

            ENTITIES.with(|e| {
                let entities = e.borrow();

                match entities.get(&primary_building_uid).unwrap() {
                    EntityTypeEnum::Factory(e) => e.enemies_queried.clone(),
                    _ => unreachable!(),
                }
            })
        });

        let mut uids_in_range: Vec<u16> = Vec::new();

        for i in self.range_cells.iter() {
            match i {
                Some(cell_pos) => {
                    let cell = match enemies_queried.get(&cell_pos) {
                        Some(cell) => cell,
                        None => continue,
                    };

                    let mut uids: Vec<u16> = cell.iter().copied().collect();
                    uids_in_range.append(&mut uids);
                    continue;
                }
                None => {
                    if uids_in_range.len() > 0 {
                        break;
                    } else {
                        continue;
                    }
                }
            }
        }

        if uids_in_range.len() <= 0 {
            return None;
        }

        let mut closest_enemy: Option<(u16, u32)> = None;

        for uid in uids_in_range.iter() {
            ENTITIES.with(|e| {
                let entities = e.borrow();
                let entity = entities.get(uid).unwrap();

                let dist = self
                    .base_building
                    .generic_entity
                    .position
                    .distance_to(&entity.generic_entity().position);

                match closest_enemy {
                    Some((_closest_enemy_uid, closest_enemy_distance)) => {
                        if dist < closest_enemy_distance {
                            closest_enemy = Some((*uid, dist));
                        }
                    }
                    None => {
                        closest_enemy = Some((*uid, dist));
                    }
                };
            });
        }

        let closest_enemy = closest_enemy.unwrap();

        Some(closest_enemy.0)
    }

    fn set_buffed(&mut self, buffed: bool) {
        self.rapidfire_buffed = buffed;
    }
}
