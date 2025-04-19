use std::cell::RefCell;
use std::collections::{HashMap, HashSet};

use crate::entity_manager::entity_types;

use super::entity_types::generic_entity::EntityTrait;
use super::entity_types::{AllEntityTypesEnum, EntityTypeEnum};
use crate::entity_manager::entity_types::generic_entity::Position;

use super::entity_types::building::BuildingTrait;

use crate::physics;

thread_local! {
    pub static ENTITIES: RefCell<HashMap<u16, entity_types::EntityTypeEnum>> = RefCell::new(HashMap::new());
    pub static MODIFIED_PROPERTIES: RefCell<HashMap<u16, HashSet<String>>> = RefCell::new(HashMap::new());
    pub static AVAILABLE_UIDS: RefCell<Vec<u16>> = RefCell::new(Vec::new());
    pub static UIDS_TO_BE_RECYCLED: RefCell<Vec<u16>> = RefCell::new(Vec::new());
    pub static UID_COUNTER: RefCell<u16> = RefCell::new(0);
    pub static TENTATIVE_BUILDING_POSITIONS: RefCell<Vec<(Position, f32, f32)>> = RefCell::new(Vec::new());
    pub static DEAD_ENTITY_UIDS: RefCell<HashSet<u16>> = RefCell::new(HashSet::new());
}

pub fn flag_property_as_changed(uid: u16, property_name: &str) {
    MODIFIED_PROPERTIES.with(|modified_properties| {
        let mut modified_properties = modified_properties.borrow_mut();

        modified_properties.entry(uid).or_insert_with(HashSet::new);

        let entity_properties = modified_properties.get_mut(&uid).unwrap();

        entity_properties.insert(property_name.to_owned());
    });
}

pub fn generate_uid() -> u16 {
    if let Some(uid) = AVAILABLE_UIDS.with(|available_uids| {
        let mut available_uids = available_uids.borrow_mut();

        if available_uids.len() > 0 {
            Some(available_uids.remove(0))
        } else {
            None
        }
    }) {
        return uid;
    }

    UID_COUNTER.with(|uid_counter| {
        let mut uid_counter = uid_counter.borrow_mut();
        *uid_counter += 1;

        return *uid_counter;
    })
}

pub fn get_entity(uid: u16) -> Option<entity_types::EntityTypeEnum> {
    ENTITIES.with(|entities| {
        let entities = entities.borrow();
        entities.get(&uid).cloned()
    })
}

pub fn with_entity<F>(uid: u16, func: F)
where
    F: FnOnce(&mut EntityTypeEnum),
{
    ENTITIES.with(|entities| {
        let mut entities = entities.borrow_mut();

        if let Some(entity) = entities.get_mut(&uid) {
            func(entity);
        }
    });
}

pub fn create_entity<F>(
    entity_model_name: AllEntityTypesEnum,
    uid_override: Option<u16>,
    position: Position,
    rotation: u16,
    overrides: Option<F>,
) -> Option<entity_types::EntityTypeEnum>
where
    F: FnOnce(EntityTypeEnum) -> EntityTypeEnum,
{
    let uid: u16 = uid_override.unwrap_or_else(generate_uid);

    let entity = match entity_model_name {
        AllEntityTypesEnum::Player => {
            EntityTypeEnum::Player(entity_types::Player::new(uid, position))
        }
        AllEntityTypesEnum::Resource => {
            EntityTypeEnum::Resource(entity_types::Resource::new(uid, position, rotation))
        }
        AllEntityTypesEnum::Factory => {
            EntityTypeEnum::Factory(entity_types::Factory::new(uid, position, rotation))
        }
        AllEntityTypesEnum::ArrowTower => {
            EntityTypeEnum::ArrowTower(entity_types::ArrowTower::new(uid, position, rotation))
        }
        AllEntityTypesEnum::CannonTower => {
            EntityTypeEnum::CannonTower(entity_types::CannonTower::new(uid, position, rotation))
        }
        AllEntityTypesEnum::MageTower => {
            EntityTypeEnum::MageTower(entity_types::MageTower::new(uid, position, rotation))
        }
        AllEntityTypesEnum::RocketTower => {
            EntityTypeEnum::RocketTower(entity_types::RocketTower::new(uid, position, rotation))
        }
        AllEntityTypesEnum::LightningTower => EntityTypeEnum::LightningTower(
            entity_types::LightningTower::new(uid, position, rotation),
        ),
        AllEntityTypesEnum::SawTower => {
            EntityTypeEnum::SawTower(entity_types::SawTower::new(uid, position, rotation))
        }
        AllEntityTypesEnum::Wall => {
            EntityTypeEnum::Wall(entity_types::Wall::new(uid, position, rotation))
        }
        AllEntityTypesEnum::LargeWall => {
            EntityTypeEnum::LargeWall(entity_types::LargeWall::new(uid, position, rotation))
        }
        AllEntityTypesEnum::SpikeTrap => {
            EntityTypeEnum::SpikeTrap(entity_types::SpikeTrap::new(uid, position, rotation))
        }
        AllEntityTypesEnum::Door => {
            EntityTypeEnum::Door(entity_types::Door::new(uid, position, rotation))
        }
        AllEntityTypesEnum::Drill => {
            EntityTypeEnum::Drill(entity_types::Drill::new(uid, position, rotation))
        }
        AllEntityTypesEnum::Harvester => {
            EntityTypeEnum::Harvester(entity_types::Harvester::new(uid, position, rotation))
        }
        AllEntityTypesEnum::Projectile => {
            EntityTypeEnum::Projectile(entity_types::Projectile::new(uid, position, rotation))
        }
        AllEntityTypesEnum::HarvesterDrone => EntityTypeEnum::HarvesterDrone(
            entity_types::HarvesterDrone::new(uid, position, rotation),
        ),
        AllEntityTypesEnum::ResourcePickup => {
            EntityTypeEnum::ResourcePickup(entity_types::ResourcePickup::new(uid, position))
        }
        AllEntityTypesEnum::Zombie => {
            EntityTypeEnum::Zombie(entity_types::Zombie::new(uid, position, rotation))
        }
        AllEntityTypesEnum::SpellIndicator => {
            EntityTypeEnum::SpellIndicator(entity_types::SpellIndicator::new(uid, position))
        }
        AllEntityTypesEnum::_Visualiser => {
            EntityTypeEnum::Visualiser(entity_types::Visualiser::new(uid, position, rotation))
        }
    };

    let overwritten_entity = if let Some(overrider) = overrides {
        overrider(entity)
    } else {
        entity
    };

    ENTITIES.with(|entities| {
        let mut entities = entities.borrow_mut();

        entities.insert(uid, overwritten_entity);

        entities.get(&uid).cloned()
    })
}

