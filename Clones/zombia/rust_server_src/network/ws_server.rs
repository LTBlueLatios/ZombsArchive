use core::panic;
use std::cell::RefCell;
use std::collections::HashMap;

use bytebuffer::ByteBuffer;
use tungstenite::protocol::frame::coding::CloseCode;

use std::sync::Arc;

use tungstenite::WebSocket;
use tungstenite::Message;
use std::net::{ TcpListener, TcpStream };

use crate::entity_manager::entity_types;
use crate::entity_manager::manager::ENTITIES;
use crate::info;
use crate::network::decode;
use crate::network::encode;
use crate::network::OPCODES;

use crate::entity_manager::manager;
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::entity_types::AllEntityTypesEnum;
use crate::entity_manager::entity_types::generic_entity::Position;

use crate::{CONFIG, FRAME_TIME, create_party, PARTIES, WORLD_HEIGHT, WORLD_WIDTH};

use super::decode_rpc;
use super::encode_rpc;
use super::encode_rpc_types;

thread_local! {
    pub static CONNECTED_SOCKETS: RefCell<HashMap<u16, Arc<RefCell<WebSocket<TcpStream>>>>> = RefCell::new(HashMap::new());
    pub static UNAUTHORISED_SOCKETS: RefCell<HashMap<u16, Arc<RefCell<WebSocket<TcpStream>>>>> = RefCell::new(HashMap::new());
}

pub fn start_websocket_server(port: i16) -> TcpListener {
    println!("Starting WebSocket server...");

    let server_address = format!("0.0.0.0:{}", port);
    let server = TcpListener::bind(server_address)
        .expect("WebSocket server was not able to bind!");

    server.set_nonblocking(true)
        .expect("Failed to set WebSocket server as non blocking!");

    return server;
}

fn on_socket_close(uid: &u16) {
    let removed_socket: bool = UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
        let mut unauthorised_sockets = unauthorised_sockets.borrow_mut();

        if unauthorised_sockets.contains_key(&uid) {
            unauthorised_sockets.remove(&uid);
            return true;
        }

        false
    });

    if removed_socket == true {
        return;
    }

    CONNECTED_SOCKETS.with(|connected_sockets| {
        let mut connected_sockets = connected_sockets.borrow_mut();
        connected_sockets.remove(&uid);
    });

    let EntityTypeEnum::Player(player_entity) = manager::get_entity(*uid).unwrap() else {
        unreachable!();
    };

    player_entity.on_socket_destroyed();

    manager::kill_entity(uid);

    CONFIG.with(|c| {
        let mut config = c.borrow_mut();

        config.player_population -= 1;
    });
}

pub fn close_socket(websocket: &mut WebSocket<TcpStream>, reason: &str) {
    let close_reason = tungstenite::protocol::CloseFrame {
        code: CloseCode::Normal,
        reason: reason.into(),
    };
    websocket.close(Some(close_reason)).expect("Failed to close the WebSocket");
}

pub fn send_ws_message(player_uid: u16, opcode: OPCODES, data: encode::EncodedMessageEnum) {
    CONNECTED_SOCKETS.with(|cs| {
        let mut connected_sockets = cs.borrow_mut();
        let player_websocket = connected_sockets.get_mut(&player_uid);

        match player_websocket {
            Some(socket) => {
                let encoded_data = encode::encode_message(opcode, data);

                let mut websocket = socket.borrow_mut();
                let _ = websocket.send(encoded_data);
            },
            None => unreachable!(),
        }
    });
}

pub fn send_failure(player_uid: u16, failure_message: &str) {
    let failure_packet = encode_rpc::RpcPacket::Failure(encode_rpc_types::Failure::FailureRpc {
        message: failure_message.to_string()
    });

    send_ws_message(player_uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(failure_packet));
}

fn handle_input(uid: &u16, input_packet: decode::InputPacket) {
    let player_type_enum = manager::get_entity(*uid)
        .expect("There is no player with this uid!");

    let player_entity = match player_type_enum {
        EntityTypeEnum::Player(entity) => entity,
        _ => panic!("Expected a Player entity, but got a different type")
    };

    player_entity.apply_inputs(&input_packet);
}

const MAX_PLAYER_IP_COUNT: u16 = 5;

