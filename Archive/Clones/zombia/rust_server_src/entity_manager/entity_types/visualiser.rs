use super::generic_entity::{self, Position};
use rapier2d::prelude::*;
use crate::physics;

#[derive(Clone, Debug)]
pub struct Visualiser {
    pub generic_entity: generic_entity::GenericEntity,
    pub yaw: u16
}

impl Visualiser {
    pub fn new(uid: u16, position: Position, rotation: u16) -> Self {
        let visualiser_instance = Visualiser {
            generic_entity: generic_entity::GenericEntity::new(uid, "Visualiser".to_owned(), position),
            yaw: rotation
        };

        let collision_group = InteractionGroups::new(
            Group::ALL,
            Group::NONE
        );

        physics::create_rigid_body(&visualiser_instance.generic_entity.uid, physics::RigidBodyType::Fixed,  &position, 0, physics::ColliderShapes::Ball { radius: 0.0 }, collision_group, None, None);

        return visualiser_instance;
    }
}