pub fn remove_entity(uid: &u16) {
    ENTITIES.with(|entities| {
        let mut entities = entities.borrow_mut();

        if !entities.contains_key(&uid) {
            panic!("Attempted to remove entity that doesn't exist!");
        }

        UIDS_TO_BE_RECYCLED.with(|e| {
            let mut uids_to_be_recycled = e.borrow_mut();

            uids_to_be_recycled.push(*uid);
        });

        MODIFIED_PROPERTIES.with(|modified_properties| {
            let mut modified_properties = modified_properties.borrow_mut();

            modified_properties.remove(uid);
        });

        physics::remove_rigid_body(*uid);

        entities.remove(&uid);
    });
}

pub fn queue_kill_entity(uid: u16) {
    DEAD_ENTITY_UIDS.with(|f| {
        let mut dead_entity_uids = f.borrow_mut();

        dead_entity_uids.insert(uid);
    });
}

pub fn kill_entity(uid: &u16) {
    let entity = ENTITIES.with(|entities| {
        let entities = entities.borrow();

        match entities.get(&uid) {
            Some(e) => e.clone(),
            None => panic!("Tried to kill entity that doesn't exist")
        }
    });

    match entity {
        EntityTypeEnum::Player(entity) => entity.on_die(),
        EntityTypeEnum::ArrowTower(entity) => entity.on_die(),
        EntityTypeEnum::Factory(entity) => entity.on_die(),
        EntityTypeEnum::CannonTower(entity) => entity.on_die(),
        EntityTypeEnum::MageTower(entity) => entity.on_die(),
        EntityTypeEnum::RocketTower(entity) => entity.on_die(),
        EntityTypeEnum::LightningTower(entity) => entity.on_die(),
        EntityTypeEnum::SawTower(entity) => entity.on_die(),
        EntityTypeEnum::Wall(entity) => entity.on_die(),
        EntityTypeEnum::LargeWall(entity) => entity.on_die(),
        EntityTypeEnum::SpikeTrap(entity) => entity.on_die(),
        EntityTypeEnum::Door(entity) => entity.on_die(),
        EntityTypeEnum::Drill(entity) => entity.on_die(),
        EntityTypeEnum::Harvester(entity) => entity.on_die(),
        EntityTypeEnum::Projectile(entity) => entity.on_die(),
        EntityTypeEnum::ResourcePickup(entity) => entity.on_die(),
        EntityTypeEnum::HarvesterDrone(entity) => entity.on_die(),
        EntityTypeEnum::Resource(_) => {}
        EntityTypeEnum::Zombie(entity) => entity.on_die(),
        EntityTypeEnum::SpellIndicator(_) => {},
        EntityTypeEnum::Visualiser(_) => {}
    }

    remove_entity(uid);
}