fn handle_enter_world(uid: &u16, enter_world_packet: decode::EnterWorldPacket) {
    let (player_population, max_player_count) = CONFIG.with(|c| {
        let config = c.borrow();

        (config.player_population, config.max_player_count)
    });

    let player_ip = UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
        let unauthorised_sockets = unauthorised_sockets.borrow();

        let socket_arc_refcell = unauthorised_sockets.get(uid).unwrap();
        let socket_clone = Arc::clone(socket_arc_refcell);

        let mut websocket = socket_clone.borrow_mut();

        websocket.get_mut().peer_addr().unwrap().ip()
    });

    let mut number_of_sockets_with_ip: u16 = 0;

    UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
        let unauthorised_sockets = unauthorised_sockets.borrow();

        for (socket_uid, socket_arc_refcell) in unauthorised_sockets.iter() {
            if *socket_uid == *uid {
                continue;
            }

            let socket_clone = Arc::clone(socket_arc_refcell);
    
            let mut websocket = socket_clone.borrow_mut();

            let socket_ip = match websocket.get_mut().peer_addr() {
                Ok(e) => e.ip(),
                Err(_) => return
            };
    
            if socket_ip == player_ip {
                number_of_sockets_with_ip += 1;
            }
        }
    });

    CONNECTED_SOCKETS.with(|connected_sockets| {
        let connected_sockets = connected_sockets.borrow();

        for (socket_uid, socket_arc_refcell) in connected_sockets.iter() {
            if *socket_uid == *uid {
                continue;
            }

            let socket_clone = Arc::clone(socket_arc_refcell);
    
            let mut websocket = socket_clone.borrow_mut();

            let socket_ip = match websocket.get_mut().peer_addr() {
                Ok(e) => e.ip(),
                Err(_) => return,
            };
    
            if socket_ip == player_ip {
                number_of_sockets_with_ip += 1;
            }
        }
    });

    if number_of_sockets_with_ip >= MAX_PLAYER_IP_COUNT {
        let enter_world_data: encode::EnterWorldPacket = encode::EnterWorldPacket::Denied {
            reason: "MaxIpLimit".to_owned()
        };

        UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
            let unauthorised_sockets = unauthorised_sockets.borrow();

            let socket_arc_refcell = unauthorised_sockets.get(uid).unwrap();
            let socket_clone = Arc::clone(socket_arc_refcell);

            let mut websocket = socket_clone.borrow_mut();

            let encoded_data = encode::encode_message(OPCODES::PacketEnterWorld, encode::EncodedMessageEnum::EnterWorld(enter_world_data));

            let _ = websocket.send(encoded_data);

            close_socket(&mut *websocket, "Max ip limit reached");
        });
        return;
    }

    if player_population >= max_player_count {
        let enter_world_data: encode::EnterWorldPacket = encode::EnterWorldPacket::Denied {
            reason: "MaxPlayerCount".to_owned()
        };

        UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
            let unauthorised_sockets = unauthorised_sockets.borrow();

            let socket_arc_refcell = unauthorised_sockets.get(uid).unwrap();
            let socket_clone = Arc::clone(socket_arc_refcell);

            let mut websocket = socket_clone.borrow_mut();

            let encoded_data = encode::encode_message(OPCODES::PacketEnterWorld, encode::EncodedMessageEnum::EnterWorld(enter_world_data));

            let _ = websocket.send(encoded_data);

            close_socket(&mut *websocket, "Server full");
        });
        return;
    }

    let position: Position = entity_types::generate_random_map_position();

    let custom_player_entity = manager::create_entity(AllEntityTypesEnum::Player, Some(*uid), position, 0 , Some(|entity: EntityTypeEnum| {
        let mut player = match entity {
            EntityTypeEnum::Player(entity) => entity,
            _ => unreachable!()
        };

        player.name = enter_world_packet.player_name.to_string();
        player.ip_address = player_ip;

        EntityTypeEnum::Player(player)
    })).expect("Encountered an issue creating player entity");

    let player_entity = match custom_player_entity {
        EntityTypeEnum::Player(entity) => entity,
        _ => unreachable!()
    };

    let config = CONFIG.with(|config| config.borrow().clone());

    let websocket_cloned = UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
        let unauthorised_sockets = unauthorised_sockets.borrow();

        let websocket = unauthorised_sockets.get(&uid)
            .expect("There is no unauthorised socket with this UID");

            Arc::clone(&websocket)
    });

    CONNECTED_SOCKETS.with(|connected_sockets| {
        let mut connected_sockets = connected_sockets.borrow_mut();

        connected_sockets.insert(player_entity.generic_entity.uid, websocket_cloned);
    });

    UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
        let mut unauthorised_sockets = unauthorised_sockets.borrow_mut();

        unauthorised_sockets.remove(&uid)
            .expect("Failed to remove uid from unauthorised_sockets!");
    });

    let enter_world_data: encode::EnterWorldPacket = encode::EnterWorldPacket::Allowed {
        name: player_entity.name.clone(),
        uid: player_entity.generic_entity.uid,
        tick_rate: config.tick_rate,
        tick: config.tick_number,
        world_width: WORLD_WIDTH,
        world_height: WORLD_HEIGHT,
        day_length_ms: config.day_night_cycle.day_length_ms,
        night_length_ms: config.day_night_cycle.night_length_ms,
        minimum_map_edge_build_distance: config.minimum_map_edge_build_distance,
        max_build_distance_from_primary: config.max_build_distance_from_primary,
        max_build_distance_from_player: config.max_build_distance_from_player,
        max_party_member_count: config.max_party_member_count
    };

    send_ws_message(player_entity.generic_entity.uid, OPCODES::PacketEnterWorld, encode::EncodedMessageEnum::EnterWorld(enter_world_data));

    let tools: Vec<info::equippables::EquippableInfo> = info::equippables::tool_info.values().cloned().collect();

    let tool_data_packet = encode_rpc::RpcPacket::ToolInfo(encode_rpc_types::ToolInfo::ToolInfoRpc {
        tool_info: tools
    });

    send_ws_message(player_entity.generic_entity.uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(tool_data_packet));

    let buildings: Vec<info::buildings::BuildingInfoEnum> = info::buildings::get_player_buildings();

    let building_data_packet = encode_rpc::RpcPacket::BuildingInfo(encode_rpc_types::BuildingInfo::BuildingInfoRpc {
        building_info: buildings
    });

    send_ws_message(player_entity.generic_entity.uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(building_data_packet));

    let spells: Vec<info::spells::SpellInfo> = info::spells::SPELLS.values().cloned().collect();

    let spell_data_packet = encode_rpc::RpcPacket::SpellInfo(encode_rpc_types::SpellInfo::SpellInfoRpc {
        spell_info: spells
    });

    send_ws_message(player_entity.generic_entity.uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(spell_data_packet));

    let owned_items = player_entity.owned_items.clone();

    player_entity.send_tools_to_client(owned_items);

    // Check party key and see if there are any parties with that key
    let party_key_successful = PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        let mut found_party = false;

        for (_, party) in parties.iter_mut() {
            if party.key == enter_world_packet.party_key {
                match party.add_member(player_entity.generic_entity.uid) {
                    Ok(_) => {
                        found_party = true;
                        break;
                    },
                    Err(_) => break
                };
            }
        }

        found_party
    });

    if party_key_successful == false {
        create_party(player_entity.generic_entity.uid);
    }

    CONFIG.with(|c| {
        let mut config = c.borrow_mut();

        config.player_population += 1;
    });
}

