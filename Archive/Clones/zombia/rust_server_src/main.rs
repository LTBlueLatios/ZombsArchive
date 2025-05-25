mod entity_manager;
mod info;
mod network;
mod pathfinding_rs;

use entity_manager::entity_types::{
    generate_random_map_position, player, AllEntityTypesEnum, EntityTypeEnum, Factory,
};
use entity_manager::manager::{self, ENTITIES};
use network::encode_rpc_types::UpdateLeaderboard::{LeaderboardEntry, UpdateLeaderboardRpc};
use network::website_ws::{connect_to_website_ws, read_website_ws_messages, CONNECT_RETRY_TICK, DEBUG_SEND_TICK, WEBSITE_WS};
use network::{encode_rpc_types, website_ws, ws_server, OPCODES};
use tungstenite::protocol::CloseFrame;
use std::cell::RefCell;
use std::collections::HashMap;
use std::sync::Arc;
use clap::Parser;

#[derive(Parser, Debug)]
struct Args {
    #[arg(short, long, default_value_t = 8000)]
    port: i16,
    #[arg(short, long, default_value = "standard")]
    game_mode: String
}

use std::time::{Duration, Instant};

use network::encode;
use network::encode_rpc;

use rand::prelude::*;

use entity_manager::entity_types::building::BuildingTrait;

mod party;
mod physics;

#[derive(Clone, Debug, PartialEq)]
pub enum GameModes {
    Standard,
    Scarcity
}

impl GameModes {
    pub fn mode_to_string(&self) -> String {
        match self {
            GameModes::Standard => "standard".to_owned(),
            GameModes::Scarcity => "scarcity".to_owned()
        }
    }
}

trait StringClamp {
    fn clamp_len(&self, max_len: usize) -> String;
}

impl StringClamp for str {
    fn clamp_len(&self, max_len: usize) -> String {
        self.chars().take(max_len).collect()
    }
}

#[derive(Debug, Clone)]
pub struct ResourceCosts {
    pub gold_costs: f32,
    pub wood_costs: f32,
    pub stone_costs: f32,
    pub tokens_costs: f32,
}

#[derive(Clone, Debug)]
pub struct DayNightCycle {
    is_day: bool,
    day_start_tick: u32,
    night_start_tick: u32,
    night_length_ms: u32,
    day_length_ms: u32,
    night_length_ticks: u32,
    day_length_ticks: u32,
}

#[derive(Clone, Debug)]
pub struct GameConfig {
    pub player_population: u16,
    pub max_player_count: u16,
    pub max_party_member_count: u8,
    pub tick_rate: u16,
    pub tick_number: u32,
    pub day_night_cycle: DayNightCycle,
    pub minimum_map_edge_build_distance: i16,
    pub max_build_distance_from_primary: i16,
    pub min_build_distance_between_primary: i16,
    pub max_build_distance_from_player: i16,
    pub max_spell_cast_distance_from_player: i16,
    pub tree_count: u16,
    pub stone_count: u16,
    pub party_update_frequency_ms: u16,
    pub last_party_update: u32, // pub neutralSpawnCount: 0,
    pub leaderboard_update_frequency_ms: u16,
    pub last_leaderboard_update: u32,
    pub game_mode: GameModes
}

#[derive(Clone, Debug)]
pub struct DebuggingInfo {
    pub longest_frame_time: f64
}

const WORLD_WIDTH: i16 = 24_000;
const WORLD_HEIGHT: i16 = 24_000;

