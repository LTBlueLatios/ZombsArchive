use rapier2d::parry::shape::Cuboid;
use rapier2d::prelude::*;
use std::any::Any;
use std::collections::HashMap;
use std::collections::HashSet;
use std::net::IpAddr;
use std::str::FromStr;

use crate::entity_manager::entity_types::generic_entity;
use crate::info::equippables::ToolTrait;
use crate::network::encode;
use crate::network::encode_rpc;
use crate::network::encode_rpc_types::Dead::DeathReasons;
use crate::network::{decode, encode_rpc_types};

use crate::network::ws_server;
use crate::network::OPCODES;
use crate::GameModes;
use crate::{ResourceCosts, CONFIG, PARTIES};
use lazy_static::lazy_static;

use crate::physics::{self, ActiveHooksEnum, PIXEL_TO_WORLD};

use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::manager::{self, ENTITIES};

use std::f32::consts::PI;

use super::building::BuildingTrait;
use super::projectile::ProjectileTypeEnum;
use super::{generate_random_map_position, AllEntityTypesEnum, Zombie};
use super::generic_entity::Position;

use crate::info::equippables::{self, Equippables};

lazy_static! {
    pub static ref DEFAULT_TOOLS: Vec<Equippables> = vec![Equippables::MeleeHarvestingTool(
        equippables::MeleeHarvestingTool::new("Pickaxe", 1)
    )];
    pub static ref SCARCITY_DEFAULT_TOOLS: Vec<Equippables> = vec![
        Equippables::MeleeHarvestingTool(
            equippables::MeleeHarvestingTool::new("Pickaxe", 7)
        ),
        Equippables::MeleeWeapon(
            equippables::MeleeWeapon::new("Sword", 7)
        ),
        Equippables::RangedWeapon(
            equippables::RangedWeapon::new("Crossbow", 7)
        ),
        Equippables::RangedWeapon(
            equippables::RangedWeapon::new("Dynamite", 7)
        ),
        Equippables::ZombieShield(
            equippables::ZombieShield::new("ZombieShield", 10)
        ),
    ];
}

const INVULNERABILITY_DURATION_MS: u32 = 15000;

#[derive(Clone, Debug)]
pub struct PlayerInputs {
    pub mouse_x: u16,
    pub mouse_y: u16,
    pub mouse_yaw: u16,
    pub mouse_down: bool,
    pub false_space_reading: bool,
    pub x_movement: i8,
    pub y_movement: i8,
    pub is_moving: bool,
}

#[derive(Clone, Debug)]
pub struct ActionTimer {
    pub action_timeout_ms: u16,
    pub action_timeout_end_tick: u32,
    pub timer_active: bool
}

#[derive(Clone, Debug)]
pub struct TickWaiter {
    pub end_tick: u32,
    pub param_u16_1: Option<u16>,
    pub param_u32_1: Option<u32>,
    pub callback: fn(Option<u16>, Option<u32>)
}

#[derive(Clone, Debug)]
pub struct Player {
    pub aiming_yaw: u16,
    pub generic_entity: generic_entity::GenericEntity,
    pub name: String,
    pub inputs: PlayerInputs,
    pub visible_entities: Vec<u16>,
    pub visible_entities_set: HashSet<u16>,
    pub last_visible_entities: Vec<u16>,
    pub firing_tick: u32,
    pub invulnerable: bool,
    pub invulnerability_start_tick: u32,
    pub gold: f32,
    pub wood: f32,
    pub stone: f32,
    pub tokens: f32,
    pub health: u16,
    pub max_health: u16,
    pub last_damaged_tick: u32,
    pub last_player_damages: Vec<(Position, u16)>,
    pub party_id: u32,
    pub wave: u32,
    pub equipped_item: Equippables,
    pub owned_items: Vec<Equippables>,
    pub weapon_name: String,
    pub weapon_tier: u8,
    pub zombie_shield_health: u16,
    pub zombie_shield_max_health: u16,
    pub yaw: u16,
    pub radius: f32,
    pub out_of_sync: bool,
    pub party_request_id: Option<u32>,
    pub party_request_sent_tick: Option<u32>,
    pub can_place: bool,
    pub can_sell: bool,
    pub dead: bool,
    pub rigid_body_handle: Option<RigidBodyHandle>,
    pub health_regen_per_second: u16,
    pub ticks_before_health_regen: u32,
    pub can_building_walk: bool,
    pub action_timers: HashMap<String, ActionTimer>,
    pub tick_waiters: Vec<TickWaiter>,
    pub ip_address: IpAddr
}

