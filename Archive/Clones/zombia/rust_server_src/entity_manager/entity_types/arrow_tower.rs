use super::building::{AttackingBuilding, AttackingBuildingTrait, Building, BuildingTrait};
use super::generic_entity::{EntityTrait, Position};
use super::projectile::ProjectileTypeEnum;
use std::any::Any;
use crate::entity_manager::manager::ENTITIES;
use crate::info::buildings::{self, BuildingInfoEnum};
use crate::{manager, CONFIG};
use crate::entity_manager::entity_types::{AllEntityTypesEnum, EntityTypeEnum};
use rapier2d::prelude::*;
use std::f32::consts::PI;

#[derive(Clone, Debug)]
pub struct ArrowTower {
    pub ranged_building: AttackingBuilding
}

impl BuildingTrait for ArrowTower {
    fn new(uid: u16, position: super::generic_entity::Position, rotation: u16) -> Self {
        let mut entity = ArrowTower {
            ranged_building: AttackingBuilding {
                aiming_yaw: 0,
                firing_tick: 0,
                range_cells: Vec::new(),
                base_building: Building::new(uid, position, rotation, "ArrowTower".to_owned()),
                rapidfire_buffed: false
            }
        };

        entity.ranged_building.range_cells = entity.update_range_cells().unwrap();

        return entity;
    }

    fn upgrade(&self, tick_number: u32) {
        self.ranged_building.base_building.upgrade(tick_number);
        self.update_range_cells();
    }

    fn on_tick(&mut self, tick_number: u32) {
        self.ranged_building.base_building.on_tick(tick_number);

        let building_info = buildings::get_building(&self.ranged_building.base_building.generic_entity.model);
        let building_info = match &building_info {
            BuildingInfoEnum::Ranged(e) => e,
           _ => unreachable!()
        };
        let tier_index_usize = (self.ranged_building.base_building.tier - 1) as usize;
        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);

        let mut firing_rate = building_info.ms_between_fires[tier_index_usize];

        if self.ranged_building.rapidfire_buffed == true {
            firing_rate /= 2;
            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let entity = entities.get_mut(&self.ranged_building.base_building.generic_entity.uid).unwrap();
    
                let EntityTypeEnum::ArrowTower(entity) = entity else {
                    unreachable!()
                };

                entity.set_buffed(false);
            })
        }

        let firing_rate_ticks = firing_rate / tick_rate as u32;

        if self.ranged_building.firing_tick + firing_rate_ticks <= tick_number {
            let closest_enemy_uid = self.get_closest_enemy(tick_number);

            if closest_enemy_uid.is_none() {
                return;
            }

            self.set_property("firing_tick", Box::new(tick_number));
            self.fire_ranged(closest_enemy_uid.unwrap());
        };
    }

    fn take_damage(&self, damage: u16, entity: &EntityTypeEnum) -> u16 {
        self.ranged_building.base_building.take_damage(damage, entity)
    }

    fn die(&mut self) {
        self.ranged_building.base_building.die();
    }

    fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        self.ranged_building.base_building.set_property(property_name, value);
    }
}

impl AttackingBuildingTrait for ArrowTower {
    fn update_range_cells(&self) -> Option<Vec<Option<Position>>> {
        let range_cells = self.ranged_building.update_range_cells().unwrap();

        self.set_property("range_cells", Box::new(range_cells.clone()));

        Some(range_cells)
    }

    fn get_closest_enemy(&mut self, tick_number: u32) -> Option<u16> {
        self.ranged_building.get_closest_enemy(tick_number)
    }

    fn fire_ranged(&self, enemy_uid: u16) {
        let entity = manager::get_entity(enemy_uid).unwrap();

        let angle = self.ranged_building.base_building.generic_entity.position.angle_to(&entity.generic_entity().position);

        let (tick_rate, tick_number) = CONFIG.with(|c| {
            let config = c.borrow();

            (config.tick_rate, config.tick_number)
        });

        let building_info = buildings::get_building("ArrowTower");

        let building_info = match &building_info {
            BuildingInfoEnum::Ranged(e) => e,
           _ => unreachable!()
        };

        let tier_index_usize = (self.ranged_building.base_building.tier - 1) as usize;

        self.set_property("aiming_yaw", Box::new(angle));

        let this_position = self.ranged_building.base_building.generic_entity.position.clone();

        let projectile_lifetime = building_info.projectile_lifetime[tier_index_usize];
        let projectile_lifetime_ticks = (projectile_lifetime / tick_rate) as u32;

        let projectile_speed = building_info.projectile_speed[tier_index_usize] as f32;

        let projectile_velocity= vector![
            (angle as f32 * PI / 180.0).sin() * projectile_speed,
            -(angle as f32 * PI / 180.0).cos() * projectile_speed
        ];

        manager::create_entity(AllEntityTypesEnum::Projectile, None, this_position, angle, Some(|entity: EntityTypeEnum| {
            let mut projectile = match entity {
                EntityTypeEnum::Projectile(entity) => entity,
                _ => unreachable!()
            };

            projectile.generic_entity.model = "ArrowProjectile".to_owned();
            projectile.projectile_type = ProjectileTypeEnum::CannonTower;
            projectile.death_tick = tick_number + projectile_lifetime_ticks;
            projectile.velocity = projectile_velocity;
            projectile.tier = self.ranged_building.base_building.tier;
            projectile.party_id = self.ranged_building.base_building.party_id;
            projectile.damage_to_players = building_info.damage_to_players[tier_index_usize];
            projectile.damage_to_zombies = building_info.damage_to_zombies[tier_index_usize];
            projectile.damage_to_buildings = 0;
            projectile.knockback_distance = building_info.projectile_entity_knockback[tier_index_usize];
            projectile.parent_uid = self.ranged_building.base_building.generic_entity.uid;

            projectile.initialise_physics(tick_number);

            EntityTypeEnum::Projectile(projectile)
        }));
    
    }

    fn set_buffed(&mut self, buffed: bool) {
        self.ranged_building.set_buffed(buffed);
    }
}

impl EntityTrait for ArrowTower {
    fn on_die(&self) {
        self.ranged_building.base_building.on_die();
    }
}