pub fn accept_incoming_ws(server: &TcpListener) {
    loop {
        match server.accept() {
            Ok((stream, _addr)) => {
                let mut websocket = match tungstenite::accept(stream) {
                    Ok(ws) => ws,
                    Err(_) => {
                        continue;
                    }
                };
        
                let _ = websocket.get_mut().set_nonblocking(true).expect("Failed to set socket as non-blocking");
        
                let websocket_arc = Arc::new(RefCell::new(websocket));
                let ws_uid = manager::generate_uid();
        
                UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
                    let mut unauthorised_sockets = unauthorised_sockets.borrow_mut();

                    unauthorised_sockets.insert(ws_uid, websocket_arc);
                });
            }
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                break;
            }
            Err(e) => {
                eprintln!("Failed to accept TCP stream!: {}", e);
                continue;
            }
        }
    }
}

pub fn read_all_ws_messages(sockets: Vec<(u16, Arc<RefCell<WebSocket<TcpStream>>>)>) {
    for (uid, websocket) in sockets {
        loop {
            let ws_message = {
                websocket.borrow_mut().read()
            };

            let message_option = match ws_message {
                Ok(message_option) => message_option,
                Err(tungstenite::Error::ConnectionClosed) => {
                    break;
                },
                // This case exists for when there is no message available to read
                Err(tungstenite::Error::Io(ref e)) if e.kind() == std::io::ErrorKind::WouldBlock => {
                    break;
                },
                Err(tungstenite::Error::Io(ref e)) if e.kind() == std::io::ErrorKind::ConnectionAborted => {
                    on_socket_close(&uid);
                    break;
                },
                Err(e) => {
                    eprintln!("Failed to read websocket message: {}", e);
                    break;
                }
            };

            let Message::Binary(message_data) = message_option else {
                match message_option {
                    Message::Close(_close_frame) => {
                        on_socket_close(&uid);
                        break;
                    },
                    _ => {
                        eprintln!("Unexpected message type: {:?}", message_option);
                        break;
                    }
                }
            };

            let decoded_message = match decode::decode_message(ByteBuffer::from_bytes(&message_data)) {
                Ok(decoded_message) => decoded_message,
                Err(_e) => {
                    eprintln!("Failed to decode message: {}", _e);
                    continue;
                }
            };

            // Only read enter world messages from unauthorised sockets
            { 
                let contains_key = UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
                    let unauthorised_sockets = unauthorised_sockets.borrow();
            
                    unauthorised_sockets.contains_key(&uid)
                });

                if contains_key == true {
                    match &decoded_message {
                        decode::DecodedMessageEnum::EnterWorld(_) => {},
                        _ => continue
                    }
                }
            }

            {
                let contains_key = CONNECTED_SOCKETS.with(|connected_sockets| {
                    let connected_sockets = connected_sockets.borrow();
            
                    connected_sockets.contains_key(&uid)
                });

                if contains_key == true {
                    match &decoded_message {
                        decode::DecodedMessageEnum::EnterWorld(_) => continue,
                        _ => {}
                    }
                }
            }

            match decoded_message {
                decode::DecodedMessageEnum::Input(input_packet) => {
                    handle_input(&uid, input_packet);
                },
                decode::DecodedMessageEnum::EnterWorld(enter_world_packet) => {
                    handle_enter_world(&uid, enter_world_packet);
                },
                decode::DecodedMessageEnum::Ping => {
                    send_ws_message(uid, OPCODES::PacketPing, encode::EncodedMessageEnum::Ping);
                },
                decode::DecodedMessageEnum::Unknown => {}
                decode::DecodedMessageEnum::Rpc(rpc_packet) => {
                    let should_handle_rpc = ENTITIES.with(|e| {
                        let entities = e.borrow();
                        let entity = entities.get(&uid).unwrap();

                        let EntityTypeEnum::Player(player_entity) = entity else {
                            unreachable!();
                        };

                        if player_entity.dead == true {
                            match rpc_packet {
                                // If a player is dead, ignore all rpc's except the respawn rpc and outofsync
                                decode_rpc::RpcPacket::Respawn(_) => {},
                                decode_rpc::RpcPacket::OutOfSync(_) => {},
                                _ => return false
                            }
                        }

                        true
                    });

                    if should_handle_rpc == false {
                        return;
                    }

                    handle_rpc(uid, rpc_packet);
                }
            }
        }
    }
}