thread_local! {
    pub static CONFIG: RefCell<GameConfig> = {
        let mut config = GameConfig {
            player_population: 0,
            max_player_count: 32,
            max_party_member_count: 4,
            tick_rate: 50,
            tick_number: 0,
            day_night_cycle: DayNightCycle {
                is_day: true,
                day_start_tick: 0,
                night_start_tick: 0,
                night_length_ms: 45_000,
                day_length_ms: 45_000,
                night_length_ticks: 0,
                day_length_ticks: 0
            },
            minimum_map_edge_build_distance: 4,
            max_build_distance_from_primary: 18,
            min_build_distance_between_primary: 18 * 2 + 20, // maxFactoryBuildDistance doubled
            max_build_distance_from_player: 16,
            max_spell_cast_distance_from_player: 30,
            tree_count: 400,
            stone_count: 400,
            party_update_frequency_ms: 5000,
            last_party_update: 0,
            leaderboard_update_frequency_ms: 3000,
            last_leaderboard_update: 0,
            game_mode: GameModes::Standard
        };

        config.day_night_cycle.day_length_ticks = config.day_night_cycle.day_length_ms / config.tick_rate as u32;
        config.day_night_cycle.night_length_ticks = config.day_night_cycle.night_length_ms / config.tick_rate as u32;

        config.day_night_cycle.night_start_tick = config.day_night_cycle.day_length_ticks;
        config.day_night_cycle.day_start_tick = config.day_night_cycle.night_length_ticks;

        RefCell::new(config)
    };

    pub static DEBUGGING_INFO: RefCell<DebuggingInfo> = RefCell::new(DebuggingInfo{ 
        longest_frame_time: 0.0
    });

    pub static FRAME_TIME: RefCell<f64> = RefCell::new(0.0);

    pub static PARTIES: RefCell<HashMap<u32, party::Party>> = RefCell::new(HashMap::new());
}

pub fn create_party(leader_uid: u16) {
    let party = party::Party::new(leader_uid);

    PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        parties.insert(party.id, party);
    });
}

pub fn destroy_party(party_id: u32) {
    let primary_building_uid = PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        match parties.get_mut(&party_id) {
            Some(party) => party.primary_building_uid,
            None => unreachable!(),
        }
    });

    match primary_building_uid {
        Some(uid) => {
            manager::kill_entity(&uid);
        },
        None => {},
    }

    PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        parties.remove(&party_id);
    });
}

pub fn send_party_data() {
    let sockets: Vec<(
        u16,
        Arc<RefCell<tungstenite::WebSocket<std::net::TcpStream>>>,
    )> = ws_server::CONNECTED_SOCKETS.with(|connected_sockets| {
        let connected_sockets = connected_sockets.borrow();

        connected_sockets
            .iter()
            .map(|(&uid, ws)| (uid, Arc::clone(ws)))
            .collect()
    });

    for (uid, _websocket) in sockets {
        let party_data_packet = get_party_data(uid);

        ws_server::send_ws_message(
            uid,
            OPCODES::PacketRpc,
            encode::EncodedMessageEnum::Rpc(party_data_packet),
        );
    }
}

pub fn send_leaderboard_data() {
    let sockets: Vec<(
        u16,
        Arc<RefCell<tungstenite::WebSocket<std::net::TcpStream>>>,
    )> = ws_server::CONNECTED_SOCKETS.with(|connected_sockets| {
        let connected_sockets = connected_sockets.borrow();

        connected_sockets
            .iter()
            .map(|(&uid, ws)| (uid, Arc::clone(ws)))
            .collect()
    });

    let leaderboard_data = get_leaderboard_data();

    for (uid, _websocket) in sockets {
        let mut trimmed_leaderboard_data = leaderboard_data.clone();
        trimmed_leaderboard_data.truncate(10);

        get_leaderboard_data_for_player(&mut trimmed_leaderboard_data, &leaderboard_data, uid);

        // TODO: Admin mode can see entire leaderboard
        let leaderboard_data_packet = encode_rpc::RpcPacket::UpdateLeaderboard(UpdateLeaderboardRpc {
            entries: trimmed_leaderboard_data
        });

        ws_server::send_ws_message(
            uid,
            OPCODES::PacketRpc,
            encode::EncodedMessageEnum::Rpc(leaderboard_data_packet),
        );
    }
}

pub fn get_party_data(player_uid: u16) -> encode_rpc::RpcPacket {
    use encode_rpc_types::UpdateParty::{Party, UpdatePartyRpc};

    let player_entity = manager::get_entity(player_uid).unwrap();

    let EntityTypeEnum::Player(player_entity) = player_entity else {
        panic!("Expected a Player entity, but got a different type");
    };

    let mut parties_to_send: Vec<Party> = Vec::new();

    PARTIES.with(|parties| {
        let parties = parties.borrow();

        for (party_id, party) in parties.iter() {
            if !party.is_open && party.id != player_entity.party_id {
                continue;
            }

            parties_to_send.push(Party {
                is_open: party.is_open,
                party_name: party.name.clone(),
                party_id: *party_id,
                member_count: party.member_count,
                member_limit: party.member_limit,
            });
        }
    });

    let party_data_packet = encode_rpc::RpcPacket::UpdateParty(UpdatePartyRpc {
        parties: parties_to_send,
    });

    return party_data_packet;
}