impl Player {
    pub fn new(uid: u16, position: Position) -> Self {
        let mut player_instance = Player {
            aiming_yaw: 0,
            generic_entity: generic_entity::GenericEntity::new(uid, "Player".to_owned(), position),
            name: "Unnamed Player".to_string(),
            inputs: PlayerInputs {
                mouse_x: 0,
                mouse_y: 0,
                mouse_yaw: 0,
                mouse_down: false,
                false_space_reading: false,
                x_movement: 0,
                y_movement: 0,
                is_moving: false,
            },
            visible_entities: Vec::new(),
            visible_entities_set: HashSet::new(),
            last_visible_entities: Vec::new(),
            firing_tick: 0,
            invulnerable: false,
            invulnerability_start_tick: 0,
            gold: 500000000.0,
            wood: 500000000.0,
            stone: 500000000.0,
            tokens: 0.0,
            health: 500,
            max_health: 500,
            last_damaged_tick: 0,
            last_player_damages: Vec::new(),
            party_id: 0,
            wave: 0,
            equipped_item: DEFAULT_TOOLS[0].clone(),
            owned_items: DEFAULT_TOOLS.clone(),
            weapon_name: "Pickaxe".to_string(),
            weapon_tier: 1,
            zombie_shield_health: 0,
            zombie_shield_max_health: 0,
            yaw: 0,
            radius: 24.0,
            out_of_sync: false,
            party_request_id: None,
            party_request_sent_tick: None,
            can_place: false,
            can_sell: false,
            dead: false,
            rigid_body_handle: None,
            health_regen_per_second: 50,
            ticks_before_health_regen: 100,
            can_building_walk: false,
            action_timers: HashMap::new(),
            tick_waiters: Vec::new(),
            ip_address: IpAddr::from_str("0.0.0.0").unwrap()
        };

        player_instance.action_timers.insert("HealthPotion".to_owned(), ActionTimer {
            // Timeout duration is set elsewhere
            action_timeout_ms: 0,
            action_timeout_end_tick: 0,
            timer_active: false
        });

        player_instance.action_timers.insert("SendChatMessage".to_owned(), ActionTimer {
            action_timeout_ms: 500,
            action_timeout_end_tick: 0,
            timer_active: false
        });

        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        if matches!(game_mode, GameModes::Scarcity) {
            player_instance.equipped_item = SCARCITY_DEFAULT_TOOLS[0].clone();
            player_instance.weapon_tier = player_instance.equipped_item.tier();
            player_instance.owned_items = SCARCITY_DEFAULT_TOOLS.clone();
        }

        for item in player_instance.owned_items.iter() {
            match item {
                Equippables::ZombieShield(info) => {
                    player_instance.zombie_shield_health = info.health;
                    player_instance.zombie_shield_max_health = info.health;
                },
                _ => {}
            }
        }

        let collision_group = InteractionGroups::new(
            Group::GROUP_2,
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3 | Group::GROUP_4,
        );

        let rigid_body_handle = physics::create_rigid_body(
            &player_instance.generic_entity.uid,
            physics::RigidBodyType::Dynamic {
                linear_damping_factor: 48.0,
            },
            &position,
            0,
            physics::ColliderShapes::Ball {
                radius: player_instance.radius,
            },
            collision_group,
            Some(ActiveHooksEnum::FilterContactPairs),
            None
        );

        player_instance.rigid_body_handle = Some(rigid_body_handle);

        return player_instance;
    }

    pub fn on_socket_destroyed(&self) {
        PARTIES.with(|parties| {
            let mut parties = parties.borrow_mut();

            let player_party = parties.get_mut(&self.party_id).unwrap();

            player_party.remove_member(self.generic_entity.uid, true);
        });
    }

    pub fn die(&mut self, mut death_reason: DeathReasons) {
        if self.dead == true {
            return;
        }

        self.dead = true;
        manager::flag_property_as_changed(self.generic_entity.uid, "dead");

        if self.health > 0 {
            self.health = 0;
            manager::flag_property_as_changed(self.generic_entity.uid, "health");
        }

        if self.zombie_shield_health > 0 {
            self.zombie_shield_health = 0;
            manager::flag_property_as_changed(self.generic_entity.uid, "zombie_shield_health");
        }

        let collision_group = InteractionGroups::new(
            Group::GROUP_2,
            
            Group::empty(),
        );

        physics::set_collision_groups(self.rigid_body_handle.unwrap(), collision_group);

        if matches!(death_reason, DeathReasons::Killed) {
            let factory_exists = PARTIES.with(|p| {
                let parties = p.borrow();
                let party = parties.get(&self.party_id).unwrap();
                party.primary_building_uid.is_some()
            });

            if factory_exists == true {
                death_reason = DeathReasons::KilledWithBase;
            }
        }

        let dead_packet = encode_rpc::RpcPacket::Dead(encode_rpc_types::Dead::DeadRpc {
            reason: death_reason,
            wave: self.wave,
            score: 0,
            party_score: 0
        });

        ws_server::send_ws_message(self.generic_entity.uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(dead_packet));
    }

    pub fn respawn(&mut self, factory_position: Option<Position>) {
        let (tick_number, game_mode) = CONFIG.with(|c| {
            let config = c.borrow();

            (config.tick_number, config.game_mode.clone())
        });

        self.dead = false;
        self.health = self.max_health;

        self.can_building_walk = true;
        self.invulnerable = true;
        self.invulnerability_start_tick = tick_number;

        manager::flag_property_as_changed(self.generic_entity.uid, "dead");
        manager::flag_property_as_changed(self.generic_entity.uid, "health");
        manager::flag_property_as_changed(self.generic_entity.uid, "invulnerable");

        if !matches!(game_mode, GameModes::Scarcity) {
            self.wood *= 0.75;
            self.stone *= 0.75;
            self.gold *= 0.75;
            self.tokens *= 0.75;
            self.zombie_shield_max_health = 0;

            manager::flag_property_as_changed(self.generic_entity.uid, "wood");
            manager::flag_property_as_changed(self.generic_entity.uid, "stone");
            manager::flag_property_as_changed(self.generic_entity.uid, "gold");
            manager::flag_property_as_changed(self.generic_entity.uid, "tokens");
            manager::flag_property_as_changed(self.generic_entity.uid, "zombie_shield_max_health");

            self.equipped_item = DEFAULT_TOOLS[0].clone();

            let mut current_owned_items = self.owned_items.clone();

            self.owned_items = DEFAULT_TOOLS.clone();
            self.weapon_name = "Pickaxe".to_string();
            self.weapon_tier = 1;

            for item in current_owned_items.iter_mut() {
                match item {
                    Equippables::MeleeHarvestingTool(item) => {
                        item.tier = 1;
                    },
                    Equippables::MeleeWeapon(item) => {
                        item.tier = 0;
                    },
                    Equippables::RangedWeapon(item) => {
                        item.tier = 0;
                    },
                    Equippables::ZombieShield(item) => {
                        item.tier = 0;
                    },
                }
            }

            manager::flag_property_as_changed(self.generic_entity.uid, "weapon_name");
            manager::flag_property_as_changed(self.generic_entity.uid, "weapon_tier");

            self.send_tools_to_client(current_owned_items);
        }

        for item in self.owned_items.iter() {
            match item {
                Equippables::ZombieShield(info) => {
                    self.zombie_shield_health = info.health;
                    self.zombie_shield_max_health = info.health;

                    manager::flag_property_as_changed(self.generic_entity.uid, "zombie_shield_health");
                    manager::flag_property_as_changed(self.generic_entity.uid, "zombie_shield_max_health");
                },
                _ => {}
            }
        }

        let collision_group = InteractionGroups::new(
            Group::GROUP_2,
            Group::GROUP_1 | Group::GROUP_2 | Group::GROUP_3 | Group::GROUP_4,
        );

        physics::set_collision_groups(self.rigid_body_handle.unwrap(), collision_group);

        match factory_position {
            Some(position) => {
                physics::set_rigid_body_translation(&self.generic_entity.uid, &position, true);
            },
            None => {
                let random_pos = generate_random_map_position();
                physics::set_rigid_body_translation(&self.generic_entity.uid, &random_pos, true);
            }
        };

        let respawned_packet = encode_rpc::RpcPacket::Respawned(encode_rpc_types::Respawned::RespawnedRpc {});

        ws_server::send_ws_message(self.generic_entity.uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(respawned_packet));
    }