pub fn send_entity_updates(sockets: Vec<(u16, Arc<RefCell<WebSocket<TcpStream>>>)>) {
    let frame_time = FRAME_TIME.with(|frame_time| *frame_time.borrow());

    for (uid, _websocket) in sockets {
        let entity_update_packet: encode::EntityUpdatePacket = encode::EntityUpdatePacket {
            uid,
            average_frame_time: frame_time
        };

        send_ws_message(uid, OPCODES::PacketEntityUpdate, encode::EncodedMessageEnum::EntityUpdate(entity_update_packet));
    }
}

pub fn handle_rpc(player_uid: u16, rpc: decode_rpc::RpcPacket) {
    let player_entity_clone = ENTITIES.with(|e| {
        match e.borrow().get(&player_uid).unwrap() {
            EntityTypeEnum::Player(entity) => entity.clone(),
            _ => unreachable!()
        }
    });

    match rpc {
        decode_rpc::RpcPacket::OutOfSync(rpc) => super::handle_rpc_types::OutOfSync::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::JoinParty(rpc) => super::handle_rpc_types::JoinParty::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::PartyRequestResponse(rpc) => super::handle_rpc_types::PartyRequestResponse::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::TogglePartyPermission(rpc) => super::handle_rpc_types::TogglePartyPermission::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::LeaveParty(rpc) => super::handle_rpc_types::LeaveParty::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::KickMember(rpc) => super::handle_rpc_types::KickMember::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::TogglePartyVisibility(rpc) => super::handle_rpc_types::TogglePartyVisibility::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::SetPartyName(rpc) => super::handle_rpc_types::SetPartyName::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::RandomisePartyKey(rpc) => super::handle_rpc_types::RandomisePartyKey::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::CancelPartyRequest(rpc) => super::handle_rpc_types::CancelPartyRequest::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::BuyTool(rpc) => super::handle_rpc_types::BuyTool::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::EquipTool(rpc) => super::handle_rpc_types::EquipTool::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::PlaceBuilding(rpc) => super::handle_rpc_types::PlaceBuilding::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::SellBuilding(rpc) => super::handle_rpc_types::SellBuilding::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::UpgradeBuilding(rpc) => super::handle_rpc_types::UpgradeBuilding::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::BuyHarvesterDrone(rpc) => super::handle_rpc_types::BuyHarvesterDrone::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::UpdateHarvesterTarget(rpc) => super::handle_rpc_types::UpdateHarvesterTarget::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::Respawn(rpc) => super::handle_rpc_types::Respawn::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::CastSpell(rpc) => super::handle_rpc_types::CastSpell::handle_rpc(&player_entity_clone, rpc),
        decode_rpc::RpcPacket::SendChatMessage(rpc) => super::handle_rpc_types::SendChatMessage::handle_rpc(&player_entity_clone, rpc)
    }
}