pub fn get_leaderboard_data() -> Vec<LeaderboardEntry> {
    use encode_rpc_types::UpdateLeaderboard::LeaderboardEntry;

    let mut leaderboard_entries: Vec<LeaderboardEntry> = Vec::new();


    let player_uids: Vec<u16> = ws_server::CONNECTED_SOCKETS.with(|connected_sockets| {
        let connected_sockets = connected_sockets.borrow();

        connected_sockets
            .keys().copied().collect()
    });

    for uid in player_uids.iter() {
        ENTITIES.with(|e| {
            let entities = e.borrow();

            let player_entity = entities.get(uid).unwrap();

            let EntityTypeEnum::Player(player_entity) = player_entity else {
                unreachable!()
            };

            leaderboard_entries.push(LeaderboardEntry {
                uid: *uid,
                name: player_entity.name.clone(),
                score: 0,
                wave: player_entity.wave,
                rank: 0
            })
        });
    }

    leaderboard_entries.sort_by_key(|e| e.score);

    for (index, entry) in leaderboard_entries.iter_mut().enumerate() {
        entry.rank = index as u8 + 1;
    }

    return leaderboard_entries;
}

pub fn get_leaderboard_data_for_player(trimmed_leaderboard_data: &mut Vec<LeaderboardEntry>, leaderboard_data: &Vec<LeaderboardEntry>, player_uid: u16) {
    ENTITIES.with(|e| {
        let entities = e.borrow();
        let player_entity = entities.get(&player_uid).unwrap();

        let EntityTypeEnum::Player(player_entity) = player_entity else {
            unreachable!();
        };

        // Ensure the player's and their party member's names show on the leaderboard
        let member_uids = PARTIES.with(|p| {
            let parties = p.borrow();
            let party = parties.get(&player_entity.party_id).unwrap();

            party.members.clone()
        });

        for member_uid in member_uids.iter() {
            let member_entity = entities.get(member_uid).unwrap();

            let EntityTypeEnum::Player(member_entity) = member_entity else {
                unreachable!();
            };

            if trimmed_leaderboard_data.iter().any(|entry| entry.uid == *member_uid) == false {
                trimmed_leaderboard_data.push(LeaderboardEntry {
                    uid: *member_uid,
                    name: member_entity.name.clone(),
                    score: 0,
                    wave: member_entity.wave,
                    rank: (leaderboard_data.iter().position(|e| e.uid == *member_uid).unwrap() as u8) + 1
                }); 
            }
        }
    });

    trimmed_leaderboard_data.sort_by_key(|e| e.score);
}

