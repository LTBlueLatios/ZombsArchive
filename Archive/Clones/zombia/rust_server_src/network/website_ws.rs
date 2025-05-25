use std::{cell::RefCell, collections::HashMap};

use tungstenite::{connect, stream::MaybeTlsStream, Message};
use url::Url;
use crate::{entity_manager::{entity_types::EntityTypeEnum, manager::ENTITIES}, CONFIG, DEBUGGING_INFO, WORLD_HEIGHT, WORLD_WIDTH};

thread_local! {
    pub static WEBSITE_WS: RefCell<Option<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>>> = RefCell::new(None);
    pub static CONNECT_RETRY_TICK: RefCell<Option<u32>> = RefCell::new(None);
    pub static DEBUG_SEND_TICK: RefCell<u32> = RefCell::new(0);
}

#[derive(serde::Serialize)]
struct Packet {
    pub message_type: String,
    pub message: PacketTypeEnum
}

#[derive(serde::Serialize)]
#[allow(non_snake_case)]
struct ServerInfo {
    country: String,
    city: String,
    port: i16,
    gameMode: String
}

#[derive(serde::Serialize)]
struct HandshakePacket {
    pub authentication_array: Vec<u16>,
    pub server_info: ServerInfo
}

#[derive(serde::Serialize)]
struct DebuggingInfo {
    pub longest_frame_time: f64,
    pub population: u16
}

#[derive(serde::Serialize)]
struct ResourcePosition {
    x: i16,
    y: i16
}

#[derive(serde::Serialize)]
struct Resource {
    position: ResourcePosition,
    model: String,
    yaw: u16
}

#[derive(serde::Serialize)]
#[allow(non_snake_case)]
struct MapLayout {
    worldSize: ResourcePosition,
    mapLayout: HashMap<u16, Resource>
}

#[derive(serde::Serialize)]
enum PacketTypeEnum {
    DebuggingInfo(DebuggingInfo),
    HandshakePacket(HandshakePacket),
    MapLayout(MapLayout)
}

pub fn connect_to_website_ws(ws_port: i16) {
    let ws_connection = create_websocket_connection();

    match ws_connection {
        Some(e) => {
            println!("Connected to website WebSocket server.");
            WEBSITE_WS.with(|c| {
                let mut website_ws = c.borrow_mut();
                *website_ws = Some(e);
            });
        },
        None => {
            println!("Failed to connect to WebSocket server. Trying again in 5 seconds...");
            CONFIG.with(|c| {
                let config = c.borrow();

                CONNECT_RETRY_TICK.with(|crt| {
                    let mut connect_tick = crt.borrow_mut();
                    *connect_tick = Some(config.tick_number + (5000 / config.tick_rate) as u32)
                })
            });
        }
    }

    send_authentication_packet(ws_port);

    send_debugging_info();

    send_map_layout();
}

pub fn create_websocket_connection() -> Option<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>> {
    let website_ip = "127.0.0.1";

    let ws_url = format!("ws://{}:8088", website_ip);
    let ws_url = Url::parse(&ws_url).unwrap();

    let socket = connect(ws_url.as_str());

    let (mut socket, _) = match socket {
        Ok(socket) => socket,
        Err(_) => {
            return None;
        }
    };

    if let MaybeTlsStream::Plain(ref stream) = socket.get_mut() {
        if let Err(e) = stream.set_nonblocking(true) {
            eprintln!("Failed to set non-blocking mode: {}", e);
            return None;
        }
    } else {
        eprintln!("Failed to access the underlying TCP stream");
        return None;
    }

    Some(socket)
}

fn on_socket_close() {
    println!("Connection to website WebSocket server closed. Trying to reconnect in 5 seconds.");
    CONFIG.with(|c| {
        let config = c.borrow();

        CONNECT_RETRY_TICK.with(|crt| {
            let mut connect_tick = crt.borrow_mut();
            *connect_tick = Some(config.tick_number + (5000 / config.tick_rate) as u32)
        })
    });

    WEBSITE_WS.with(|c| {
        let mut website_ws = c.borrow_mut();
        *website_ws = None;
    });
}

