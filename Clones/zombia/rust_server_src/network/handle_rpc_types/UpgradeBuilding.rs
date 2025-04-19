use crate::entity_manager::entity_types::generic_entity::Position;
use crate::entity_manager::entity_types::player::Player;
use crate::entity_manager::entity_types::{AllEntityTypesEnum, EntityTypeEnum};
use crate::info::buildings::{self, BuildingInfoTrait};
use crate::manager;
use crate::network::decode_rpc_types::UpgradeBuilding::UpgradeBuildingRpc;
use crate::physics::PIXEL_TO_WORLD;
use crate::ws_server;
use crate::CONFIG;
use crate::PARTIES;

use crate::entity_manager::entity_types::building::BuildingTrait;

pub fn handle_rpc(player_entity: &Player, rpc: UpgradeBuildingRpc) {
    let party_clone = PARTIES.with(|parties| {
        parties
            .borrow()
            .get(&player_entity.party_id)
            .unwrap()
            .clone()
    });

    let (max_build_distance_from_player, tick_number) = CONFIG.with(|c| {
        let config = c.borrow();

        (config.max_build_distance_from_player, config.tick_number)
    });

    let mut building_uids_upgraded: Vec<(u16, bool)> = Vec::new();

    for building_uid in rpc.building_uids.iter() {
        let building_entity = manager::get_entity(*building_uid);

        let (building_type, building_info, building_position, building_party_id, building_tier) =
            match &building_entity {
                Some(entity) => match entity {
                    EntityTypeEnum::ArrowTower(e) => (
                        AllEntityTypesEnum::ArrowTower,
                        buildings::get_building("ArrowTower"),
                        e.ranged_building
                            .base_building
                            .generic_entity
                            .position
                            .clone(),
                        e.ranged_building.base_building.party_id,
                        e.ranged_building.base_building.tier,
                    ),
                    EntityTypeEnum::CannonTower(e) => (
                        AllEntityTypesEnum::CannonTower,
                        buildings::get_building("CannonTower"),
                        e.ranged_building
                            .base_building
                            .generic_entity
                            .position
                            .clone(),
                        e.ranged_building.base_building.party_id,
                        e.ranged_building.base_building.tier,
                    ),
                    EntityTypeEnum::MageTower(e) => (
                        AllEntityTypesEnum::MageTower,
                        buildings::get_building("MageTower"),
                        e.ranged_building
                            .base_building
                            .generic_entity
                            .position
                            .clone(),
                        e.ranged_building.base_building.party_id,
                        e.ranged_building.base_building.tier,
                    ),
                    EntityTypeEnum::RocketTower(e) => (
                        AllEntityTypesEnum::RocketTower,
                        buildings::get_building("RocketTower"),
                        e.ranged_building
                            .base_building
                            .generic_entity
                            .position
                            .clone(),
                        e.ranged_building.base_building.party_id,
                        e.ranged_building.base_building.tier,
                    ),
                    EntityTypeEnum::LightningTower(e) => (
                        AllEntityTypesEnum::LightningTower,
                        buildings::get_building("LightningTower"),
                        e.ranged_building
                            .base_building
                            .generic_entity
                            .position
                            .clone(),
                        e.ranged_building.base_building.party_id,
                        e.ranged_building.base_building.tier,
                    ),
                    EntityTypeEnum::SawTower(e) => (
                        AllEntityTypesEnum::SawTower,
                        buildings::get_building("SawTower"),
                        e.ranged_building
                            .base_building
                            .generic_entity
                            .position
                            .clone(),
                        e.ranged_building.base_building.party_id,
                        e.ranged_building.base_building.tier,
                    ),
                    EntityTypeEnum::Factory(e) => (
                        AllEntityTypesEnum::Factory,
                        buildings::get_building("Factory"),
                        e.base_building.generic_entity.position.clone(),
                        e.base_building.party_id,
                        e.base_building.tier,
                    ),
                    EntityTypeEnum::Wall(e) => (
                        AllEntityTypesEnum::Wall,
                        buildings::get_building("Wall"),
                        e.base_building.generic_entity.position.clone(),
                        e.base_building.party_id,
                        e.base_building.tier,
                    ),
                    EntityTypeEnum::LargeWall(e) => (
                        AllEntityTypesEnum::LargeWall,
                        buildings::get_building("LargeWall"),
                        e.base_building.generic_entity.position.clone(),
                        e.base_building.party_id,
                        e.base_building.tier,
                    ),
                    EntityTypeEnum::Door(e) => (
                        AllEntityTypesEnum::Door,
                        buildings::get_building("Door"),
                        e.base_building.generic_entity.position.clone(),
                        e.base_building.party_id,
                        e.base_building.tier,
                    ),
                    EntityTypeEnum::SpikeTrap(e) => (
                        AllEntityTypesEnum::SpikeTrap,
                        buildings::get_building("SpikeTrap"),
                        e.base_building.generic_entity.position.clone(),
                        e.base_building.party_id,
                        e.base_building.tier,
                    ),
                    EntityTypeEnum::Drill(e) => (
                        AllEntityTypesEnum::Drill,
                        buildings::get_building("Drill"),
                        e.base_building.generic_entity.position.clone(),
                        e.base_building.party_id,
                        e.base_building.tier,
                    ),
                    EntityTypeEnum::Harvester(e) => (
                        AllEntityTypesEnum::Harvester,
                        buildings::get_building("Harvester"),
                        e.base_building.generic_entity.position.clone(),
                        e.base_building.party_id,
                        e.base_building.tier,
                    ),
                    _ => continue,
                },
                None => continue,
            };

        let building_entity = building_entity.unwrap();

        if building_party_id != player_entity.party_id {
            return;
        }

        if building_tier >= buildings::TIERS as u8 {
            ws_server::send_failure(
                player_entity.generic_entity.uid,
                "This is the highest tier you can reach!.",
            );
            return;
        }

        if !matches!(building_type, AllEntityTypesEnum::Factory) {
            let primary_building = manager::get_entity(party_clone.primary_building_uid.unwrap());

            match primary_building {
                Some(EntityTypeEnum::Factory(primary_building_entity)) => {
                    if building_tier >= primary_building_entity.base_building.tier {
                        ws_server::send_failure(
                            player_entity.generic_entity.uid,
                            "You must upgrade your factory first.",
                        );
                        return;
                    }
                }
                _ => unreachable!(),
            }
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

        if dist_from_player.x > max_build_distance_from_player as i16 * PIXEL_TO_WORLD as i16
            || dist_from_player.y > max_build_distance_from_player as i16 * PIXEL_TO_WORLD as i16
        {
            ws_server::send_failure(
                player_entity.generic_entity.uid,
                "You cannot sell buildings from too far away.",
            );
            continue;
        }

        let building_costs = building_info.costs(building_tier + 1);

        let can_afford = player_entity.can_afford(&building_costs);
        if can_afford == false {
            ws_server::send_failure(
                player_entity.generic_entity.uid,
                "You do not have enough resources to place this building.",
            );
            return;
        }

        // Success

        player_entity.deduct_resource_costs(&building_costs);

        match building_entity {
            EntityTypeEnum::ArrowTower(e) => e.upgrade(tick_number),
            EntityTypeEnum::CannonTower(e) => e.upgrade(tick_number),
            EntityTypeEnum::MageTower(e) => e.upgrade(tick_number),
            EntityTypeEnum::RocketTower(e) => e.upgrade(tick_number),
            EntityTypeEnum::LightningTower(e) => e.upgrade(tick_number),
            EntityTypeEnum::SawTower(e) => e.upgrade(tick_number),
            EntityTypeEnum::Factory(e) => e.upgrade(tick_number),
            EntityTypeEnum::Wall(e) => e.upgrade(tick_number),
            EntityTypeEnum::LargeWall(e) => e.upgrade(tick_number),
            EntityTypeEnum::Door(e) => e.upgrade(tick_number),
            EntityTypeEnum::Drill(e) => e.upgrade(tick_number),
            EntityTypeEnum::Harvester(e) => e.upgrade(tick_number),
            EntityTypeEnum::SpikeTrap(e) => e.upgrade(tick_number),
            _ => unreachable!(),
        }

        building_uids_upgraded.push((*building_uid, false));
    }

    if building_uids_upgraded.len() > 0 {
        PARTIES.with(|parties| {
            let mut parties = parties.borrow_mut();

            let party = parties.get_mut(&player_entity.party_id).unwrap();

            party.update_buildings(building_uids_upgraded);
        });
    }
}
