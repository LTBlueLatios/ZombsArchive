use super::generic_entity::{self, Position};
use super::resource_pickup::ResourcePickupTypeEnum;
use super::{harvester, AllEntityTypesEnum};
use rapier2d::prelude::*;
use crate::info::buildings::{self, BuildingInfoEnum};
use crate::physics::PIXEL_TO_WORLD;
use crate::{physics, CONFIG};
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::manager::{self, ENTITIES};
use std::any::Any;
use std::f32::consts::PI;
use rand::prelude::*;

#[derive(Clone, Debug)]
pub enum HarvestStagesEnum {
    Idle,
    Enroute,
    Collecting,
    Returning
}

impl HarvestStagesEnum {
    pub fn harvest_stage_as_index(&self) -> u8 {
        match self {
            Self::Idle => 0,
            Self::Enroute => 1,
            Self::Collecting => 2,
            Self::Returning => 3
        }
    }
}

const IDLE_RANDOM_RADIUS: f32 = 240.0;

#[derive(Clone, Debug)]
pub struct HarvesterDrone {
    pub generic_entity: generic_entity::GenericEntity,
    pub harvest_stage: HarvestStagesEnum,
    pub radius: f32,
    pub last_damaged_tick: u32,
    pub parent_uid: u16,
    pub health: u16,
    pub max_health: u16,
    pub wood: f32,
    pub stone: f32,
    pub party_id: u32,
    pub speed: u8,
    pub tier: u8,
    pub target_resource_uid: Option<u16>,
    pub target_position: Position,
    pub yaw: u16,
    pub charging_at_resource: bool,
    pub last_charge_tick: u32,
    pub should_maintain_velocity: bool
}

impl HarvesterDrone {
    pub fn new(uid: u16, position: Position, rotation: u16) -> Self {
        let mut drone_instance = HarvesterDrone {
            generic_entity: generic_entity::GenericEntity::new(uid, "HarvesterDrone".to_owned(), position),
            harvest_stage: HarvestStagesEnum::Idle,
            radius: 10.0,
            last_damaged_tick: 0,
            parent_uid: 0,
            health: 0,
            max_health: 0,
            wood: 0.0,
            stone: 0.0,
            party_id: 0,
            speed: 1,
            tier: 1,
            target_resource_uid: None,
            target_position: position,
            yaw: rotation,
            charging_at_resource: false,
            last_charge_tick: 0,
            should_maintain_velocity: false
        };

        drone_instance.target_position = drone_instance.generate_random_space_around_target(drone_instance.target_position, IDLE_RANDOM_RADIUS);

        let angle_to_target = drone_instance.generic_entity.position.angle_to(&drone_instance.target_position);
        drone_instance.yaw = angle_to_target;

        let collision_group = InteractionGroups::new(
            Group::GROUP_4,
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3
        );

        physics::create_rigid_body(&drone_instance.generic_entity.uid, physics::RigidBodyType::Dynamic { linear_damping_factor: 0.0 },  &position, 0, physics::ColliderShapes::SensorBall { radius: drone_instance.radius }, collision_group, None, None);

        return drone_instance;
    }

