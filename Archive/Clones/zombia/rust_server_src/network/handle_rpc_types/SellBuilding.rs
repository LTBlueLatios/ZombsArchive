use crate::entity_manager::entity_types::generic_entity::Position;
use crate::entity_manager::entity_types::{EntityTypeEnum, Player};
use crate::entity_manager::manager;
use crate::network::decode_rpc_types::SellBuilding::SellBuildingRpc;
use crate::{ws_server, GameModes, ResourceCosts, PARTIES};
use crate::CONFIG;
use crate::physics::PIXEL_TO_WORLD;
use crate::info::buildings::{self, BuildingInfoTrait};


pub fn handle_rpc(player_entity: &Player, rpc: SellBuildingRpc) {
    if player_entity.can_sell == false {
        ws_server::send_failure(player_entity.generic_entity.uid, "You are not allowed to sell buildings. Ask your party leader.");
        return;
    }

    let max_build_distance_from_player = CONFIG.with(|c| {
        let config = c.borrow();

        config.max_build_distance_from_player
    });

    let mut total_building_cost = ResourceCosts {
        gold_costs: 0.0,
        wood_costs: 0.0,
        stone_costs: 0.0,
        tokens_costs: 0.0
    };

    for building_uid in rpc.building_uids.iter() {
        let building_entity = manager::get_entity(*building_uid);

        let (building_info, building_position, building_party_id, building_tier) = match building_entity {
            Some(entity) => {
                match entity {
                    EntityTypeEnum::ArrowTower(e) => (buildings::get_building("ArrowTower"), e.ranged_building.base_building.generic_entity.position.clone(), e.ranged_building.base_building.party_id, e.ranged_building.base_building.tier),
                    EntityTypeEnum::CannonTower(e) => (buildings::get_building("CannonTower"), e.ranged_building.base_building.generic_entity.position.clone(), e.ranged_building.base_building.party_id, e.ranged_building.base_building.tier),
                    EntityTypeEnum::MageTower(e) => (buildings::get_building("MageTower"), e.ranged_building.base_building.generic_entity.position.clone(), e.ranged_building.base_building.party_id, e.ranged_building.base_building.tier),
                    EntityTypeEnum::RocketTower(e) => (buildings::get_building("RocketTower"), e.ranged_building.base_building.generic_entity.position.clone(), e.ranged_building.base_building.party_id, e.ranged_building.base_building.tier),
                    EntityTypeEnum::LightningTower(e) => (buildings::get_building("LightningTower"), e.ranged_building.base_building.generic_entity.position.clone(), e.ranged_building.base_building.party_id, e.ranged_building.base_building.tier),
                    EntityTypeEnum::SawTower(e) => (buildings::get_building("SawTower"), e.ranged_building.base_building.generic_entity.position.clone(), e.ranged_building.base_building.party_id, e.ranged_building.base_building.tier),
                    EntityTypeEnum::Wall(e) => (buildings::get_building("Wall"), e.base_building.generic_entity.position.clone(), e.base_building.party_id, e.base_building.tier),
                    EntityTypeEnum::LargeWall(e) => (buildings::get_building("LargeWall"), e.base_building.generic_entity.position.clone(), e.base_building.party_id, e.base_building.tier),
                    EntityTypeEnum::Door(e) => (buildings::get_building("Door"), e.base_building.generic_entity.position.clone(), e.base_building.party_id, e.base_building.tier),
                    EntityTypeEnum::SpikeTrap(e) => (buildings::get_building("SpikeTrap"), e.base_building.generic_entity.position.clone(), e.base_building.party_id, e.base_building.tier),
                    EntityTypeEnum::Drill(e) => (buildings::get_building("Drill"), e.base_building.generic_entity.position.clone(), e.base_building.party_id, e.base_building.tier),
                    EntityTypeEnum::Harvester(e) => (buildings::get_building("Harvester"), e.base_building.generic_entity.position.clone(), e.base_building.party_id, e.base_building.tier),
                    _ => continue
                }
            },
            None => continue
        };

        if building_party_id != player_entity.party_id {
            return;
        }

        let mut dist_from_player = Position { x: 0, y: 0 };

        if building_position.x > player_entity.generic_entity.position.x {
            dist_from_player.x = building_position.x - player_entity.generic_entity.position.x;
        } else {
            dist_from_player.x = player_entity.generic_entity.position.x - building_position.x;
        }

        if building_position.y > player_entity.generic_entity.position.y {
            dist_from_player.y = building_position.y - player_entity.generic_entity.position.y;
        } else {
            dist_from_player.y = player_entity.generic_entity.position.y - building_position.y;
        }

        if dist_from_player.x > max_build_distance_from_player * PIXEL_TO_WORLD as i16 ||
        dist_from_player.y > max_build_distance_from_player * PIXEL_TO_WORLD as i16 {
            ws_server::send_failure(player_entity.generic_entity.uid, "You cannot sell buildings from too far away.");
            return;
        }

        // Success

        for i in 1..=building_tier {
            let building_tier_costs = building_info.costs(i);

            total_building_cost.gold_costs += building_tier_costs.gold_costs;
            total_building_cost.wood_costs += building_tier_costs.wood_costs;
            total_building_cost.stone_costs += building_tier_costs.stone_costs;
            total_building_cost.tokens_costs += building_tier_costs.tokens_costs;
        }

        manager::kill_entity(building_uid);
    }

    let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

    if matches!(game_mode, GameModes::Scarcity) {
        let member_uids = PARTIES.with(|p| {
            let mut parties = p.borrow_mut();
            let party = parties.get_mut(&player_entity.party_id).unwrap();

            party.resources.gold += total_building_cost.gold_costs * 0.75;
            party.resources.wood += total_building_cost.wood_costs * 0.75;
            party.resources.stone += total_building_cost.stone_costs * 0.75;

            party.members.clone()
        });

        for uid in member_uids.iter() {
            manager::flag_property_as_changed(*uid, "gold");
            manager::flag_property_as_changed(*uid, "wood");
            manager::flag_property_as_changed(*uid, "stone");
        }
    } else {
        player_entity.set_property("gold", Box::new(player_entity.gold + (total_building_cost.gold_costs * 0.75)));
        player_entity.set_property("wood", Box::new(player_entity.wood + (total_building_cost.wood_costs * 0.75)));
        player_entity.set_property("stone", Box::new(player_entity.stone + (total_building_cost.stone_costs * 0.75)));
        player_entity.set_property("tokens", Box::new(player_entity.tokens + (total_building_cost.tokens_costs * 0.75)));
    }
}