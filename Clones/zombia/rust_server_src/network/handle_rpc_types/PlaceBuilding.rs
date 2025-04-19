use crate::entity_manager::entity_types::Player;
use crate::entity_manager::manager::ENTITIES;
use crate::entity_manager::{entity_types::EntityTypeEnum, manager, entity_types::AllEntityTypesEnum};
use crate::network::decode_rpc_types::PlaceBuilding::PlaceBuildingRpc;
use crate::entity_manager::entity_types::generic_entity::Position;
use crate::network::ws_server;
use crate::{CONFIG, PARTIES};
use crate::{WORLD_HEIGHT, WORLD_WIDTH};
use rapier2d::math::Isometry;
use rapier2d::prelude::*;
use crate::physics::{self, PIXEL_TO_WORLD};
use crate::info::buildings::{self, BuildingInfoTrait};

pub fn handle_rpc(player_entity: &Player, rpc: PlaceBuildingRpc) {
    if player_entity.can_place == false {
        ws_server::send_failure(player_entity.generic_entity.uid, "You are not allowed to place buildings. Ask your party leader.");
        return;
    }

    let building_model = match rpc.model.as_str() {
        "Factory" => AllEntityTypesEnum::Factory,
        "ArrowTower" => AllEntityTypesEnum::ArrowTower,
        "CannonTower" => AllEntityTypesEnum::CannonTower,
        "MageTower" => AllEntityTypesEnum::MageTower,
        "RocketTower" => AllEntityTypesEnum::RocketTower,
        "LightningTower" => AllEntityTypesEnum::LightningTower,
        "SawTower" => AllEntityTypesEnum::SawTower,
        "Wall" => AllEntityTypesEnum::Wall,
        "LargeWall" => AllEntityTypesEnum::LargeWall,
        "SpikeTrap" => AllEntityTypesEnum::SpikeTrap,
        "Door" => AllEntityTypesEnum::Door,
        "Drill" => AllEntityTypesEnum::Drill,
        "Harvester" => AllEntityTypesEnum::Harvester,
        _ => return
    };

    let info = buildings::get_building(rpc.model.as_str());

    let allowed_game_modes = match &info {
        buildings::BuildingInfoEnum::Base(base_building_info) => base_building_info.game_modes,
        buildings::BuildingInfoEnum::Ranged(ranged_tower_info) => ranged_tower_info.base_info.game_modes,
        buildings::BuildingInfoEnum::Melee(melee_tower_info) => melee_tower_info.base_info.game_modes,
        buildings::BuildingInfoEnum::Drill(drill_info) => drill_info.base_info.game_modes,
        buildings::BuildingInfoEnum::Harvester(harvester_info) => harvester_info.base_info.game_modes,
    };

    let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

    if !allowed_game_modes.contains(&game_mode) {
        return;
    }

    let party_clone = PARTIES.with(|parties| parties.borrow().get(&player_entity.party_id).unwrap().clone());

    let building_position: Position = Position {
        x: rpc.x,
        y: rpc.y
    };

    let (max_build_distance_from_player, max_build_distance_from_primary, min_build_distance_between_primary, minimum_map_edge_build_distance) = CONFIG.with(|c| {
        let config = c.borrow();

        (config.max_build_distance_from_player, config.max_build_distance_from_primary, config.min_build_distance_between_primary, config.minimum_map_edge_build_distance)
    });

    let mut building_yaw: u16 = 0;
    let mut building_height: f32 = 0.0;
    let mut building_width: f32 = 0.0;
    let mut building_grid_height: i16 = 0;
    let mut building_grid_width: i16 = 0;

    if matches!(building_model, AllEntityTypesEnum::Harvester) ||
    matches!(building_model, AllEntityTypesEnum::SawTower) {
        if [0, 90, 180, 270].contains(&rpc.yaw) {
            building_yaw = rpc.yaw;
        }
    }

    if [0, 180].contains(&rpc.yaw) {
        building_width = info.width();
        building_height = info.height();
        building_grid_width = info.grid_width();
        building_grid_height = info.grid_height();
    } else if [90, 270].contains(&rpc.yaw) {
        building_width = info.height();
        building_height = info.width();
        building_grid_width = info.grid_height();
        building_grid_height = info.grid_width();
    }

    // Check the position is valid on the building grid
    if building_grid_width == 1 && building_grid_height == 1 {
        if (rpc.x % 24 != 0 || rpc.y % 24 != 0) ||
         (rpc.x % 48 != 24 || rpc.y % 48 != 24) {
            return;
         }
    } else
    if building_grid_width == 2 && building_grid_height == 2 {
        if rpc.x % 48 != 0 || rpc.y % 48 != 0 {
            return;
        }
    } else
    if building_grid_width == 2 && building_grid_height == 2 {
        if (rpc.x % 24 != 0) ||
            (rpc.x % 48 != 0) ||
            (rpc.y % 24 != 0) ||
            (rpc.y % 48 != 24) {
                return;
            }
    } else
    if building_grid_width == 3 && building_grid_height == 2 {
        if (rpc.x % 24 != 0) ||
            rpc.x % 48 != 24 ||
            rpc.y % 24 != 0 ||
            rpc.y % 48 != 0 {
                return;
            }
    } else
    if building_grid_width == 2 && building_grid_height == 3 {
        if (rpc.x % 24 != 0) ||
            rpc.x % 48 != 0 ||
            rpc.y % 24 != 0 ||
            rpc.y % 48 != 24 {
                return;
            }
    }

    if building_position.x > WORLD_WIDTH ||
    building_position.y > WORLD_HEIGHT {
        return
    }

    let translation: nalgebra::Matrix<f32, nalgebra::Const<2>, nalgebra::Const<1>, nalgebra::ArrayStorage<f32, 2, 1>> = vector![
        (building_position.x as f32 / PIXEL_TO_WORLD as f32),
        (building_position.y as f32 / PIXEL_TO_WORLD as f32)
    ];

    let current_tower_count: u16 = match &building_model {
        &AllEntityTypesEnum::Factory => 0,
        &AllEntityTypesEnum::ArrowTower => party_clone.building_counts.arrow_tower,
        &AllEntityTypesEnum::CannonTower => party_clone.building_counts.cannon_tower,
        &AllEntityTypesEnum::MageTower => party_clone.building_counts.mage_tower,
        &AllEntityTypesEnum::RocketTower => party_clone.building_counts.rocket_tower,
        &AllEntityTypesEnum::LightningTower => party_clone.building_counts.lightning_tower,
        &AllEntityTypesEnum::SawTower => party_clone.building_counts.saw_tower,
        &AllEntityTypesEnum::Wall => party_clone.building_counts.wall,
        &AllEntityTypesEnum::LargeWall => party_clone.building_counts.large_wall,
        &AllEntityTypesEnum::SpikeTrap => party_clone.building_counts.spike_trap,
        &AllEntityTypesEnum::Door => party_clone.building_counts.door,
        &AllEntityTypesEnum::Drill => party_clone.building_counts.drill,
        &AllEntityTypesEnum::Harvester => party_clone.building_counts.harvester,
        _ => unreachable!()
    };

    let max_tower_count = if info.count_static() == true {
        info.max_count()
    } else {
        info.max_count() * party_clone.member_count as u16
    };

    if current_tower_count >= max_tower_count {
        ws_server::send_failure(player_entity.generic_entity.uid, "You cannot place any more of this building type.");
        return;
    }

    let primary_building = match &party_clone.primary_building_uid {
        Some(uid) => {
            if matches!(building_model, AllEntityTypesEnum::Factory) {
                return;
            }

            ENTITIES.with(|e| {
                match e.borrow().get(&uid).unwrap().clone() {
                    EntityTypeEnum::Factory(e) => Some(e),
                    _ => unreachable!()
                }
            })
        },
        None => {
            if !matches!(building_model, AllEntityTypesEnum::Factory) {
                ws_server::send_failure(player_entity.generic_entity.uid, "You must place a Factory first.");
                return;
            }

            None
        }
    };

    let position_obstructed: bool = {
        let shape = Cuboid::new(vector![building_width / 2.0 / PIXEL_TO_WORLD as f32, building_height / 2.0 / PIXEL_TO_WORLD as f32]);
        let shape_pos = Isometry::new(translation, 0.0);

        let collision_groups = InteractionGroups::new(Group::GROUP_3, 
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3
        );

        let filter = QueryFilter::default().groups(collision_groups);

        physics::RIGID_BODY_SET.with(|rigid_body_set| {
            let rigid_body_set = rigid_body_set.borrow();

            physics::COLLIDER_SET.with(|collider_set| {
                let collider_set = collider_set.borrow();

                physics::QUERY_PIPELINE.with(|query_pipeline| {
                    let query_pipeline = query_pipeline.borrow();

                    let intersection = query_pipeline.intersection_with_shape(&rigid_body_set, &collider_set, &shape_pos, &shape, filter);

                    // match intersection {
                    //     Some(e) => {
                    //         let collider = collider_set.get(e).unwrap();

                    //         let collider_parent = collider.parent();
    
                    //         if collider_parent.is_some() {
                    //             let rigid_body_handle = collider_parent.unwrap();

                    //             let rigid_body = rigid_body_set.get(rigid_body_handle).unwrap();

                    //             ENTITIES.with(|e| {
                    //                 let entities = e.borrow();
                    //                 let uid = rigid_body.user_data as u16;
                    //                 let entity = entities.get(&uid).unwrap();
                    //                 dbg!(entity.generic_entity());
                    //             })
                    //         }
                    //     },
                    //     None => {}
                    // }

                    return intersection.is_some();
                })
            })
        })
    };

    if position_obstructed == true {
        ws_server::send_failure(player_entity.generic_entity.uid, "This place is occupied.");
        return;
    }

    if matches!(building_model, AllEntityTypesEnum::Factory) {
        let too_close_to_primary = || -> bool {
            let shape = Cuboid::new(vector![(min_build_distance_between_primary / 2) as f32, (min_build_distance_between_primary / 2) as f32]);
            let shape_pos = Isometry::new(translation, 0.0);
            let filter = QueryFilter::default();

            physics::RIGID_BODY_SET.with(|rigid_body_set| {
                let rigid_body_set = rigid_body_set.borrow();

                physics::COLLIDER_SET.with(|collider_set| {
                    let collider_set = collider_set.borrow();

                    physics::QUERY_PIPELINE.with(|query_pipeline| {
                        let query_pipeline = query_pipeline.borrow();

                        let mut return_val = false;

                        query_pipeline.intersections_with_shape(&rigid_body_set, &collider_set, &shape_pos, &shape, filter, |handle| -> bool {
                            let rigid_body = physics::get_rigid_body_from_collider_handle(handle, &collider_set, &rigid_body_set);
                            if let Some(rigid_body) = rigid_body {
                                if rigid_body.user_data != 0 {
                                    let entity = manager::get_entity(rigid_body.user_data as u16);

                                    if let Some(entity) = entity {
                                        if let EntityTypeEnum::Factory(_) = entity {
                                            return_val = true;
                                            return false;
                                        }
                                    }
                                }
                            }
                            true
                        });

                        return return_val;
                    })
                })
            })
        }();

        if too_close_to_primary == true {
            ws_server::send_failure(player_entity.generic_entity.uid, "You cannot place your Factory this close to another Factory.");
            return;
        }
    }

    // TODO: factory warming up

    let position_obstructed: bool = manager::TENTATIVE_BUILDING_POSITIONS.with(|e| {
        let tentative_building_positions = e.borrow();

        for t_building_position in tentative_building_positions.iter() {
            let x_diff = if building_position.x > t_building_position.0.x {
                building_position.x - t_building_position.0.x
            } else {
                t_building_position.0.x - building_position.x
            };

            let y_diff = if building_position.y > t_building_position.0.y {
                building_position.y - t_building_position.0.y
            } else {
                t_building_position.0.y - building_position.y
            };

            if (x_diff as f32) < building_width + t_building_position.1 {
                return true;
            }

            if (y_diff as f32) < building_height + t_building_position.2 {
                return true;
            }
        }

        false
    });

    if position_obstructed == true {
        ws_server::send_failure(player_entity.generic_entity.uid, "This place is occupied.");
        return;
    }

    let building_costs = info.costs(1);

    let can_afford = ENTITIES.with(|e| {
        let mut entities = e.borrow_mut();
        let entity = entities.get_mut(&player_entity.generic_entity.uid).unwrap();

        let EntityTypeEnum::Player(entity) = entity else {
            unreachable!();
        };

        entity.can_afford(&building_costs)
    });

    if can_afford == false {
        ws_server::send_failure(player_entity.generic_entity.uid, "You do not have enough resources to place this building.");
        return;
    }

    {
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
            ws_server::send_failure(player_entity.generic_entity.uid, "You cannot place buildings too far away.");
            return;
        }
    }

    {
        let mut too_close_to_map_borders = false;
        if building_position.x / (PIXEL_TO_WORLD as i16) < (building_grid_width / 2 + minimum_map_edge_build_distance) as i16 {
            too_close_to_map_borders = true;
        }

        if building_position.y / (PIXEL_TO_WORLD as i16) < (building_grid_height / 2 + minimum_map_edge_build_distance) as i16 {
            too_close_to_map_borders = true;
        }

        // world size is guaranteed to never be less than the building_position as per above
        if (WORLD_WIDTH - building_position.x) / (PIXEL_TO_WORLD as i16) < (building_grid_width / 2 + minimum_map_edge_build_distance) as i16 {
            too_close_to_map_borders = true;
        }

        if (WORLD_HEIGHT - building_position.y) / (PIXEL_TO_WORLD as i16) < (building_grid_height / 2 + minimum_map_edge_build_distance) as i16 {
            too_close_to_map_borders = true;
        }

        if too_close_to_map_borders == true {
            ws_server::send_failure(player_entity.generic_entity.uid, "You cannot place buildings that close to the map borders.");
            return;
        }
    }

    if !matches!(building_model, AllEntityTypesEnum::Factory) &&
        !matches!(building_model, AllEntityTypesEnum::Harvester) // Harvesters can be placed anywhere on the map
        {
        let primary_building = primary_building.unwrap();

        let mut dist_from_primary = Position { x: 0, y: 0 };

        if building_position.x > primary_building.base_building.generic_entity.position.x {
            dist_from_primary.x = building_position.x - primary_building.base_building.generic_entity.position.x + (building_grid_width / 2) as i16;
        } else {
            dist_from_primary.x = primary_building.base_building.generic_entity.position.x - building_position.x + (building_grid_width / 2) as i16;
        }

        if building_position.y > primary_building.base_building.generic_entity.position.y {
            dist_from_primary.y = building_position.y - primary_building.base_building.generic_entity.position.y + (building_grid_height / 2) as i16;
        } else {
            dist_from_primary.y = primary_building.base_building.generic_entity.position.y - building_position.y + (building_grid_height / 2) as i16;
        }

        if dist_from_primary.x > max_build_distance_from_primary * PIXEL_TO_WORLD as i16 ||
        dist_from_primary.y > max_build_distance_from_primary * PIXEL_TO_WORLD as i16 {
            ws_server::send_failure(player_entity.generic_entity.uid, "You cannot place buildings too far away from your Factory.");
            return;
        }
    }

    // SUCCESS !

    player_entity.deduct_resource_costs(&building_costs);

    let building_entity = manager::create_entity(building_model, None, building_position, building_yaw, None::<fn(EntityTypeEnum) -> EntityTypeEnum>).unwrap();

    manager::TENTATIVE_BUILDING_POSITIONS.with(|e| {
        let mut tentative_building_positions = e.borrow_mut();

        tentative_building_positions.push((
            building_position,
            building_width,
            building_height
        ));
    });

    PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        let party = parties.get_mut(&player_entity.party_id).unwrap();

        party.update_buildings(vec![(building_entity.generic_entity().uid, false)]);
    });
}