    pub fn take_damage(&self, mut damage: u16, entity: &EntityTypeEnum) -> u16 {
        let tick_number = CONFIG.with(|c| c.borrow().tick_number);

        let mut damage_taken = 0;

        if self.invulnerable == true || self.dead == true {
            return 0;
        }

        let mut self_health = self.health;
        let mut self_zombie_shield_health = self.zombie_shield_health;

        match entity {
            // Zombies damage the shield first
            &EntityTypeEnum::Zombie(_) => {
                if self.zombie_shield_health > 0 {
                    // Damage gets dealt to the shield first, then the player's health
                    if damage > self.zombie_shield_health {
                        damage -= self.zombie_shield_health;
                        damage_taken += self.zombie_shield_health;

                        self_zombie_shield_health = 0;
                    } else {
                        self_zombie_shield_health -= damage;
                        damage_taken += damage;

                        damage = 0;
                    }
                }
            }
            _ => {}
        }

        if damage > self_health {
            damage_taken += self_health;
            self_health = 0;
        } else {
            self_health -= damage;
            damage_taken += damage;
        }

        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let self_entity = entities.get_mut(&self.generic_entity.uid).unwrap();

            let EntityTypeEnum::Player(self_entity) = self_entity else {
                unreachable!();
            };

            if self_health != self_entity.health {
                self_entity.health = self_health;
                manager::flag_property_as_changed(self.generic_entity.uid, "health");
            }

            if self_zombie_shield_health != self_entity.zombie_shield_health {
                self_entity.zombie_shield_health = self_zombie_shield_health;
                manager::flag_property_as_changed(self.generic_entity.uid, "zombie_shield_health");
            }

            if damage_taken > 0 {
                self_entity.last_damaged_tick = tick_number;
                manager::flag_property_as_changed(self.generic_entity.uid, "last_damaged_tick");
            }

            if self_entity.health <= 0 {
                self_entity.die(DeathReasons::Killed);
            }
        });

        damage_taken
    }
}

impl generic_entity::EntityTrait for Player {
    fn on_die(&self) {}
}

impl Player {
    pub fn apply_inputs(&self, input_packet: &decode::InputPacket) {
        manager::with_entity(self.generic_entity.uid, |entity| {
            let EntityTypeEnum::Player(player_entity) = entity else {
                panic!("Expected a Player entity, but got a different type");
            };

            if let Some(mouse_x) = input_packet.x {
                player_entity.inputs.mouse_x = mouse_x;
            }
            if let Some(mouse_y) = input_packet.y {
                player_entity.inputs.mouse_y = mouse_y;
            }
            if let Some(mut mouse_yaw) = input_packet.mouse_yaw {
                mouse_yaw = mouse_yaw.clamp(0, 359);

                player_entity.inputs.mouse_yaw = mouse_yaw;
            }
            if let Some(mouse_down) = input_packet.mouse_down {
                player_entity.inputs.mouse_down = mouse_down;
            }
            if let Some(space) = input_packet.space {
                if space == true {
                    if player_entity.inputs.mouse_down == false {
                        player_entity.inputs.mouse_down = true;
                        player_entity.inputs.false_space_reading = false;
                    }
                } else {
                    if player_entity.inputs.false_space_reading == true {
                        player_entity.inputs.mouse_down = false;
                    } else {
                        player_entity.inputs.false_space_reading = true;
                    }
                }
            }
            if let Some(x_movement) = input_packet.x_movement {
                player_entity.inputs.x_movement = x_movement;
                player_entity.inputs.is_moving = true;
            }
            if let Some(y_movement) = input_packet.y_movement {
                player_entity.inputs.y_movement = y_movement;
                player_entity.inputs.is_moving = true;
            }

            if player_entity.inputs.y_movement < 0 && player_entity.inputs.x_movement > 0 {
                player_entity.yaw = 45;
            } else if player_entity.inputs.y_movement > 0 && player_entity.inputs.x_movement > 0 {
                player_entity.yaw = 135;
            } else if player_entity.inputs.y_movement < 0 && player_entity.inputs.x_movement < 0 {
                player_entity.yaw = 315;
            } else if player_entity.inputs.y_movement > 0 && player_entity.inputs.x_movement < 0 {
                player_entity.yaw = 225;
            } else if player_entity.inputs.y_movement < 0 && player_entity.inputs.x_movement == 0 {
                player_entity.yaw = 0;
            } else if player_entity.inputs.y_movement > 0 && player_entity.inputs.x_movement == 0 {
                player_entity.yaw = 180;
            } else if player_entity.inputs.x_movement > 0 && player_entity.inputs.y_movement == 0 {
                player_entity.yaw = 90;
            } else if player_entity.inputs.x_movement < 0 && player_entity.inputs.y_movement == 0 {
                player_entity.yaw = 270;
            }

            if player_entity.inputs.x_movement == 0 && player_entity.inputs.y_movement == 0 {
                player_entity.inputs.is_moving = false;
            } else {
                player_entity.inputs.is_moving = true;
            }
        });
    }

