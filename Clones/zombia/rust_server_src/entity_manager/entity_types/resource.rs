use super::generic_entity::{self, Position};
use rapier2d::prelude::*;
use crate::physics;
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::manager;

type Hit = (u32, u16);

#[derive(Clone, Debug)]
pub struct Resource {
    pub aiming_yaw: u16,
    pub generic_entity: generic_entity::GenericEntity,
    pub hits: Vec<Hit>,
    pub resource_type: String,
    pub resource_variant: u8,
    pub radius: f32
}

impl Resource {
    pub fn add_hit(&self, hit: &(u32, u16)) {
        manager::with_entity(self.generic_entity.uid, |entity| {
            let EntityTypeEnum::Resource(resource_entity) = entity else {
                panic!("Expected a Resource entity, but got a different type");
            };

            resource_entity.hits.push(*hit);

            manager::flag_property_as_changed(self.generic_entity.uid, "hits");
        })
    }

    pub fn new(uid: u16, position: Position, rotation: u16) -> Self {
        let resource_instance = Resource {
            aiming_yaw: rotation,
            generic_entity: generic_entity::GenericEntity::new(uid, "Resource".to_owned(), position),
            hits: Vec::new(),
            resource_type: "Tree".to_string(),
            resource_variant: 1,
            radius: 68.0
        };

        let collision_group = InteractionGroups::new(
            Group::GROUP_1,
            Group::GROUP_2 | Group::GROUP_3 | Group::GROUP_4
        );

        physics::create_rigid_body(&resource_instance.generic_entity.uid, physics::RigidBodyType::Fixed,  &position, 0, physics::ColliderShapes::Ball { radius: resource_instance.radius }, collision_group, None, None);

        return resource_instance;
    }
}