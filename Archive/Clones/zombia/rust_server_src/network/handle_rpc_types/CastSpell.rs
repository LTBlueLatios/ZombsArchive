use crate::entity_manager::entity_types::generic_entity::Position;
use crate::entity_manager::entity_types::spell_indicator::SpellIndicatorTypesEnum;
use crate::entity_manager::entity_types::{AllEntityTypesEnum, EntityTypeEnum, Player};
use crate::entity_manager::manager::{self, ENTITIES};
use crate::info::spells::{SpellInfo, SpellsEnum, SPELLS};
use crate::network::decode_rpc_types::CastSpell::CastSpellRpc;
use crate::network::{encode, encode_rpc, encode_rpc_types, ws_server, OPCODES};
use crate::physics::PIXEL_TO_WORLD;
use crate::{ CONFIG, PARTIES, WORLD_HEIGHT, WORLD_WIDTH };

pub fn handle_rpc(player_entity: &Player, rpc: CastSpellRpc) {
    let spell = match rpc.spell_name.as_str() {
        "Timeout" => SpellsEnum::Timeout,
        "Rapidfire" => SpellsEnum::Rapidfire,
        _ => return
    };

    let spell_info = SPELLS.get(rpc.spell_name.as_str()).unwrap();

    let spell_costs = spell_info.get_costs();

    let can_afford = player_entity.can_afford(&spell_costs);

    if can_afford == false {
        ws_server::send_failure(
            player_entity.generic_entity.uid,
            "You do not have enough resources to cast this spell.",
        );
        return;
    }

    // Check that a primary building exists
    let primary_uid = match PARTIES.with(|p| {
        let parties = p.borrow();
        let player_party = parties.get(&player_entity.party_id).unwrap();

        player_party.primary_building_uid
    }) {
        Some(primary_uid) => primary_uid,
        None => {
            ws_server::send_failure(
                player_entity.generic_entity.uid,
                "You need a Factory to cast this spell",
            );
            return;
        }
    };

    let (tick_number, tick_rate, cycle_data) = CONFIG.with(|c| {
        let config = c.borrow();

        (config.tick_number, config.tick_rate, config.day_night_cycle.clone())
    });

    let icon_cooldown_ms: u32;
    let cooldown_ms: u32;

    match spell {
        SpellsEnum::Timeout => {
            let timeout_successful = ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();

                let primary_building = entities.get_mut(&primary_uid).unwrap();

                let EntityTypeEnum::Factory(primary_building) = primary_building else {
                    unreachable!()
                };

                if primary_building.timed_out == true {
                    return false;
                }

                if primary_building.timeout_info.timer_active == true {
                    return false;
                }

                primary_building.timed_out = true;

                true
            });

            if timeout_successful == false {
                ws_server::send_failure(
                    player_entity.generic_entity.uid,
                    "You can't use this spell again yet.",
                );
                return;
            }

            // Success

            let ticks_to_cycle_end = if cycle_data.is_day == true {
                cycle_data.night_start_tick - tick_number - 1
            } else {
                cycle_data.day_start_tick - tick_number - 1
            };

            let ms_to_cycle_end = ticks_to_cycle_end * tick_rate as u32;

            // If it's day when the timeout is bought, the icon will only be
            // on screen for the rest of the day
            if cycle_data.is_day == true {
                icon_cooldown_ms = ms_to_cycle_end;
            } else {
                // If it's night when the timeout is bought, the icon will be
                // on screen for the full duration of the night, plus the next day
                icon_cooldown_ms = cycle_data.day_length_ms + ms_to_cycle_end;
            }

            // Timeout becomes available the next unskipped night
            if cycle_data.is_day == true {
                // If it's day when the timeout is bought, the spell won't available for:
                // the rest of the day + the duration of the night + the duration of the next day
                cooldown_ms = ms_to_cycle_end + cycle_data.night_length_ms + cycle_data.day_length_ms;
            } else {
                // If it's night when the timeout is being bought, the spell won 't be available for:
                // the rest of the night + the duration of the next day + the duration of the next night + the duration of the day after
                cooldown_ms = ms_to_cycle_end + cycle_data.day_length_ms * 2 + cycle_data.night_length_ms;
            }

            let timer_end_tick = tick_number + cooldown_ms / tick_rate as u32;
            let icon_end_tick = tick_number + icon_cooldown_ms / tick_rate as u32;

            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();

                let primary_building = entities.get_mut(&primary_uid).unwrap();

                let EntityTypeEnum::Factory(primary_building) = primary_building else {
                    unreachable!()
                };

                primary_building.timeout_info.timer_active = true;
                primary_building.timeout_info.timer_end_tick = timer_end_tick;
                primary_building.timeout_info.icon_end_tick = icon_end_tick;
            });
        },
        SpellsEnum::Rapidfire => {
            let max_spell_cast_distance_from_player = CONFIG.with(|c| c.borrow().max_spell_cast_distance_from_player);

            let max_spell_cast_distance_from_player = max_spell_cast_distance_from_player as u32 * PIXEL_TO_WORLD as u32;

            let spell_pos = Position {
                x: rpc.x,
                y: rpc.y
            };

            if spell_pos.x > WORLD_WIDTH ||
                spell_pos.y > WORLD_HEIGHT {
                return;
            }

            let dist_from_player = spell_pos.distance_to(&player_entity.generic_entity.position);

            if dist_from_player > max_spell_cast_distance_from_player.pow(2) {
                ws_server::send_failure(
                    player_entity.generic_entity.uid,
                    "You can't cast a spell that far away.",
                );
                return;
            }

            let timer_active = ENTITIES.with(|e| {
                let entities = e.borrow();

                let primary_building = entities.get(&primary_uid).unwrap();

                let EntityTypeEnum::Factory(primary_building) = primary_building else {
                    unreachable!()
                };

                primary_building.rapidfire_info.timer_active
            });

            if timer_active == true {
                ws_server::send_failure(
                    player_entity.generic_entity.uid,
                    "You can't use this spell again yet.",
                );
                return;
            }

            let SpellInfo::Rapidfire(rapidfire_info) = spell_info else {
                unreachable!()
            };

            let ticks_to_cycle_end = if cycle_data.is_day == true {
                cycle_data.night_start_tick - tick_number - 1
            } else {
                cycle_data.day_start_tick - tick_number - 1
            };

            let ms_to_cycle_end = ticks_to_cycle_end * tick_rate as u32;

            // Icon only shows while buff is being applied
            icon_cooldown_ms = rapidfire_info.buff_duration_ms;

            // Rapidfire becomes available when the next night begins
            if cycle_data.is_day == true {
                // If it's day when the buff is bought, the spell won't be available for the rest of the day
                cooldown_ms = ms_to_cycle_end;
            } else {
                // If it's night when the buff is bought, the spell won't be available for:
                // the rest of the night + the duration of the next day
                cooldown_ms = ms_to_cycle_end + cycle_data.day_length_ms;
            }

            let timer_end_tick = tick_number + cooldown_ms / tick_rate as u32;
            let icon_end_tick = tick_number + icon_cooldown_ms / tick_rate as u32;

            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();

                let primary_building = entities.get_mut(&primary_uid).unwrap();

                let EntityTypeEnum::Factory(primary_building) = primary_building else {
                    unreachable!()
                };

                primary_building.rapidfire_info.timer_active = true;
                primary_building.rapidfire_info.timer_end_tick = timer_end_tick;
                primary_building.rapidfire_info.icon_end_tick = icon_end_tick;
            });

            manager::create_entity(
                AllEntityTypesEnum::SpellIndicator,
                None,
                spell_pos,
                0,
                Some(|entity: EntityTypeEnum| {
                    let EntityTypeEnum::SpellIndicator(mut entity) = entity else {
                        unreachable!();
                    };
    
                    entity.spell_type = SpellIndicatorTypesEnum::Rapidfire;
                    entity.radius = rapidfire_info.radius as f32;
                    entity.death_tick = rapidfire_info.buff_duration_ms / tick_rate as u32 + tick_number;

                    entity.initialise_physics();
    
                    EntityTypeEnum::SpellIndicator(entity)
                }),
            );
        }
    }

    let party_member_uids = PARTIES.with(|p| {
        let parties = p.borrow();
        let player_party = parties.get(&player_entity.party_id).unwrap();

        player_party.members.clone()
    });

    for uid in party_member_uids.iter() {
        let response_rpc = encode_rpc::RpcPacket::CastSpellResponse(encode_rpc_types::CastSpellResponse::CastSpellResponseRpc {
            name: rpc.spell_name.clone(),
            cooldown_ms,
            icon_cooldown_ms
        });

        ws_server::send_ws_message(*uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(response_rpc));
    }

    player_entity.deduct_resource_costs(&spell_costs);
}