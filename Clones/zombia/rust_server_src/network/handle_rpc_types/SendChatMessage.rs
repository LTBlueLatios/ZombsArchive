use crate::entity_manager::entity_types::{EntityTypeEnum, Player};
use crate::entity_manager::manager::{self, ENTITIES};
use crate::network::decode_rpc_types::SendChatMessage::SendChatMessageRpc;
use crate::network::{encode, encode_rpc, encode_rpc_types, OPCODES};
use crate::network::ws_server::send_ws_message;
use crate::physics::{self, PIXEL_TO_WORLD};
use crate::{CONFIG, PARTIES};
use rapier2d::prelude::*;

enum ChatChannels {
    All,
    Party
}

fn send_chat_message(player_uid: u16, player_name: &str, message: &str, channel: &str) {
    let chat_packet = encode_rpc::RpcPacket::ReceiveChatMessage(encode_rpc_types::ReceiveChatMessage::ReceiveChatMessageRpc {
        name: player_name.to_owned(),
        message: message.to_owned(),
        channel: channel.to_owned()
    });

    send_ws_message(player_uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(chat_packet));
}

pub fn handle_rpc(player_entity: &Player, rpc: SendChatMessageRpc) {
    if player_entity.action_timers.get("SendChatMessage").unwrap().timer_active == true {
        return;
    }

    let chat_channel = match rpc.channel.as_str() {
        "All" => ChatChannels::All,
        "Party" => ChatChannels::Party,
        _ => return
    };

    let message = rpc.message.chars().take(140).collect::<String>();

    match chat_channel {
        ChatChannels::Party => {
            let member_uids = PARTIES.with(|p| {
                let parties = p.borrow();
                let player_party = parties.get(&player_entity.party_id).unwrap();

                player_party.members.clone()
            });

            for uid in member_uids.iter() {
                send_chat_message(*uid, &player_entity.name, &message, &rpc.channel);
            }
        },
        ChatChannels::All => {
            let vision_range = vector![1920.0 / PIXEL_TO_WORLD as f32, 1080.0 / PIXEL_TO_WORLD as f32];
    
            let query_shape = Cuboid::new(vision_range);
            let query_filter = QueryFilter::default();
    
            let mut uids_in_range: Vec<u16> = Vec::new();
    
            physics::intersections_with_shape(
                &player_entity.generic_entity.position,
                0,
                query_shape,
                query_filter,
                |collider_handle, _rigid_body_set, _collider_set| {
                    let entity_uid = physics::get_entity_uid_from_collider_handle(collider_handle);
    
                    match entity_uid {
                        Some(entity_uid) => {
                            manager::ENTITIES.with(|e| {
                                let entities = e.borrow();
    
                                let entity = entities.get(&entity_uid);
    
                                match entity {
                                    Some(EntityTypeEnum::Player(_)) => {
                                        uids_in_range.push(entity_uid);
                                    },
                                    _ => {}
                                }
                            });
                        },
                        None => {}
                    }
    
                    true
            });

            for uid in uids_in_range.iter() {
                if player_entity.visible_entities.contains(uid) == true {
                    send_chat_message(*uid, &player_entity.name, &message, &rpc.channel);
                }
            }
        }
    }

    let (tick_number, tick_rate) = CONFIG.with(|c| {
        let config = c.borrow();

        (config.tick_number, config.tick_rate)
    });

    ENTITIES.with(|e| {
        let mut entities = e.borrow_mut();
        let player_entity = entities.get_mut(&player_entity.generic_entity.uid).unwrap();

        let EntityTypeEnum::Player(player_entity) = player_entity else {
            unreachable!();
        };

        let action_timer = player_entity.action_timers.get_mut("SendChatMessage").unwrap();

        action_timer.timer_active = true;
        action_timer.action_timeout_end_tick = tick_number + (action_timer.action_timeout_ms / tick_rate) as u32;
    })
}