    pub fn generate_random_space_around_target(&self, target_position: Position, radius: f32) -> Position {
        let mut rng = rand::thread_rng();
        let rand_angle = rng.gen_range(0.0..(2.0 * PI));

        let dist = radius * rng.gen_range(0.0f32..1.0f32).sqrt();

        let x = target_position.x as f32 + dist * rand_angle.cos();
        let y = target_position.y as f32 + dist * rand_angle.sin();

        Position {
            x: x as i16,
            y: y as i16
        }
    }

    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.generic_entity.uid, |entity| {
            let EntityTypeEnum::HarvesterDrone(drone_entity) = entity else {
                unreachable!()
            };

            // this boolean is only used with variables that should be tracked to be sent to the client
            let mut should_update_client: bool = false;

            match property_name {
                "position" => {
                    if let Some(position) = value.downcast_ref::<Position>() {
                        drone_entity.generic_entity.position = *position;

                        should_update_client = true;
                    }
                },
                "yaw" => {
                    if let Some(yaw) = value.downcast_ref::<u16>() {
                        drone_entity.yaw = *yaw;

                        should_update_client = true;
                    }
                },
                "harvest_stage" => {
                    if let Ok(harvest_stage) = value.downcast::<HarvestStagesEnum>() {
                        drone_entity.harvest_stage = *harvest_stage;

                        should_update_client = true;
                    }
                },
                "wood" => {
                    if let Some(resource) = value.downcast_ref::<f32>() {
                        drone_entity.wood = *resource;
                    }
                },
                "stone" => {
                    if let Some(resource) = value.downcast_ref::<f32>() {
                        drone_entity.stone = *resource;
                    }
                },
                "party_id" => {
                    if let Some(party_id) = value.downcast_ref::<u32>() {
                        drone_entity.party_id = *party_id;

                        should_update_client = true;
                    }
                },
                "target_position" => {
                    if let Some(target_position) = value.downcast_ref::<Position>() {
                        drone_entity.target_position = *target_position;
                    }
                },
                "target_resource_uid" => {
                    if let Some(target_resource_uid) = value.downcast_ref::<Option<u16>>() {
                        drone_entity.target_resource_uid = *target_resource_uid;
                    }
                },
                "should_maintain_velocity" => {
                    if let Some(should_maintain_velocity) = value.downcast_ref::<bool>() {
                        drone_entity.should_maintain_velocity = *should_maintain_velocity;
                    }
                },
                "charging_at_resource" => {
                    if let Some(charging_at_resource) = value.downcast_ref::<bool>() {
                        drone_entity.charging_at_resource = *charging_at_resource;
                    }
                },
                "last_charge_tick" => {
                    if let Some(last_charge_tick) = value.downcast_ref::<u32>() {
                        drone_entity.last_charge_tick = *last_charge_tick;
                    }
                },
                _ => panic!("Unknown property '{}'", property_name),
            }

            if should_update_client == true {
                manager::flag_property_as_changed(self.generic_entity.uid, property_name);
            }
        })
    }

    pub fn on_tick(&mut self, tick_number: u32) {
        let parent_harvester = ENTITIES.with(|e| {
            let entities = e.borrow();
            match entities.get(&self.parent_uid) {
                Some(e) => Some(e.clone()),
                None => None
            }
        });

        let parent_harvester = match parent_harvester {
            Some(EntityTypeEnum::Harvester(e)) => e,
            _ => {
                manager::kill_entity(&self.generic_entity.uid);
                return;
            }
        };

        self.update_movement(tick_number, parent_harvester);
    }

    pub fn update_movement(&self, tick_number: u32, parent_harvester: harvester::Harvester) {
        let building_info = buildings::get_building("Harvester");
        let building_info = match &building_info {
            BuildingInfoEnum::Harvester(e) => e,
           _ => unreachable!()
        };
        let tier_index_usize = (self.tier - 1) as usize;

        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);

        let dist_to_target = (self.generic_entity.position.distance_to(&self.target_position) as f32).sqrt();

        match self.harvest_stage {
            HarvestStagesEnum::Idle => {
                if dist_to_target <= 24.0 {
                    let random_space = self.generate_random_space_around_target(parent_harvester.base_building.generic_entity.position, IDLE_RANDOM_RADIUS);
                    self.set_property("target_position", Box::new(random_space));

                    let angle_to_target = self.generic_entity.position.angle_to(&random_space);
                    self.set_property("yaw", Box::new(angle_to_target));
                } else {
                    let angle_to_target = self.generic_entity.position.angle_to(&self.target_position);

                    if self.yaw != angle_to_target {
                        self.set_property("yaw", Box::new(angle_to_target));
                        self.set_velocity_at_yaw(self.speed, Some(angle_to_target));
                    } else {
                        self.set_velocity_at_yaw(self.speed, None);
                    }
                }
            },
            HarvestStagesEnum::Enroute => {
                let target_position = match self.target_resource_uid {
                    Some(uid) => {
                        ENTITIES.with(|e| {
                            let entities = e.borrow();
                            let entity = entities.get(&uid).unwrap();
        
                            match entity {
                                EntityTypeEnum::Resource(e) => e.generic_entity.position.clone(),
                                _ => unreachable!()
                            }
                        })
                    },
                    None => unreachable!()
                };

                let harvest_range = building_info.drone_harvest_range[tier_index_usize] * PIXEL_TO_WORLD as f32;

                if dist_to_target <= harvest_range {
                    self.set_property("harvest_stage", Box::new(HarvestStagesEnum::Collecting));

                    let rand_position = self.generate_random_space_around_target(target_position, harvest_range);
                    self.set_property("target_position", Box::new(rand_position));

                    let angle_to_target = self.generic_entity.position.angle_to(&rand_position);
                    self.set_property("yaw", Box::new(angle_to_target));
                } else {
                    let angle_to_target = self.generic_entity.position.angle_to(&self.target_position);

                    if self.yaw != angle_to_target {
                        self.set_property("yaw", Box::new(angle_to_target));
                        self.set_velocity_at_yaw(self.speed, Some(angle_to_target));
                    } else {
                        self.set_velocity_at_yaw(self.speed, None);
                    }
                }
            },
            HarvestStagesEnum::Collecting => {
                let target_entity = ENTITIES.with(|e| {
                    let entities = e.borrow();
                    let entity = entities.get(&self.target_resource_uid.unwrap()).unwrap();

                    let EntityTypeEnum::Resource(entity) = entity else {
                        unreachable!()
                    };

                    entity.clone()
                });

                let dist_to_resource = (self.generic_entity.position.distance_to(&target_entity.generic_entity.position) as f32).sqrt();

                let harvest_range = building_info.drone_harvest_range[tier_index_usize] * PIXEL_TO_WORLD as f32;

                let charge_frequency_ticks = (building_info.drone_charge_frequency_ms[tier_index_usize] / tick_rate) as u32;

                if tick_number - self.last_charge_tick > charge_frequency_ticks {
                    // If the drone is too close to the resource to charge, keep going straight until it's far enough away
                    if dist_to_resource < harvest_range {
                        self.set_property("should_maintain_velocity", Box::new(true));

                        self.set_velocity_at_yaw(self.speed * 3 / 4, None);
                        return;
                    } else {
                        self.set_property("last_charge_tick", Box::new(tick_number));
                        self.set_property("charging_at_resource", Box::new(true));
                        self.set_property("should_maintain_velocity", Box::new(false));

                        self.set_property("target_position", Box::new(target_entity.generic_entity.position));

                        let angle_to_target = self.generic_entity.position.angle_to(&target_entity.generic_entity.position);
                        self.set_property("yaw", Box::new(angle_to_target));

                        self.set_velocity_at_yaw(self.speed * 3 / 4, Some(angle_to_target));
                        return;
                    }
                }

                if self.should_maintain_velocity == true {
                    self.set_velocity_at_yaw(self.speed * 3 / 4, None);
                    return;
                }

                // If the drone is charging, charge at the resource until it's close enough to "hit" it,
                // then update the resource's hit animation and take resources
                if self.charging_at_resource == true {
                    if dist_to_resource <= 24.0 {
                        self.set_property("charging_at_resource", Box::new(false));

                        target_entity.add_hit(&(tick_number, self.yaw));

                        let collected_resources = building_info.drone_harvest_amount[tier_index_usize] as f32;

                        let mut total_resources: f32 = 0.0;

                        match target_entity.resource_type.as_str() {
                            "Tree" => {
                                total_resources = self.wood + collected_resources + self.stone;
                                self.set_property("wood", Box::new(self.wood + collected_resources));
                            },
                            "Stone" => {
                                total_resources = self.stone + collected_resources + self.wood;
                                self.set_property("stone", Box::new(self.stone + collected_resources));},
                            _ => {}
                        }

                        if total_resources >= building_info.drone_max_capacity[tier_index_usize] {
                            self.set_property("harvest_stage", Box::new(HarvestStagesEnum::Returning));

                            // The drone targets a random space in a circle below the harvester
                            let mut target_pos = parent_harvester.base_building.generic_entity.position.clone();

                            match parent_harvester.base_building.yaw {
                                0 => {
                                    target_pos.y += (48.0 * 2.5) as i16;
                                },
                                90 => {
                                    target_pos.x -= (48.0 * 2.5) as i16;
                                },
                                180 => {
                                    target_pos.y -= (48.0 * 2.5) as i16;
                                },
                                270 => {
                                    target_pos.x += (48.0 * 2.5) as i16;
                                },
                                _ => unreachable!(),
                            }

                            let target_pos = self.generate_random_space_around_target(target_pos, 48.0);

                            self.set_property("target_position", Box::new(target_pos));

                            let angle_to_target = self.generic_entity.position.angle_to(&target_pos);
                            self.set_property("yaw", Box::new(angle_to_target));
    
                            self.set_velocity_at_yaw(self.speed, Some(angle_to_target));
                        }
                    } else {
                        let mut yaw = self.yaw;

                        let angle_to_target = self.generic_entity.position.angle_to(&self.target_position);

                        if self.yaw != angle_to_target {
                            yaw = angle_to_target;
                            self.set_property("yaw", Box::new(angle_to_target));
                        }

                        self.set_velocity_at_yaw(self.speed * 2, Some(yaw));
                    }
                }

                if self.charging_at_resource == false {
                    let dist_to_target = (self.generic_entity.position.distance_to(&self.target_position) as f32).sqrt();

                    let mut yaw = self.yaw;

                    if dist_to_target <= 24.0 {
                        let rand_position = self.generate_random_space_around_target(target_entity.generic_entity.position, harvest_range);
                        self.set_property("target_position", Box::new(rand_position));
    
                        let angle_to_target = self.generic_entity.position.angle_to(&rand_position);
                        self.set_property("yaw", Box::new(angle_to_target));

                        yaw = angle_to_target;
                    } else {
                        let angle_to_target = self.generic_entity.position.angle_to(&self.target_position);

                        if self.yaw != angle_to_target {
                            self.set_property("yaw", Box::new(angle_to_target));
                        }
                    }

                    self.set_velocity_at_yaw(self.speed * 3 / 4, Some(yaw));

                    return;
                }
            },
            HarvestStagesEnum::Returning => {
                if dist_to_target <= 24.0 {
                    let target_position = match self.target_resource_uid {
                        Some(uid) => {
                            ENTITIES.with(|e| {
                                let entities = e.borrow();
                                let entity = entities.get(&uid).unwrap();
            
                                match entity {
                                    EntityTypeEnum::Resource(e) => e.generic_entity.position.clone(),
                                    _ => unreachable!()
                                }
                            })
                        },
                        None => {
                            self.set_property("harvest_stage", Box::new(HarvestStagesEnum::Idle));
                            return;
                        }
                    };
    
                    self.set_property("harvest_stage", Box::new(HarvestStagesEnum::Enroute));
                    self.set_property("target_position", Box::new(target_position));

                    let angle_to_target = self.generic_entity.position.angle_to(&target_position);
                    self.set_property("yaw", Box::new(angle_to_target));

                    self.set_property("wood", Box::new(0.0f32));
                    self.set_property("stone", Box::new(0.0f32));

                    if self.wood > 0.0 {
                        self.create_resource_pickup(tick_number, ResourcePickupTypeEnum::Wood, self.wood);
                    }

                    if self.stone > 0.0 {
                        self.create_resource_pickup(tick_number, ResourcePickupTypeEnum::Stone, self.stone);
                    }
                } else {
                    let mut yaw = self.yaw;

                    let angle_to_target = self.generic_entity.position.angle_to(&self.target_position);

                    if self.yaw != angle_to_target {
                        yaw = angle_to_target;
                        self.set_property("yaw", Box::new(angle_to_target));
                    }

                    self.set_velocity_at_yaw(self.speed, Some(yaw));
                }
            }
        }
    }

    fn set_velocity_at_yaw(&self, speed: u8, yaw: Option<u16>) {
        let yaw_f32 = match yaw {
            Some(yaw) => yaw as f32,
            None => self.yaw as f32
        };

        let speed = speed as f32;

        let x_impulse = (yaw_f32 * PI / 180.0).sin() * speed;
        let y_impulse = (yaw_f32 * PI / 180.0).cos() * speed;

        let impulse = vector![
            x_impulse,
            -y_impulse
        ];

        physics::set_velocity_of_body(&self.generic_entity.uid, impulse, true);
    }

    pub fn create_resource_pickup(&self, tick_number: u32, resource_type: ResourcePickupTypeEnum, resource_amount: f32) {
        let building_info = buildings::get_building("Harvester");
        let building_info = match &building_info {
            BuildingInfoEnum::Harvester(e) => e,
           _ => unreachable!()
        };

        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);

        let pickup_entity = manager::create_entity(AllEntityTypesEnum::ResourcePickup, None, self.generic_entity.position.clone(), 0, Some(|entity: EntityTypeEnum| {
            let mut resource_pickup = match entity {
                EntityTypeEnum::ResourcePickup(entity) => entity,
                _ => unreachable!()
            };

            resource_pickup.creation_tick = tick_number;
            resource_pickup.death_tick = tick_number + (building_info.resource_pickup_lifetime_ms / tick_rate) as u32;
            resource_pickup.resource_pickup_type = resource_type;
            resource_pickup.resource_amount = resource_amount;
            resource_pickup.radius = building_info.resource_pickup_player_pickup_range as f32;
            resource_pickup.yaw = self.yaw;

            EntityTypeEnum::ResourcePickup(resource_pickup)
        })).unwrap();

        let EntityTypeEnum::ResourcePickup(pickup_entity) = pickup_entity else {
            unreachable!();
        };

        pickup_entity.initialise_physics(tick_number);
    }

    pub fn update_target(&self, target_uid: Option<u16>) {
        self.set_property("target_resource_uid", Box::new(target_uid));

        match &self.harvest_stage {
            HarvestStagesEnum::Idle => {
                let target_position = match target_uid {
                    Some(uid) => {
                        ENTITIES.with(|e| {
                            let entities = e.borrow();
                            let entity = entities.get(&uid).unwrap();
        
                            match entity {
                                EntityTypeEnum::Resource(e) => e.generic_entity.position.clone(),
                                _ => unreachable!()
                            }
                        })
                    },
                    None => unreachable!()
                };

                self.set_property("harvest_stage", Box::new(HarvestStagesEnum::Enroute));
                self.set_property("target_position", Box::new(target_position));
            }
            HarvestStagesEnum::Enroute => {
                let target_position = match target_uid {
                    Some(uid) => {
                        ENTITIES.with(|e| {
                            let entities = e.borrow();
                            let entity = entities.get(&uid).unwrap();
        
                            match entity {
                                EntityTypeEnum::Resource(e) => e.generic_entity.position.clone(),
                                _ => unreachable!()
                            }
                        })
                    },
                    None => {
                        self.set_property("harvest_stage", Box::new(HarvestStagesEnum::Idle));

                        ENTITIES.with(|e| {
                            let entities = e.borrow();
                            let entity = entities.get(&self.parent_uid).unwrap();
        
                            match entity {
                                EntityTypeEnum::Harvester(e) => e.base_building.generic_entity.position.clone(),
                                _ => unreachable!()
                            }
                        })
                    }
                };

                self.set_property("target_position", Box::new(target_position));
            }
            HarvestStagesEnum::Collecting => {
                let target_position = match target_uid {
                    Some(uid) => {
                        self.set_property("harvest_stage", Box::new(HarvestStagesEnum::Enroute));

                        ENTITIES.with(|e| {
                            let entities = e.borrow();
                            let entity = entities.get(&uid).unwrap();
        
                            match entity {
                                EntityTypeEnum::Resource(e) => e.generic_entity.position.clone(),
                                _ => unreachable!()
                            }
                        })
                    },
                    None => {
                        self.set_property("harvest_stage", Box::new(HarvestStagesEnum::Idle));

                        ENTITIES.with(|e| {
                            let entities = e.borrow();
                            let entity = entities.get(&self.parent_uid).unwrap();
        
                            match entity {
                                EntityTypeEnum::Harvester(e) => e.base_building.generic_entity.position.clone(),
                                _ => unreachable!()
                            }
                        })
                    }
                };

                self.set_property("target_position", Box::new(target_position));
            }
            HarvestStagesEnum::Returning => {

            }
        }
    }
}

impl generic_entity::EntityTrait for HarvesterDrone {
    fn on_die(&self) {
        self.generic_entity.on_die();
    }
}