fn main() {
    std::env::set_var("RUST_BACKTRACE", "full");

    let args = Args::parse();

    let game_mode = match args.game_mode.as_str() {
        "standard" => GameModes::Standard,
        "scarcity" => GameModes::Scarcity,
        _ => panic!("invalid game mode provided!")
    };

    println!("Initialising server.\nGame mode: {}", args.game_mode);

    CONFIG.with(|c| {
        let mut config = c.borrow_mut();

        config.game_mode = game_mode;
    });

    lazy_static::initialize(&player::DEFAULT_TOOLS);
    lazy_static::initialize(&player::SCARCITY_DEFAULT_TOOLS);

    let (tree_count, stone_count, tick_rate) = CONFIG.with(|config| {
        let config = config.borrow();

        (config.tree_count, config.stone_count, config.tick_rate)
    });

    use crate::entity_manager::entity_types::EntityTypeEnum;

    for _ in 0..tree_count {
        let aiming_yaw = rand::thread_rng().gen_range(0..=359);

        manager::create_entity(
            AllEntityTypesEnum::Resource,
            None,
            generate_random_map_position(),
            aiming_yaw,
            Some(|entity: EntityTypeEnum| {
                let mut resource = match entity {
                    EntityTypeEnum::Resource(entity) => entity,
                    _ => unreachable!(),
                };

                resource.resource_type = "Tree".to_string();
                resource.resource_variant = rand::thread_rng().gen_range(1..=2);

                EntityTypeEnum::Resource(resource)
            }),
        )
        .expect("Issue creating tree!");
    }

    for _ in 0..stone_count {
        let aiming_yaw = rand::thread_rng().gen_range(0..=359);

        manager::create_entity(
            AllEntityTypesEnum::Resource,
            None,
            generate_random_map_position(),
            aiming_yaw,
            Some(|entity: EntityTypeEnum| {
                let mut resource = match entity {
                    EntityTypeEnum::Resource(entity) => entity,
                    _ => unreachable!(),
                };

                resource.resource_type = "Stone".to_string();
                resource.resource_variant = rand::thread_rng().gen_range(1..=2);

                EntityTypeEnum::Resource(resource)
            }),
        )
        .expect("Issue creating stone!");
    }

    physics::create_world_borders();
    let ws_server_instance = ws_server::start_websocket_server(args.port);
    website_ws::connect_to_website_ws(args.port);

    // let mut start = Instant::now();

    ctrlc::set_handler(move || {
        WEBSITE_WS.with(|ws| {
            let mut ws_instance = ws.borrow_mut();

            if let Some(website_ws_instance) = ws_instance.as_mut() {
                website_ws_instance.close(Some(CloseFrame {
                    code: tungstenite::protocol::frame::coding::CloseCode::Normal,
                    reason: "Client shutting down".into(),
                }))
                .expect("Failed to close WebSocket connection");
            }
        });

        std::process::exit(0)
    }).expect("Error setting exit handler");

    let is_logging_tick_times: bool = false;

    // Ticker
    loop {
        // let mut elapsed = start.elapsed();

        // Wait until the next tick time
        // while elapsed < tick_rate_duration {
        //     yield_now();
        //     elapsed = start.elapsed();
        // }

        let mut process_time_log = String::from("\n\n");

        let tick_start = Instant::now();

        let mut factories: Vec<Factory> = Vec::new();

        let (last_party_update, party_update_frequency_ms, tick_number, is_day, last_leaderboard_update, leaderboard_update_frequency_ms) = CONFIG.with(|config| {
            let mut config = config.borrow_mut();

            config.tick_number += 1;

            let mut cycle_updated: bool = false;

            if config.day_night_cycle.is_day == true {
                if config.tick_number >= config.day_night_cycle.night_start_tick {
                    config.day_night_cycle.is_day = false;
                    config.day_night_cycle.day_start_tick =
                        config.tick_number + config.day_night_cycle.night_length_ticks;
                    cycle_updated = true;
                }
            } else {
                if config.tick_number >= config.day_night_cycle.day_start_tick {
                    config.day_night_cycle.is_day = true;
                    config.day_night_cycle.night_start_tick =
                        config.tick_number + config.day_night_cycle.day_length_ticks;
                    cycle_updated = true;
                }
            }

            if cycle_updated == true {
                PARTIES.with(|parties| {
                    let parties = parties.borrow();

                    for (_party_id, party) in parties.iter() {
                        if party.member_count <= 0 {
                            continue;
                        }

                        let primary_building_entity = match party.primary_building_uid {
                            Some(uid) => {
                                if let EntityTypeEnum::Factory(factory_entity) =
                                    manager::get_entity(uid).unwrap()
                                {
                                    factory_entity
                                } else {
                                    continue;
                                }
                            }
                            None => continue,
                        };
                        factories.push(primary_building_entity);
                    }
                });
            }

            (
                config.last_party_update,
                config.party_update_frequency_ms,
                config.tick_number,
                config.day_night_cycle.is_day,
                config.last_leaderboard_update,
                config.leaderboard_update_frequency_ms
            )
        });

        for factory in factories.iter() {
            factory.toggle_day_night(is_day);
        }

        let process_start = Instant::now();
        // Entity updates
        let connected_sockets = ws_server::CONNECTED_SOCKETS.with(|connected_sockets| {
            let connected_sockets = connected_sockets.borrow();

            connected_sockets
                .iter()
                .map(|(&uid, ws)| (uid, Arc::clone(ws)))
                .collect()
        });

        ws_server::send_entity_updates(connected_sockets);

        if is_logging_tick_times == true {
            let tick_duration = process_start.elapsed().as_micros() as f64 / 1000.0;
            process_time_log.push_str(&format!("Sending entity updates to client: {}ms\n", tick_duration));
        }

        let process_start = Instant::now();
        // Clear modified entity properties
        {
            let modified_properties = manager::MODIFIED_PROPERTIES
                .with(|modified_properties| modified_properties.borrow().clone());

            for (&entity_uid, property_names) in modified_properties.iter() {
                if property_names.contains(&"hits".to_string()) {
                    manager::with_entity(entity_uid, |entity| {
                        let EntityTypeEnum::Resource(resource_entity) = entity else {
                            panic!("Expected a Resource entity, but got a different type");
                        };

                        resource_entity.hits.clear();
                    })
                }

                if property_names.contains(&"last_player_damages".to_string()) {
                    manager::with_entity(entity_uid, |entity| {
                        let EntityTypeEnum::Player(player_entity) = entity else {
                            panic!("Expected a Player entity, but got a different type");
                        };

                        player_entity.last_player_damages.clear();
                    })
                }
            }

            manager::MODIFIED_PROPERTIES
                .with(|modified_properties| modified_properties.borrow_mut().clear());

            drop(modified_properties);
        }

        if is_logging_tick_times == true {
            let tick_duration = process_start.elapsed().as_micros() as f64 / 1000.0;
            process_time_log.push_str(&format!("Clearing modified entity properties: {}ms\n", tick_duration));
        }

        let process_start = Instant::now();
        manager::UIDS_TO_BE_RECYCLED.with(|uids_to_be_recycled| {
            manager::AVAILABLE_UIDS.with(|available_uids| {
                let mut available_uids: std::cell::RefMut<'_, Vec<u16>> =
                    available_uids.borrow_mut();
                let mut uids_to_be_recycled = uids_to_be_recycled.borrow_mut();

                available_uids.append(&mut uids_to_be_recycled);
                available_uids.sort();
            })
        });

        if is_logging_tick_times == true {
            let tick_duration = process_start.elapsed().as_micros() as f64 / 1000.0;
            process_time_log.push_str(&format!("Recycling UIDs: {}ms\n", tick_duration));
        }

        ws_server::accept_incoming_ws(&ws_server_instance);

        let process_start = Instant::now();
        // Reading socket messages
        let unauthorised_sockets: Vec<(
            u16,
            Arc<RefCell<tungstenite::WebSocket<std::net::TcpStream>>>,
        )> = ws_server::UNAUTHORISED_SOCKETS.with(|unauthorised_sockets| {
            let unauthorised_sockets = unauthorised_sockets.borrow();

            unauthorised_sockets
                .iter()
                .map(|(&uid, ws)| (uid, Arc::clone(ws)))
                .collect()
        });

        ws_server::read_all_ws_messages(unauthorised_sockets);

        let connected_sockets: Vec<(
            u16,
            Arc<RefCell<tungstenite::WebSocket<std::net::TcpStream>>>,
        )> = ws_server::CONNECTED_SOCKETS.with(|connected_sockets| {
            let connected_sockets = connected_sockets.borrow();

            connected_sockets
                .iter()
                .map(|(&uid, ws)| (uid, Arc::clone(ws)))
                .collect()
        });

        ws_server::read_all_ws_messages(connected_sockets);

        if is_logging_tick_times == true {
            let tick_duration = process_start.elapsed().as_micros() as f64 / 1000.0;
            process_time_log.push_str(&format!("Interacting with WebSocket clients: {}ms\n", tick_duration));
        }

        let process_start = Instant::now();
        // Step physics world
        physics::step_physics();
        if is_logging_tick_times == true {
            let tick_duration = process_start.elapsed().as_micros() as f64 / 1000.0;
            process_time_log.push_str(&format!("Stepping physics world: {}ms\n", tick_duration));
        }

        let process_start = Instant::now();
        // This vector is used to allow multiple buildings to be placed in the same tick without overlapping
        // Buildings placed do not appear in the query pipeline until rapier is stepped, so we keep track of buildings placed
        manager::TENTATIVE_BUILDING_POSITIONS.with(|e| {
            let mut tentative_building_positions = e.borrow_mut();

            tentative_building_positions.clear();
        });

        let mut parties_to_be_destroyed: Vec<u32> = vec![];

        PARTIES.with(|parties| {
            let parties = parties.borrow();

            for (party_id, party) in parties.iter() {
                if party.member_count <= 0 {
                    parties_to_be_destroyed.push(*party_id);
                    continue;
                }

                let mut primary_building_entity = match party.primary_building_uid {
                    Some(uid) => {
                        if let EntityTypeEnum::Factory(factory_entity) =
                            manager::get_entity(uid).unwrap()
                        {
                            factory_entity
                        } else {
                            continue;
                        }
                    }
                    None => continue,
                };

                primary_building_entity.on_tick(tick_number);
            }
        });

        for party_id in parties_to_be_destroyed.iter() {
            destroy_party(*party_id);
        }
        if is_logging_tick_times == true {
            let tick_duration = process_start.elapsed().as_micros() as f64 / 1000.0;
            process_time_log.push_str(&format!("Updating parties: {}ms\n", tick_duration));
        }

        let process_start = Instant::now();
        let entity_uids: Vec<u16> =
            manager::ENTITIES.with(|entities| entities.borrow().keys().cloned().collect());

        for entity_uid in entity_uids {
            let entity = manager::get_entity(entity_uid).unwrap();
            match entity {
                EntityTypeEnum::Player(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::Factory(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::ArrowTower(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::CannonTower(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::MageTower(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::RocketTower(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::LightningTower(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::SawTower(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::Wall(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::LargeWall(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::SpikeTrap(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::Door(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::Drill(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::Harvester(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::Projectile(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::ResourcePickup(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::HarvesterDrone(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::Resource(_) => continue,
                EntityTypeEnum::Zombie(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::SpellIndicator(mut entity) => entity.on_tick(tick_number),
                EntityTypeEnum::Visualiser(_) => continue,
            }
        }
        if is_logging_tick_times == true {
            let tick_duration = process_start.elapsed().as_micros() as f64 / 1000.0;
            process_time_log.push_str(&format!("Updating entities: {}ms\n", tick_duration));
        }

        if tick_number - last_party_update > (party_update_frequency_ms / tick_rate) as u32 {
            send_party_data();

            CONFIG.with(|config| {
                let mut config = config.borrow_mut();

                config.last_party_update = tick_number;
            })
        }

        if tick_number - last_leaderboard_update > (leaderboard_update_frequency_ms / tick_rate) as u32 {
            send_leaderboard_data();

            CONFIG.with(|config| {
                let mut config = config.borrow_mut();

                config.last_leaderboard_update = tick_number;
            })
        }

        manager::DEAD_ENTITY_UIDS.with(|f| {
            let mut dead_entity_uids = f.borrow_mut();

            for uid in dead_entity_uids.iter() {
                manager::kill_entity(uid);
            }

            dead_entity_uids.clear();
        });

        let tick_duration_us = tick_start.elapsed().as_micros() as u64;
        let tick_duration = tick_start.elapsed().as_micros() as f64 / 1000.0;

        DEBUGGING_INFO.with(|di| {
            let mut debugging_info = di.borrow_mut();

            if tick_duration > debugging_info.longest_frame_time {
                debugging_info.longest_frame_time = tick_duration;
            }
        });

        FRAME_TIME.with(|frame_time| {
            let mut frame_time = frame_time.borrow_mut();

            *frame_time = tick_duration;
        });

        let retrying_website_ws_connection = CONNECT_RETRY_TICK.with(|c| {
            let mut connect_tick = c.borrow_mut();

            match *connect_tick {
                Some(connect_tick_number) => {
                    let return_val = tick_number >= connect_tick_number;

                    if return_val == true {
                        *connect_tick = None;
                    }

                    return_val
                },
                None => false
            }
        });

        if retrying_website_ws_connection == true {
            connect_to_website_ws(args.port);
        }

        read_website_ws_messages();

        let sending_debugging_info = DEBUG_SEND_TICK.with(|d| {
            let mut debug_send_tick = d.borrow_mut();

            if tick_number >= *debug_send_tick {
                *debug_send_tick = tick_number + 5000 / (tick_rate as u32);
                return true;
            } else {
                return false;
            }
        });

        if sending_debugging_info == true {
            website_ws::send_debugging_info();
        }

        let tick_rate_us = (tick_rate as u64) * 1000;
        let mut duration: Duration = Duration::from_micros(0);

        if tick_rate_us > tick_duration_us {
            duration =
                Duration::from_micros(tick_rate_us - tick_duration_us);
        }

        if is_logging_tick_times == true {
            let entity_count = ENTITIES.with(|e| {
                let entities = e.borrow();
                entities.len()
            });

            process_time_log.push_str(&format!("Time taken to update tick {} with {} entities: {}ms", tick_number, entity_count, tick_duration));

            println!("{}", process_time_log);
        }

        // TODO: is this enough?
        std::thread::sleep(duration);
    }
}