pub fn read_website_ws_messages() {
    let closing_socket = WEBSITE_WS.with(|w| {
        let mut website_ws = w.borrow_mut();

        let mut return_val = false;

        if let Some(website_ws) = website_ws.as_mut() {
            loop {
                match website_ws.read() {
                    Ok(msg) => match msg {
                        Message::Text(text) => {
                            dbg!(text);
                        },
                        _ => {}
                    },
                    Err(tungstenite::Error::AlreadyClosed) => {
                        panic!("WebSocket connection already closed.");
                    }
                    Err(tungstenite::Error::ConnectionClosed) |
                    Err(tungstenite::Error::Protocol(_)) => {
                        return_val = true;
                        break;
                    },
                    Err(tungstenite::Error::Io(ref e)) if e.kind() == std::io::ErrorKind::ConnectionAborted => {
                        return_val = true;
                        break;
                    }
                    Err(tungstenite::Error::Io(ref e)) if e.kind() == std::io::ErrorKind::WouldBlock => {
                        break;
                    },
                    Err(e) => {
                        println!("Unexpected error occurred: {:?}", e);
                        break;
                    }
                }
            }
        } else {
            return_val = false;
        };

        return_val
    });

    if closing_socket == true {
        on_socket_close();
    }
}

pub fn send_debugging_info() {
    let longest_frame_time = DEBUGGING_INFO.with(|di| di.borrow().longest_frame_time);
    let population = CONFIG.with(|c| c.borrow().player_population);

    let packet = Packet {
        message_type: "DebuggingInfo".to_owned(),
        message: PacketTypeEnum::DebuggingInfo(DebuggingInfo {
            longest_frame_time,
            population
        })
    };

    send_packet(packet);
}

pub fn send_map_layout() {
    let resource_count = CONFIG.with(|c| {
        let config = c.borrow();
        config.tree_count + config.stone_count
    });

    let mut resource_positions: HashMap<u16, Resource> = HashMap::new();

    for uid in 1..resource_count + 1 {
        ENTITIES.with(|e| {
            let entities = e.borrow();
            let resource_entity = entities.get(&uid).unwrap();

            let EntityTypeEnum::Resource(resource_entity) = resource_entity else {
                unreachable!();
            };

            let mut resource_model = resource_entity.resource_type.clone();
            resource_model.push_str(&resource_entity.resource_variant.to_string());

            resource_positions.insert(uid, Resource {
                position: ResourcePosition { x: resource_entity.generic_entity.position.x, y: resource_entity.generic_entity.position.y },
                model: resource_model,
                yaw: resource_entity.aiming_yaw,
            })
        });
    }

    let packet = Packet {
        message_type: "MapLayout".to_owned(),
        message: PacketTypeEnum::MapLayout(MapLayout {
            worldSize: ResourcePosition { x: WORLD_WIDTH, y: WORLD_HEIGHT },
            mapLayout: resource_positions
        })
    };

    send_packet(packet);
}

fn send_authentication_packet(ws_port: i16) {
    let authentication_array: Vec<u16> = vec![752, 993, 141, 191, 141, 664, 550, 124, 164, 678, 806, 970, 89, 860, 968, 101, 964, 841, 427, 344, 991, 279, 923, 597, 959, 220, 32, 942, 931, 764, 334, 570, 283, 491, 157, 918, 449, 301, 291, 467, 215, 839, 154, 956, 981, 325, 551, 864, 7, 956];

    let game_mode = CONFIG.with(|c| {
        let config = c.borrow();
        config.game_mode.clone()
    });

    // TODO:
    let server_info = ServerInfo {
        country: "Local".to_owned(),
        city: "Local".to_owned(),
        port: ws_port,
        gameMode: game_mode.mode_to_string()
    };

    let handshake_packet = Packet {
        message_type: "Handshake".to_owned(),
        message: PacketTypeEnum::HandshakePacket(HandshakePacket {
            authentication_array,
            server_info 
        })
    };

    send_packet(handshake_packet);
}

fn send_packet(packet: Packet) {
    WEBSITE_WS.with(|ws| {
        let mut website_ws = ws.borrow_mut();

        if let Some(website_ws) = website_ws.as_mut() {
            let json_string = serde_json::to_string(&packet).unwrap();

            let debug_packet = Message::text(json_string);

            website_ws.send(debug_packet).unwrap();
        }
    });
}
