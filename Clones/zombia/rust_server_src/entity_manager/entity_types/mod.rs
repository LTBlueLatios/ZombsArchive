pub mod generic_entity;

pub mod player;
use generic_entity::EntityTrait;
pub use player::Player;

pub mod resource;
pub use resource::Resource;

pub mod building;
use building::BuildingTrait;

pub mod arrow_tower;
pub use arrow_tower::ArrowTower;

pub mod cannon_tower;
pub use cannon_tower::CannonTower;

pub mod mage_tower;
pub use mage_tower::MageTower;

pub mod rocket_tower;
pub use rocket_tower::RocketTower;

pub mod lightning_tower;
pub use lightning_tower::LightningTower;

pub mod saw_tower;
pub use saw_tower::SawTower;

pub mod factory;
pub use factory::Factory;

pub mod wall;
pub use wall::Wall;

pub mod large_wall;
pub use large_wall::LargeWall;

pub mod door;
pub use door::Door;

pub mod spike_trap;
pub use spike_trap::SpikeTrap;

pub mod drill;
pub use drill::Drill;

pub mod harvester;
pub use harvester::Harvester;

pub mod harvester_drone;
pub use harvester_drone::HarvesterDrone;

pub mod projectile;
pub use projectile::Projectile;

pub mod resource_pickup;
pub use resource_pickup::ResourcePickup;

pub mod zombie;
pub use zombie::Zombie;

pub mod spell_indicator;
pub use spell_indicator::SpellIndicator;

pub mod visualiser;
pub use visualiser::Visualiser;

use rand::prelude::*;

use std::any::Any;

use crate::{WORLD_HEIGHT, WORLD_WIDTH};

#[derive(Clone, Debug)]
pub enum EntityTypeEnum {
    Player(Player),
    Resource(Resource),
    Factory(Factory),
    ArrowTower(ArrowTower),
    CannonTower(CannonTower),
    MageTower(MageTower),
    RocketTower(RocketTower),
    LightningTower(LightningTower),
    SawTower(SawTower),
    Wall(Wall),
    LargeWall(LargeWall),
    SpikeTrap(SpikeTrap),
    Door(Door),
    Drill(Drill),
    Harvester(Harvester),
    HarvesterDrone(HarvesterDrone),
    Projectile(Projectile),
    ResourcePickup(ResourcePickup),
    Zombie(Zombie),
    SpellIndicator(SpellIndicator),
    Visualiser(Visualiser)
}

#[derive(Clone, Debug)]
pub enum AllEntityTypesEnum {
    Player,
    Resource,
    Factory,
    ArrowTower,
    CannonTower,
    MageTower,
    RocketTower,
    LightningTower,
    SawTower,
    Wall,
    LargeWall,
    SpikeTrap,
    Door,
    Drill,
    Harvester,
    HarvesterDrone,
    Projectile,
    ResourcePickup,
    Zombie,
    SpellIndicator,
    _Visualiser
}

impl EntityTypeEnum {
    pub fn generic_entity(&self) -> &generic_entity::GenericEntity {
        match self {
            EntityTypeEnum::Player(entity) => &entity.generic_entity,
            EntityTypeEnum::Resource(entity) => &entity.generic_entity,
            EntityTypeEnum::Factory(entity) => &entity.base_building.generic_entity,
            EntityTypeEnum::ArrowTower(entity) => {
                &entity.ranged_building.base_building.generic_entity
            }
            EntityTypeEnum::CannonTower(entity) => {
                &entity.ranged_building.base_building.generic_entity
            }
            EntityTypeEnum::MageTower(entity) => {
                &entity.ranged_building.base_building.generic_entity
            }
            EntityTypeEnum::RocketTower(entity) => {
                &entity.ranged_building.base_building.generic_entity
            }
            EntityTypeEnum::LightningTower(entity) => {
                &entity.ranged_building.base_building.generic_entity
            }
            EntityTypeEnum::SawTower(entity) => {
                &entity.ranged_building.base_building.generic_entity
            }
            EntityTypeEnum::Wall(entity) => &entity.base_building.generic_entity,
            EntityTypeEnum::LargeWall(entity) => &entity.base_building.generic_entity,
            EntityTypeEnum::SpikeTrap(entity) => &entity.base_building.generic_entity,
            EntityTypeEnum::Door(entity) => &entity.base_building.generic_entity,
            EntityTypeEnum::Drill(entity) => &entity.base_building.generic_entity,
            EntityTypeEnum::Harvester(entity) => &entity.base_building.generic_entity,
            EntityTypeEnum::Projectile(entity) => &entity.generic_entity,
            EntityTypeEnum::ResourcePickup(entity) => &entity.generic_entity,
            EntityTypeEnum::HarvesterDrone(entity) => &entity.generic_entity,
            EntityTypeEnum::Zombie(entity) => &entity.generic_entity,
            EntityTypeEnum::SpellIndicator(entity) => &entity.generic_entity,
            EntityTypeEnum::Visualiser(entity) => &entity.generic_entity,
        }
    }

    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        match self {
            EntityTypeEnum::Player(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::Factory(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::ArrowTower(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::CannonTower(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::MageTower(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::RocketTower(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::LightningTower(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::SawTower(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::Wall(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::LargeWall(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::SpikeTrap(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::Door(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::Drill(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::Harvester(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::Projectile(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::ResourcePickup(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::HarvesterDrone(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::Resource(_entity) => {}
            EntityTypeEnum::Zombie(entity) => entity.set_property(property_name, value),
            EntityTypeEnum::SpellIndicator(_) => {},
            EntityTypeEnum::Visualiser(_) => {},
        }
    }
}

impl EntityTrait for EntityTypeEnum {
    fn on_die(&self) {
        match self {
            EntityTypeEnum::Player(e) => e.on_die(),
            EntityTypeEnum::ArrowTower(e) => e.on_die(),
            EntityTypeEnum::CannonTower(e) => e.on_die(),
            EntityTypeEnum::MageTower(e) => e.on_die(),
            EntityTypeEnum::RocketTower(e) => e.on_die(),
            EntityTypeEnum::LightningTower(e) => e.on_die(),
            EntityTypeEnum::SawTower(e) => e.on_die(),
            EntityTypeEnum::Factory(e) => e.on_die(),
            EntityTypeEnum::Wall(e) => e.on_die(),
            EntityTypeEnum::LargeWall(e) => e.on_die(),
            EntityTypeEnum::SpikeTrap(e) => e.on_die(),
            EntityTypeEnum::Door(e) => e.on_die(),
            EntityTypeEnum::Drill(e) => e.on_die(),
            EntityTypeEnum::Harvester(e) => e.on_die(),
            EntityTypeEnum::Projectile(e) => e.on_die(),
            EntityTypeEnum::ResourcePickup(e) => e.on_die(),
            EntityTypeEnum::HarvesterDrone(e) => e.on_die(),
            EntityTypeEnum::Resource(_) => {},
            EntityTypeEnum::Zombie(e) => e.on_die(),
            EntityTypeEnum::SpellIndicator(_) => {},
            EntityTypeEnum::Visualiser(_) => {},
        }
    }
}

pub fn generate_random_map_position() -> generic_entity::Position {
    generic_entity::Position {
        x: rand::thread_rng().gen_range(0..=WORLD_WIDTH) as i16,
        y: rand::thread_rng().gen_range(0..=WORLD_HEIGHT) as i16,
    }
}
