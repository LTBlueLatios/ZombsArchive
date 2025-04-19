use crate::entity_manager::entity_types::generic_entity::Position;
use crate::entity_manager::entity_types::{EntityTypeEnum, Player};
use crate::entity_manager::manager::ENTITIES;
use crate::info::buildings::{self, BuildingInfoEnum};
use crate::network::decode_rpc_types::BuyHarvesterDrone::BuyHarvesterDroneRpc;
use crate::network::ws_server;
use crate::physics::PIXEL_TO_WORLD;
use crate::{GameModes, ResourceCosts, CONFIG};

pub fn handle_rpc(player_entity: &Player, rpc: BuyHarvesterDroneRpc) {
    let max_build_distance_from_player = CONFIG.with(|c| c.borrow().max_build_distance_from_player);

    let harvester_entity = ENTITIES.with(|e| {
        let entities = e.borrow();

        let harvester_entity = entities.get(&rpc.harvester_uid);

        match harvester_entity {
            Some(EntityTypeEnum::Harvester(entity)) => Some(entity.clone()),
            _ => None,
        }
    });

    let harvester_entity = match harvester_entity {
        Some(e) => e,
        None => return
    };

    if player_entity.party_id != harvester_entity.base_building.party_id {
        return;
    }

    let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

    if matches!(game_mode, GameModes::Scarcity) {
        ws_server::send_failure(
            player_entity.generic_entity.uid,
            "Harvester drones cannot be bought in Scarcity mode.",
        );
        return;
    }

    let building_info =
        buildings::get_building(&harvester_entity.base_building.generic_entity.model);

    let building_info = match &building_info {
        BuildingInfoEnum::Harvester(e) => e,
        _ => unreachable!(),
    };

    let drone_cost = ResourceCosts {
        gold_costs: building_info.drone_gold_costs as f32,
        wood_costs: 0.0,
        stone_costs: 0.0,
        tokens_costs: 0.0,
    };

    let mut dist_from_player = Position { x: 0, y: 0 };

    if harvester_entity.base_building.generic_entity.position.x > player_entity.generic_entity.position.x {
        dist_from_player.x = harvester_entity.base_building.generic_entity.position.x - player_entity.generic_entity.position.x;
    } else {
        dist_from_player.x = player_entity.generic_entity.position.x - harvester_entity.base_building.generic_entity.position.x;
    }

    if harvester_entity.base_building.generic_entity.position.y > player_entity.generic_entity.position.y {
        dist_from_player.y = harvester_entity.base_building.generic_entity.position.y - player_entity.generic_entity.position.y;
    } else {
        dist_from_player.y = player_entity.generic_entity.position.y - harvester_entity.base_building.generic_entity.position.y;
    }

    if dist_from_player.x > max_build_distance_from_player * PIXEL_TO_WORLD as i16
        || dist_from_player.y > max_build_distance_from_player * PIXEL_TO_WORLD as i16
    {
        return;
    }

    if !player_entity.can_afford(&drone_cost) {
        ws_server::send_failure(
            player_entity.generic_entity.uid,
            "You do not have enough resources to buy another drone.",
        );
        return;
    }

    player_entity.deduct_resource_costs(&drone_cost);

    harvester_entity.spawn_drone();
}
