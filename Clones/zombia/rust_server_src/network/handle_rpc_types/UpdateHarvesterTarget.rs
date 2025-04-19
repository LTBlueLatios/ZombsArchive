use crate::entity_manager::entity_types::{EntityTypeEnum, Player};
use crate::entity_manager::manager;
use crate::info::buildings::{self, BuildingInfoEnum};
use crate::network::decode_rpc_types::UpdateHarvesterTarget::UpdateHarvesterTargetRpc;
use crate::physics::PIXEL_TO_WORLD;
use crate::CONFIG;

pub fn handle_rpc(player_entity: &Player, rpc: UpdateHarvesterTargetRpc) {
    let max_build_distance_from_player = CONFIG.with(|c| c.borrow().max_build_distance_from_player) as f32;

    let harvester_entity = manager::get_entity(rpc.harvester_uid);

    let harvester_entity = match harvester_entity {
        Some(EntityTypeEnum::Harvester(entity)) => {
            entity
        },
        _ => return
    };

    if harvester_entity.target_resource_uid == Some(rpc.target_uid) {
        return;
    }

    if player_entity.party_id != harvester_entity.base_building.party_id {
        return;
    }

    let player_to_harvester_dist = (player_entity.generic_entity.position.distance_to(&harvester_entity.base_building.generic_entity.position) as f32).sqrt();

    if player_to_harvester_dist > max_build_distance_from_player * PIXEL_TO_WORLD as f32 {
        return;
    }

    if rpc.target_uid == 0 {
        harvester_entity.update_target(None);
    }

    let target_resource = manager::get_entity(rpc.target_uid);

    let target_resource = match target_resource {
        Some(EntityTypeEnum::Resource(e)) => e,
        _ => return
    };

    let building_tier_index_usize = (harvester_entity.base_building.tier - 1) as usize;
    let building_info = buildings::get_building(&harvester_entity.base_building.generic_entity.model);

    let building_info = match &building_info {
        BuildingInfoEnum::Harvester(e) => e,
        _ => unreachable!(),
    };

    let harvester_to_resource_dist = (harvester_entity.base_building.generic_entity.position.distance_to(&target_resource.generic_entity.position) as f32).sqrt() as u16;

    if harvester_to_resource_dist + target_resource.radius as u16 > building_info.harvest_range[building_tier_index_usize] {
        return;
    }

    harvester_entity.update_target(Some(rpc.target_uid));
}