    pub fn set_property(&self, property_name: &str, value: Box<dyn Any>) {
        manager::with_entity(self.generic_entity.uid, |entity| {
            let EntityTypeEnum::Player(player_entity) = entity else {
                panic!("Expected a Player entity, but got a different type");
            };

            // this boolean is only used with variables that should be tracked to be sent to the client
            let mut should_update_client: bool = false;

            match property_name {
                "position" => {
                    if let Some(position) = value.downcast_ref::<Position>() {
                        player_entity.generic_entity.position = *position;

                        should_update_client = true;
                    }
                }
                "dead" => {
                    if let Some(dead) = value.downcast_ref::<bool>() {
                        player_entity.dead = *dead;

                        should_update_client = true;
                    }
                }
                "health" => {
                    if let Some(health) = value.downcast_ref::<u16>() {
                        player_entity.health = *health;

                        should_update_client = true;
                    }
                }
                "name" => {
                    if let Some(name_value) = value.downcast_ref::<String>() {
                        player_entity.name = name_value.to_string();

                        should_update_client = true;
                    }
                }
                "last_player_damages" => {
                    if let Ok(last_player_damages) = value.downcast::<Vec<(Position, u16)>>() {
                        player_entity.last_player_damages = *last_player_damages;

                        should_update_client = true;
                    }
                }
                "visible_entities" => {
                    if let Some(visible_entities) = value.downcast_ref::<Vec<u16>>() {
                        player_entity.visible_entities = visible_entities.to_owned();
                    }
                }
                "last_visible_entities" => {
                    if let Some(last_visible_entities) = value.downcast_ref::<Vec<u16>>() {
                        player_entity.last_visible_entities = last_visible_entities.to_owned();
                    }
                }
                "equipped_item" => {
                    if let Some(equipped_item) = value.downcast_ref::<Equippables>() {
                        match equipped_item {
                            Equippables::MeleeHarvestingTool(item) => {
                                player_entity.equipped_item =
                                    Equippables::MeleeHarvestingTool(item.clone())
                            }
                            Equippables::MeleeWeapon(item) => {
                                player_entity.equipped_item = Equippables::MeleeWeapon(item.clone())
                            }
                            Equippables::RangedWeapon(item) => {
                                player_entity.equipped_item =
                                    Equippables::RangedWeapon(item.clone())
                            }
                            Equippables::ZombieShield(item) => {
                                player_entity.equipped_item =
                                    Equippables::ZombieShield(item.clone())
                            }
                        }
                    }
                }
                "firing_tick" => {
                    if let Some(firing_tick) = value.downcast_ref::<u32>() {
                        player_entity.firing_tick = *firing_tick;

                        should_update_client = true;
                    }
                }
                "aiming_yaw" => {
                    if let Some(aiming_yaw) = value.downcast_ref::<u16>() {
                        player_entity.aiming_yaw = *aiming_yaw;

                        should_update_client = true;
                    }
                }
                "wood" | "stone" | "gold" | "tokens" => {
                    if let Some(resource) = value.downcast_ref::<f32>() {
                        match property_name {
                            "wood" => player_entity.wood = *resource,
                            "stone" => player_entity.stone = *resource,
                            "gold" => player_entity.gold = *resource,
                            "tokens" => player_entity.tokens = *resource,
                            _ => unreachable!(),
                        }

                        should_update_client = true;
                    }
                }
                "party_id" => {
                    if let Some(party_id) = value.downcast_ref::<u32>() {
                        player_entity.party_id = *party_id;

                        should_update_client = true;
                    }
                }
                "party_request_sent_tick" => {
                    if let Some(party_request_sent_tick) = value.downcast_ref::<Option<u32>>() {
                        player_entity.party_request_sent_tick = *party_request_sent_tick;
                    }
                }
                "party_request_id" => {
                    if let Some(party_request_id) = value.downcast_ref::<Option<u32>>() {
                        player_entity.party_request_id = *party_request_id;
                    }
                }
                "can_sell" => {
                    if let Some(can_sell) = value.downcast_ref::<bool>() {
                        player_entity.can_sell = *can_sell;
                    }
                }
                "can_place" => {
                    if let Some(can_place) = value.downcast_ref::<bool>() {
                        player_entity.can_place = *can_place;
                    }
                }
                "invulnerable" => {
                    if let Some(invulnerable) = value.downcast_ref::<bool>() {
                        player_entity.invulnerable = *invulnerable;

                        should_update_client = true;
                    }
                }
                "can_building_walk" => {
                    if let Some(can_building_walk) = value.downcast_ref::<bool>() {
                        player_entity.can_building_walk = *can_building_walk;
                    }
                }
                "out_of_sync" => {
                    if let Some(out_of_sync) = value.downcast_ref::<bool>() {
                        player_entity.out_of_sync = *out_of_sync;
                    }
                }
                "owned_items" => {
                    if let Some(owned_items) = value.downcast_ref::<Vec<Equippables>>() {
                        player_entity.owned_items = owned_items.clone();
                    }
                }
                "weapon_name" => {
                    if let Some(weapon_name) = value.downcast_ref::<String>() {
                        player_entity.weapon_name = weapon_name.clone();

                        should_update_client = true;
                    }
                }
                "weapon_tier" => {
                    if let Some(weapon_tier) = value.downcast_ref::<u8>() {
                        player_entity.weapon_tier = *weapon_tier;

                        should_update_client = true;
                    }
                }
                "zombie_shield_health" => {
                    if let Some(zombie_shield_health) = value.downcast_ref::<u16>() {
                        player_entity.zombie_shield_health = *zombie_shield_health;

                        should_update_client = true;
                    }
                }
                "zombie_shield_max_health" => {
                    if let Some(zombie_shield_max_health) = value.downcast_ref::<u16>() {
                        player_entity.zombie_shield_max_health = *zombie_shield_max_health;

                        should_update_client = true;
                    }
                }
                "wave" => {
                    if let Some(wave) = value.downcast_ref::<u32>() {
                        player_entity.wave = *wave;

                        should_update_client = true;
                    }
                }
                _ => panic!("Unknown property '{}'", property_name),
            }

            if should_update_client == true {
                manager::flag_property_as_changed(self.generic_entity.uid, property_name);
            }
        })
    }

