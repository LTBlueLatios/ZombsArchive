use super::building::{Building, BuildingTrait};
use super::generic_entity::{EntityTrait, Position};
use super::harvester_drone::HarvestStagesEnum;
use std::any::Any;
use crate::entity_manager::manager::ENTITIES;
use crate::info::buildings::{self, BuildingInfoEnum};
use crate::{manager, GameModes, CONFIG};
use crate::entity_manager::entity_types::{AllEntityTypesEnum, EntityTypeEnum};

#[derive(Clone, Debug)]
pub struct Harvester {
    pub base_building: Building,
    pub drone_count: u8,
    pub target_resource_uid: Option<u16>,
    pub drone_uids: Vec<u16>,
    pub spawn_drones_tick: u32
}

impl Harvester {
    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.base_building.generic_entity.uid, |entity| {
            let EntityTypeEnum::Harvester(entity) = entity else {
                unreachable!()
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
                "drone_uids" => {
                    if let Ok(drone_uids) = value.downcast::<Vec<u16>> () {
                        entity.drone_uids = *drone_uids;
                    }
                },
                "drone_count" => {
                    if let Some(drone_count) = value.downcast_ref::<u8>() {
                        entity.drone_count = *drone_count;
                    }
                },
                "target_resource_uid" => {
                    if let Some(target_resource_uid) = value.downcast_ref::<Option<u16>>() {
                        entity.target_resource_uid = *target_resource_uid;

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

    pub fn spawn_drone(&self) {
        let building_info = buildings::get_building(&self.base_building.generic_entity.model);
        let building_info = match &building_info {
            BuildingInfoEnum::Harvester(e) => e,
           _ => unreachable!()
        };
        let tier_index_usize = (self.base_building.tier - 1) as usize;

        let drone_entity = manager::create_entity(AllEntityTypesEnum::HarvesterDrone, None, self.base_building.generic_entity.position, 0, Some(|entity: EntityTypeEnum| {
            let mut drone_entity = match entity {
                EntityTypeEnum::HarvesterDrone(entity) => entity,
                _ => unreachable!()
            };

            drone_entity.parent_uid = self.base_building.generic_entity.uid;
            drone_entity.target_resource_uid = self.target_resource_uid;

            match self.target_resource_uid {
                Some(target_uid) => {
                    drone_entity.harvest_stage = HarvestStagesEnum::Enroute;

                    let resource_pos = ENTITIES.with(|e| {
                        let entities = e.borrow();
                        entities.get(&target_uid).unwrap().generic_entity().position.clone()
                    });

                    drone_entity.target_position = resource_pos;
                },
                None => {
                    drone_entity.harvest_stage = HarvestStagesEnum::Idle
                }
            }

            drone_entity.tier = self.base_building.tier;
            drone_entity.speed = building_info.drone_speed[tier_index_usize];

            EntityTypeEnum::HarvesterDrone(drone_entity)
        })).unwrap();

        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let self_entity = entities.get_mut(&self.base_building.generic_entity.uid).unwrap();

            let EntityTypeEnum::Harvester(harvester_entity) = self_entity else {
                unreachable!()
            };

            harvester_entity.drone_uids.push(drone_entity.generic_entity().uid);
            harvester_entity.drone_count -= 1;
        });
    }

    pub fn update_target(&self, target_uid: Option<u16>) {
        self.set_property("target_resource_uid", Box::new(target_uid));

        for drone_uid in self.drone_uids.iter() {
            let drone_entity = ENTITIES.with(|e| {
                let entities = e.borrow();
                let entity = entities.get(drone_uid).unwrap();

                match entity {
                    EntityTypeEnum::HarvesterDrone(e) => e.clone(),
                    _ => unreachable!()
                }
            });

            drone_entity.update_target(target_uid);
        }
    }
}

impl BuildingTrait for Harvester {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let mut entity = Harvester {
            drone_count: 0,
            target_resource_uid: None,
            drone_uids: Vec::new(),
            base_building: Building::new(uid, position, rotation, "Harvester".to_owned()),
            spawn_drones_tick: 0
        };

        let tick_number = CONFIG.with(|c| c.borrow().tick_number);

        entity.spawn_drones_tick = tick_number + 1;

        return entity;
    }

    fn upgrade(&self, tick_number: u32) {
        self.base_building.upgrade(tick_number);

        let tier = self.base_building.tier + 1;

        for drone_uid in self.drone_uids.iter() {
            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let entity = entities.get_mut(drone_uid).unwrap();
                let EntityTypeEnum::HarvesterDrone(drone_entity) = entity else {
                    unreachable!()
                };

                drone_entity.tier = tier;
                manager::flag_property_as_changed(*drone_uid, "tier");
            })
        }
    }

    fn on_tick(&mut self, tick_number: u32) {
        self.base_building.on_tick(tick_number);

        if tick_number == self.spawn_drones_tick {
            let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

            if matches!(game_mode, GameModes::Scarcity) == false {
                let building_info = buildings::get_building(&self.base_building.generic_entity.model);
                let building_info = match &building_info {
                    BuildingInfoEnum::Harvester(e) => e,
                   _ => unreachable!()
                };
                let tier_index_usize = (self.base_building.tier - 1) as usize;

                if self.drone_count < building_info.max_drone_count[tier_index_usize] {
                    for _ in 0..1 {
                        self.spawn_drone();
                    }
                }
            }
        }
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

impl EntityTrait for Harvester {
    fn on_die(&self) {
        self.base_building.on_die();

        for i in self.drone_uids.iter() {
            manager::kill_entity(i);
        }
    }
}