    pub fn on_tick(&mut self, tick_number: u32) {
        // Updating wave
        PARTIES.with(|p| {
            let parties = p.borrow();
            let party = parties.get(&self.party_id).unwrap();

            let wave = match party.primary_building_uid {
                Some(uid) => {
                    ENTITIES.with(|e| {
                        let entities = e.borrow();
                        let primary_building = entities.get(&uid).unwrap();
    
                        let EntityTypeEnum::Factory(primary_building) = primary_building else {
                            unreachable!();
                        };
    
                        primary_building.wave
                    })
                },
                None => 0
            };
    
            self.set_property("wave", Box::new(wave));
        });

        if self.dead == true {
            return;
        }

        let config = CONFIG.with(|config| config.borrow().clone());

        if self.invulnerable == true {
            if tick_number - self.invulnerability_start_tick > INVULNERABILITY_DURATION_MS / config.tick_rate as u32 {
                // Only applies to this clone of the player
                self.invulnerable = false;
                self.can_building_walk = false;

                self.set_property("invulnerable", Box::new(false));
                self.set_property("can_building_walk", Box::new(false));
            }
        }

        // Mouse angle
        if self.inputs.mouse_yaw != self.aiming_yaw {
            self.set_property("aiming_yaw", Box::new(self.inputs.mouse_yaw));
        }

        // Movement
        if self.inputs.is_moving {
            let yaw_f32 = self.yaw as f32;

            let player_speed = 12_000.0f32 / PIXEL_TO_WORLD as f32;

            let x_impulse = (yaw_f32 * PI / 180.0).sin() * player_speed / 1000.0 * config.tick_rate as f32;
            let y_impulse = (yaw_f32 * PI / 180.0).cos() * player_speed / 1000.0 * config.tick_rate as f32;

            let impulse = vector![x_impulse, -y_impulse];

            physics::apply_impulse_to_body(&self.generic_entity.uid, impulse, true);
        }

        // Action timers
        for (timer_type, action_timer) in self.action_timers.iter() {
            if action_timer.timer_active == false {
                continue;
            }

            if tick_number >= action_timer.action_timeout_end_tick {
                ENTITIES.with(|e| {
                    let mut entities = e.borrow_mut();
                    let player_entity = entities.get_mut(&self.generic_entity.uid).unwrap();

                    let EntityTypeEnum::Player(player_entity) = player_entity else {
                        unreachable!();
                    };

                    let action_timer_mut = player_entity.action_timers.get_mut(timer_type).unwrap();
                    action_timer_mut.timer_active = false;
                    action_timer_mut.action_timeout_end_tick = 0;
                })
            }
        }

        // Tick waiters
        let mut tick_waiters = Vec::new();
        for tick_waiter in self.tick_waiters.iter() {
            if tick_number >= tick_waiter.end_tick {
                (tick_waiter.callback)(tick_waiter.param_u16_1, tick_waiter.param_u32_1);
            } else {
                tick_waiters.push(tick_waiter.clone());
            }
        }

        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let player_entity = entities.get_mut(&self.generic_entity.uid).unwrap();

            let EntityTypeEnum::Player(player_entity) = player_entity else {
                unreachable!();
            };

            player_entity.tick_waiters = tick_waiters;
        });

        // Using weapon
        if self.inputs.mouse_down == true {
            self.try_fire_weapon(tick_number);
        }

        // Healing
        if self.health < self.max_health {
            if tick_number - self.last_damaged_tick >= self.ticks_before_health_regen {
                let mut health = self.health + self.health_regen_per_second * config.tick_rate / 1000;

                if self.health > self.max_health {
                    health = self.max_health;
                }

                self.set_property("health", Box::new(health));
            }
        }

        if self.zombie_shield_max_health > 0 {
            if self.zombie_shield_health < self.zombie_shield_max_health {
                // Find the armour info
                for item in self.owned_items.iter() {
                    match item {
                        Equippables::ZombieShield(shield_info) => {
                            let ticks_before_health_regen = shield_info.ms_before_health_regen / config.tick_rate;
                            if tick_number - self.last_damaged_tick >= ticks_before_health_regen as u32 {
                                let mut health = self.zombie_shield_health + shield_info.health_regen_per_second * config.tick_rate / 1000;
            
                                if self.zombie_shield_health > self.zombie_shield_max_health {
                                    health = self.zombie_shield_max_health;
                                }
            
                                self.set_property("zombie_shield_health", Box::new(health));
                            }
                        },
                        _ => continue
                    }
                }
            }
        }
    }

    pub fn wait_ticks(&mut self, ms: u32, callback: fn(Option<u16>, Option<u32>), param_u16_1: Option<u16>, param_u32_1: Option<u32>) {
        let (tick_rate, tick_number) = CONFIG.with(|c| {
            let config = c.borrow();
            (config.tick_rate, config.tick_number)
        });

        self.tick_waiters.push(TickWaiter {
            end_tick: tick_number + ms / tick_rate as u32,
            param_u16_1,
            param_u32_1,
            callback
        });
    }

    pub fn get_visible_entities(&self) -> (Vec<u16>, Vec<u16>, Vec<u16>) {
        let vision_range = vector![1920.0 / PIXEL_TO_WORLD as f32, 1080.0 / PIXEL_TO_WORLD as f32];

        let query_shape = Cuboid::new(vision_range);
        let query_filter = QueryFilter::default();

        let estimated_entities = self.visible_entities_set.len().max(500);
        let mut uids_in_range: Vec<u16> = Vec::with_capacity(estimated_entities);
        let mut brand_new_uids_in_range: Vec<u16> = Vec::with_capacity(estimated_entities / 4);
        let mut retained_uids: Vec<u16> = Vec::with_capacity(estimated_entities);

        physics::intersections_with_shape(
            &self.generic_entity.position,
            0,
            query_shape,
            query_filter,
            |collider_handle, _rigid_body_set, _collider_set| {
                if let Some(entity_uid) = physics::get_entity_uid_from_collider_handle(collider_handle) {
                    if self.visible_entities_set.contains(&entity_uid) {
                        retained_uids.push(entity_uid);
                    } else {
                        brand_new_uids_in_range.push(entity_uid);
                    }

                    uids_in_range.push(entity_uid);
                }

                true
        });

        // Party members must always be visible to be shown on the map
        PARTIES.with(|p| {
            if let Some(player_party) = p.borrow().get(&self.party_id) {
                for &uid in &player_party.members {
                    if !uids_in_range.contains(&uid) {
                        uids_in_range.push(uid);
                    }
                }
            }
        });

        uids_in_range.sort_unstable();
        brand_new_uids_in_range.sort_unstable();
        retained_uids.sort_unstable();

        (uids_in_range, brand_new_uids_in_range, retained_uids)
    }

    pub fn send_tools_to_client(&self, owned_items: Vec<Equippables>) {
        let set_tool_packet =
            encode_rpc::RpcPacket::SetTool(encode_rpc_types::SetTool::SetToolRpc {
                equippables: owned_items,
            });

        ws_server::send_ws_message(
            self.generic_entity.uid,
            OPCODES::PacketRpc,
            encode::EncodedMessageEnum::Rpc(set_tool_packet),
        );
    }

    pub fn try_fire_weapon(&self, tick_number: u32) {
        let config = CONFIG.with(|config| config.borrow().clone());

        let ms_between_fires: u16 = match &self.equipped_item {
            Equippables::MeleeHarvestingTool(item) => item.ms_between_fires,
            Equippables::MeleeWeapon(item) => item.ms_between_fires,
            Equippables::RangedWeapon(item) => item.ms_between_fires,
            Equippables::ZombieShield(_) => unreachable!(),
        };

        if tick_number - self.firing_tick > (ms_between_fires / config.tick_rate) as u32 {
            self.set_property("firing_tick", Box::new(tick_number));
        } else {
            return;
        }

        match &self.equipped_item {
            Equippables::MeleeHarvestingTool(item) => {
                self.fire_melee_harvesting_tool(tick_number, &item);
            }
            Equippables::MeleeWeapon(item) => {
                self.fire_melee_weapon(tick_number, &item);
            }
            Equippables::RangedWeapon(item) => {
                self.fire_ranged_weapon(tick_number, &item);
            }
            Equippables::ZombieShield(_) => unreachable!(),
        }
    }

    pub fn fire_melee_harvesting_tool(
        &self,
        tick_number: u32,
        item: &equippables::MeleeHarvestingTool,
    ) {
        let query_shape = Ball::new((self.radius as u16 + item.range) as f32 / PIXEL_TO_WORLD as f32);
        let query_filter = QueryFilter::default();

        physics::intersections_with_shape(
            &self.generic_entity.position,
            self.aiming_yaw,
            query_shape,
            query_filter,
            |collider_handle, _rigid_body_set, _collider_set| {
                let entity_uid = physics::get_entity_uid_from_collider_handle(collider_handle);

                // If there is no entity uid, the collider doesn't have a parent and may be the world boundaries
                if entity_uid.is_none() {
                    return true;
                }

                let entity_uid = entity_uid.unwrap();

                if self.generic_entity.uid == entity_uid {
                    return true;
                }

                let entity = match manager::get_entity(entity_uid).unwrap() {
                    EntityTypeEnum::Resource(resource) => resource,
                    _ => {
                        return true;
                    }
                };

                let equipped_item = match &self.equipped_item {
                    Equippables::MeleeHarvestingTool(melee_harvesting_tool) => {
                        melee_harvesting_tool
                    }
                    _ => unreachable!(),
                };

                let max_yaw_deviation = equipped_item.max_yaw_deviation;

                let angle_to_resource = self
                    .generic_entity
                    .position
                    .angle_to(&entity.generic_entity.position);

                let is_facing_resource = self.generic_entity.position.is_facing(
                    self.aiming_yaw,
                    angle_to_resource,
                    max_yaw_deviation,
                );

                if !is_facing_resource {
                    return true;
                }

                let mut resource_count: f32 = 0.0;

                manager::with_entity(self.generic_entity.uid, |player_entity| {
                    let EntityTypeEnum::Player(player_entity) = player_entity else {
                        panic!("Expected a Player entity, but got a different type");
                    };

                    resource_count = match entity.resource_type.as_str() {
                        "Tree" => player_entity.wood,
                        "Stone" => player_entity.stone,
                        _ => unreachable!(),
                    }
                });

                let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

                if matches!(game_mode, GameModes::Scarcity) {
                    resource_count = 0.0;
                }

                entity.add_hit(&(tick_number, angle_to_resource));

                match entity.resource_type.as_str() {
                    "Tree" => self.set_property(
                        "wood",
                        Box::new(resource_count + equipped_item.harvest_amount),
                    ),
                    "Stone" => self.set_property(
                        "stone",
                        Box::new(resource_count + equipped_item.harvest_amount),
                    ),
                    _ => unreachable!(),
                }

                // return true to continue searching for intersecting shapes
                true
            },
        );
    }

    pub fn fire_melee_weapon(&self, tick_number: u32, item: &equippables::MeleeWeapon) {
        let query_shape = Ball::new((self.radius + (item.range as f32)) / PIXEL_TO_WORLD as f32);
        let query_filter = QueryFilter::default();

        let mut enemy_uids: Vec<u16> = Vec::new();

        physics::intersections_with_shape(
            &self.generic_entity.position,
            self.yaw,
            query_shape,
            query_filter,
            |collider_handle, _rigid_body_set, _collider_set| {
                let entity_uid = physics::get_entity_uid_from_collider_handle(collider_handle);

                // If there is no entity uid, the collider doesn't have a parent and may be the world boundaries
                let entity_uid = match entity_uid {
                    Some(uid) => uid,
                    None => {
                        return true;
                    }
                };

                if self.generic_entity.uid == entity_uid {
                    return true;
                }

                ENTITIES.with(|e| {
                    let entities = e.borrow();

                    match entities.get(&entity_uid) {
                        Some(entity) => {
                            let angle_to_entity = self.generic_entity.position.angle_to(&entity.generic_entity().position);
    
                            let is_facing = self.generic_entity.position.is_facing(
                                self.aiming_yaw,
                                angle_to_entity,
                                item.max_yaw_deviation,
                            );
            
                            if !is_facing {
                                return;
                            };

                            if self.check_entity_is_enemy(&entity) == false {
                                return;
                            }

                            match entity {
                                EntityTypeEnum::ArrowTower(_) => {},
                                EntityTypeEnum::CannonTower(_) => {},
                                EntityTypeEnum::Door(_) => {},
                                EntityTypeEnum::Drill(_) => {},
                                EntityTypeEnum::Factory(_) => {},
                                EntityTypeEnum::Harvester(_) => {},
                                EntityTypeEnum::LargeWall(_) => {},
                                EntityTypeEnum::LightningTower(_) => {},
                                EntityTypeEnum::MageTower(_) => {},
                                EntityTypeEnum::RocketTower(_) => {},
                                EntityTypeEnum::SawTower(_) => {},
                                EntityTypeEnum::Wall(_) => {},
                                EntityTypeEnum::Zombie(_) => {},
                                EntityTypeEnum::Player(_) => {},
                                _ => {
                                    return;
                                }
                            }

                            enemy_uids.push(entity_uid);
                        }
                        None => {}
                    };
                });

                true
        });
    
        if enemy_uids.len() <= 0 {
            return;
        }
    
        self.set_property("firing_tick", Box::new(tick_number));

        let mut player_damages = self.last_player_damages.clone();

        for enemy_uid in enemy_uids {
            self.attack_with_melee_weapon(enemy_uid, item, &mut player_damages);
        }

        self.set_property("last_player_damages", Box::new(player_damages));
    }

    pub fn attack_with_melee_weapon(&self, enemy_uid: u16, item: &equippables::MeleeWeapon, player_damages: &mut Vec<(Position, u16)>) {
        let (position, damage_dealt) = ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let mut enemy_entity = entities.get_mut(&enemy_uid).unwrap().clone();

            drop(entities);

            let damage_dealt = match enemy_entity {
                EntityTypeEnum::ArrowTower(_) |
                EntityTypeEnum::CannonTower(_) |
                EntityTypeEnum::Door(_) |
                EntityTypeEnum::Drill(_) |
                EntityTypeEnum::Factory(_) |
                EntityTypeEnum::Harvester(_) |
                EntityTypeEnum::LargeWall(_) |
                EntityTypeEnum::LightningTower(_) |
                EntityTypeEnum::MageTower(_) |
                EntityTypeEnum::RocketTower(_) |
                EntityTypeEnum::SawTower(_) |
                EntityTypeEnum::Wall(_) => self.damage_building_with_melee_weapon(&mut enemy_entity, item),
                EntityTypeEnum::Player(ref mut player_entity) => self.damage_player_with_melee_weapon(player_entity, item),
                EntityTypeEnum::Zombie(ref mut zombie_entity) => self.damage_zombie_with_melee_weapon(zombie_entity, item),
                _ => 0
            };

            (enemy_entity.generic_entity().position.clone(), damage_dealt)
        });

        player_damages.push((position, damage_dealt));

        // if damage_dealt <= 0 {
        //     return;
        // }
    }

    pub fn damage_building_with_melee_weapon(&self, entity: &mut EntityTypeEnum, item: &equippables::MeleeWeapon) -> u16 {
        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        // PvP is disabled in Scarcity
        if matches!(game_mode, GameModes::Scarcity) {
            return 0;
        }

        let self_damage_percent: f32 = (item.damage_to_buildings as f32) / 100.0;

        let self_entity = EntityTypeEnum::Player(self.clone());

        match entity {
            EntityTypeEnum::ArrowTower(entity) => entity.take_damage((self_damage_percent * entity.ranged_building.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::CannonTower(entity) => entity.take_damage((self_damage_percent * entity.ranged_building.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::Door(entity) => entity.take_damage((self_damage_percent * entity.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::Drill(entity) => entity.take_damage((self_damage_percent * entity.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::Factory(entity) => entity.take_damage((self_damage_percent * entity.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::Harvester(entity) => entity.take_damage((self_damage_percent * entity.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::LargeWall(entity) => entity.take_damage((self_damage_percent * entity.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::LightningTower(entity) => entity.take_damage((self_damage_percent * entity.ranged_building.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::MageTower(entity) => entity.take_damage((self_damage_percent * entity.ranged_building.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::RocketTower(entity) => entity.take_damage((self_damage_percent * entity.ranged_building.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::SawTower(entity) => entity.take_damage((self_damage_percent * entity.ranged_building.base_building.max_health as f32) as u16, &self_entity),
            EntityTypeEnum::Wall(entity) => entity.take_damage((self_damage_percent * entity.base_building.max_health as f32) as u16, &self_entity),
            _ => unreachable!()
        }
    }

    pub fn damage_player_with_melee_weapon(&self, player_entity: &mut Player, item: &equippables::MeleeWeapon) -> u16 {
        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        // PvP is disabled in Scarcity
        if matches!(game_mode, GameModes::Scarcity) {
            return 0;
        }

        let self_entity = EntityTypeEnum::Player(self.clone());

        player_entity.take_damage(item.damage_to_players, &self_entity)
    }

    pub fn damage_zombie_with_melee_weapon(&self, zombie_entity: &mut Zombie, item: &equippables::MeleeWeapon) -> u16 {
        let self_entity = EntityTypeEnum::Player(self.clone());

        zombie_entity.take_damage(item.damage_to_zombies, &self_entity)
    }

    pub fn fire_ranged_weapon(&self, tick_number: u32, item: &equippables::RangedWeapon) {
        let tick_rate = CONFIG.with(|c| c.borrow().tick_rate);

        let projectile_lifetime_ticks = (item.projectile_lifetime / tick_rate) as u32;

        let projectile_speed = item.projectile_speed as f32;

        let projectile_velocity= vector![
            (self.aiming_yaw as f32 * PI / 180.0).sin() * projectile_speed,
            -(self.aiming_yaw as f32 * PI / 180.0).cos() * projectile_speed
        ];

        let mut projectile_position = self.generic_entity.position.clone();
        
        let x_offset = (self.aiming_yaw as f32 * PI / 180.0).sin() * 64.0;
        let y_offset = -(self.aiming_yaw as f32 * PI / 180.0).cos() * 64.0;

        if x_offset > 0.0 {
            projectile_position.x += x_offset as i16;
        } else {
            projectile_position.x -= x_offset.abs() as i16;
        }

        if y_offset > 0.0 {
            projectile_position.y += y_offset as i16;
        } else {
            projectile_position.y -= y_offset.abs() as i16;
        }

        manager::create_entity(AllEntityTypesEnum::Projectile, None, projectile_position, self.aiming_yaw, Some(|entity: EntityTypeEnum| {
            let mut projectile = match entity {
                EntityTypeEnum::Projectile(entity) => entity,
                _ => unreachable!()
            };

            projectile.generic_entity.model = match item.name {
                "Crossbow" => "ArrowProjectile".to_owned(),
                "Dynamite" => "DynamiteProjectile".to_owned(),
                _ => unreachable!()
            };

            projectile.projectile_type = match item.name {
                "Crossbow" => ProjectileTypeEnum::PlayerArrow,
                "Dynamite" => ProjectileTypeEnum::PlayerDynamite,
                _ => unreachable!()
            };

            projectile.death_tick = tick_number + projectile_lifetime_ticks;
            projectile.velocity = projectile_velocity;
            projectile.tier = item.tier;
            projectile.party_id = self.party_id;
            projectile.damage_to_players = item.damage_to_players;
            projectile.damage_to_zombies = item.damage_to_zombies;
            projectile.damage_to_buildings = item.damage_to_buildings;
            projectile.knockback_distance = item.projectile_entity_knockback;
            projectile.aoe_range = item.projectile_aoe_range;
            projectile.parent_uid = self.generic_entity.uid;

            projectile.initialise_physics(tick_number);

            EntityTypeEnum::Projectile(projectile)
        }));
    }

    pub fn check_entity_is_enemy(&self, entity: &EntityTypeEnum) -> bool {
        match &entity {
            &EntityTypeEnum::Player(entity) => {
                if entity.party_id == self.party_id {
                    return false;
                } else {
                    return true;
                }
            },
            &EntityTypeEnum::Zombie(_entity) => {
                return true;
            }
            &EntityTypeEnum::ArrowTower(_) |
            &EntityTypeEnum::CannonTower(_) |
            &EntityTypeEnum::Door(_) |
            &EntityTypeEnum::Drill(_) |
            &EntityTypeEnum::Factory(_) |
            &EntityTypeEnum::Harvester(_) |
            &EntityTypeEnum::LargeWall(_) |
            &EntityTypeEnum::LightningTower(_) |
            &EntityTypeEnum::MageTower(_) |
            &EntityTypeEnum::RocketTower(_) |
            &EntityTypeEnum::SawTower(_) |
            &EntityTypeEnum::Wall(_) => {
                let party_id = match &entity {
                    &EntityTypeEnum::ArrowTower(entity) => entity.ranged_building.base_building.party_id,
                    &EntityTypeEnum::CannonTower(entity) => entity.ranged_building.base_building.party_id,
                    &EntityTypeEnum::Door(entity) => entity.base_building.party_id,
                    &EntityTypeEnum::Drill(entity) => entity.base_building.party_id,
                    &EntityTypeEnum::Factory(entity) => entity.base_building.party_id,
                    &EntityTypeEnum::Harvester(entity) => entity.base_building.party_id,
                    &EntityTypeEnum::LargeWall(entity) => entity.base_building.party_id,
                    &EntityTypeEnum::LightningTower(entity) => entity.ranged_building.base_building.party_id,
                    &EntityTypeEnum::MageTower(entity) => entity.ranged_building.base_building.party_id,
                    &EntityTypeEnum::RocketTower(entity) => entity.ranged_building.base_building.party_id,
                    &EntityTypeEnum::SawTower(entity) => entity.ranged_building.base_building.party_id,
                    &EntityTypeEnum::Wall(entity) => entity.base_building.party_id,
                    _ => unreachable!()
                };

                if party_id == self.party_id {
                    return false;
                } else {
                    return true;
                }
            },
            _ => return false,
        }
    }

    pub fn can_afford(&self, resource_costs: &ResourceCosts) -> bool {
        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        if matches!(game_mode, GameModes::Scarcity) {
            let (wood, stone, gold) = PARTIES.with(|p| {
                let parties = p.borrow();
                let party = parties.get(&self.party_id).unwrap();

                (party.resources.wood, party.resources.stone, party.resources.gold)
            });

            if wood < resource_costs.wood_costs {
                return false;
            }
    
            if stone < resource_costs.stone_costs {
                return false;
            }
    
            if gold < resource_costs.gold_costs {
                return false;
            }

            // TODO this doesn't check tokens, not sure if it needs to

            return true;
        }

        if self.wood < resource_costs.wood_costs {
            return false;
        }

        if self.stone < resource_costs.stone_costs {
            return false;
        }

        if self.gold < resource_costs.gold_costs {
            return false;
        }

        if self.tokens < resource_costs.tokens_costs {
            return false;
        }

        true
    }

    pub fn deduct_resource_costs(&self, resources_costs: &ResourceCosts) {
        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        if matches!(game_mode, GameModes::Scarcity) {
            let member_uids = PARTIES.with(|p| {
                let mut parties = p.borrow_mut();
                let party = parties.get_mut(&self.party_id).unwrap();

                party.resources.gold -= resources_costs.gold_costs;
                party.resources.wood -= resources_costs.wood_costs;
                party.resources.stone -= resources_costs.stone_costs;

                party.members.clone()
            });

            for member_uid in member_uids.iter() {
                manager::flag_property_as_changed(*member_uid, "gold");
                manager::flag_property_as_changed(*member_uid, "stone");
                manager::flag_property_as_changed(*member_uid, "wood");
            }

            return;
        }

        self.set_property("gold", Box::new(self.gold - resources_costs.gold_costs));
        self.set_property("wood", Box::new(self.wood - resources_costs.wood_costs));
        self.set_property("stone", Box::new(self.stone - resources_costs.stone_costs));
        self.set_property(
            "tokens",
            Box::new(self.tokens - resources_costs.tokens_costs),
        );
    }
}
