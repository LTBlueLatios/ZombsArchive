use std::cell::RefCell;

use crate::entity_manager::entity_types::generic_entity::Position;
use crate::entity_manager::manager::ENTITIES;
use crate::{network::ws_server, CONFIG};

use crate::network::{encode_rpc_types, OPCODES};
use crate::network::encode;
use crate::network::encode_rpc;
use crate::network::encode_rpc_types::PartyBuilding;
use crate::{manager, GameModes};
use crate::entity_manager::entity_types::EntityTypeEnum;

thread_local! {
    pub static PARTY_ID_COUNTER: RefCell<u32> = RefCell::new(0);
}

#[derive(Debug, Clone)]
pub struct Resources {
    pub gold: f32,
    pub wood: f32,
    pub stone: f32
}

#[derive(Debug, Clone)]
pub struct BuildingCount {
    pub wall: u16,
    pub large_wall: u16,
    pub door: u16,
    pub spike_trap: u16,
    pub lightning_tower: u16,
    pub arrow_tower: u16,
    pub cannon_tower: u16,
    pub saw_tower: u16,
    pub rocket_tower: u16,
    pub mage_tower: u16,
    pub drill: u16,
    pub harvester: u16,
}

#[derive(Debug, Clone)]
pub struct Party {
    pub name: String,
    pub leader_uid: u16,
    pub id: u32,
    pub is_open: bool,
    pub member_count: u8,
    pub member_limit: u8,
    pub key: String,
    pub members: Vec<u16>,

    pub buildings: Vec<u16>,
    pub primary_building_uid: Option<u16>,
    pub building_counts: BuildingCount,

    pub resources: Resources
}

impl Party {
    pub fn new(leader_uid: u16) -> Self {
        let member_limit = CONFIG.with(|config| config.borrow().max_party_member_count);

        let party_id = PARTY_ID_COUNTER.with(|counter| {
            let mut counter = counter.borrow_mut();

            *counter += 1;

            *counter
        });

        let mut party_instance = Party {
            name: std::format!("Party-{party_id}"),
            leader_uid,
            id: party_id,
            is_open: true,
            member_count: 0,
            member_limit: member_limit,
            key: "".to_string(),
            members: Vec::new(),
            buildings: Vec::new(),
            primary_building_uid: None,
            building_counts: BuildingCount {
                wall: 0,
                large_wall: 0,
                door: 0,
                spike_trap: 0,
                lightning_tower: 0,
                arrow_tower: 0,
                cannon_tower: 0,
                saw_tower: 0,
                rocket_tower: 0,
                mage_tower: 0,
                drill: 0,
                harvester: 0
            },
            resources: Resources {
                gold: 0.0,
                stone: 0.0,
                wood: 0.0
            }
        };

        party_instance.generate_key();

        party_instance.add_member(leader_uid).expect("Failed to add member to party!");

        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        if game_mode == GameModes::Scarcity {
            party_instance.set_scarcity_resources();
        }

        return party_instance;
    }

    fn set_scarcity_resources(&mut self) {
        self.resources.gold = 700000.0;
        self.resources.stone = 50000.0;
        self.resources.wood = 50000.0;
    }

    pub fn generate_key(&mut self) {
        let key_length = 20;

        let charset = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

        self.key = random_string::generate(key_length, charset);

        for uid in self.members.iter() {
            self.send_key_to_member(*uid);
        }
    }

    fn send_key_to_member(&self, member_uid: u16) {
        let party_key_packet = encode_rpc::RpcPacket::PartyKey(encode_rpc_types::PartyKey::PartyKeyRpc {
            party_key: self.key.clone()
        });

        ws_server::send_ws_message(member_uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(party_key_packet));
    }

    pub fn update_buildings(&mut self, building_uids: Vec<(u16, bool)>) {
        let mut buildings_to_send: Vec<PartyBuilding::Building> = Vec::new();

        for building in building_uids.iter() {
            let building_dead = building.1;
            let mut building_was_upgraded = false;

            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();

                let building_entity = entities.get_mut(&building.0).unwrap();

                if building_dead == true {
                    self.buildings.retain(|&x| x != building.0);

                } else if building_dead == false {
                    if self.buildings.contains(&building.0) == false {
                        self.buildings.push(building.0);

                        match building_entity {
                            EntityTypeEnum::ArrowTower(ref mut entity) => {
                                entity.ranged_building.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::CannonTower(ref mut entity) => {
                                entity.ranged_building.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::MageTower(ref mut entity) => {
                                entity.ranged_building.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::RocketTower(ref mut entity) => {
                                entity.ranged_building.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::LightningTower(ref mut entity) => {
                                entity.ranged_building.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::SawTower(ref mut entity) => {
                                entity.ranged_building.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::Factory(ref mut entity) => {
                                entity.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::Wall(ref mut entity) => {
                                entity.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::LargeWall(ref mut entity) => {
                                entity.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::Door(ref mut entity) => {
                                entity.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::SpikeTrap(ref mut entity) => {
                                entity.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::Drill(ref mut entity) => {
                                entity.base_building.party_id = self.id;
                            },
                            EntityTypeEnum::Harvester(ref mut entity) => {
                                entity.base_building.party_id = self.id;
                            },
                            _ => unreachable!()
                        }
                    } else {
                        building_was_upgraded = true;
                    }

                    // If the buildings vector DOES contain the building uid and the building is not dead, this function is being ran because the building was upgraded
                    // so we need to inform the party members of the update
                }

                let building_tier: u8;
                let building_yaw: u16;

                match &building_entity {
                    EntityTypeEnum::ArrowTower(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.arrow_tower -= 1;
                            } else {
                                self.building_counts.arrow_tower += 1;
                            }
                        }

                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::CannonTower(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.cannon_tower -= 1;
                            } else {
                                self.building_counts.cannon_tower += 1;
                            }
                        }

                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::MageTower(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.mage_tower -= 1;
                            } else {
                                self.building_counts.mage_tower += 1;
                            }
                        }

                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::RocketTower(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.rocket_tower -= 1;
                            } else {
                                self.building_counts.rocket_tower += 1;
                            }
                        }

                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::LightningTower(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.lightning_tower -= 1;
                            } else {
                                self.building_counts.lightning_tower += 1;
                            }
                        }

                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::SawTower(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.saw_tower -= 1;
                            } else {
                                self.building_counts.saw_tower += 1;
                            }
                        }

                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::Factory(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.primary_building_uid = None;
                            } else {
                                self.primary_building_uid = Some(building.0);
                            }
                        }

                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::Wall(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.wall -= 1;
                            } else {
                                self.building_counts.wall += 1;
                            }
                        }

                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::LargeWall(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.large_wall -= 1;
                            } else {
                                self.building_counts.large_wall += 1;
                            }
                        }

                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::Door(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.door -= 1;
                            } else {
                                self.building_counts.door += 1;
                            }
                        }

                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::SpikeTrap(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.spike_trap -= 1;
                            } else {
                                self.building_counts.spike_trap += 1;
                            }
                        }

                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::Drill(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.drill -= 1;
                            } else {
                                self.building_counts.drill += 1;
                            }
                        }

                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::Harvester(entity) => {
                        if building_was_upgraded == false {
                            if building_dead == true {
                                self.building_counts.harvester -= 1;
                            } else {
                                self.building_counts.harvester += 1;
                            }
                        }

                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    _ => unreachable!()
                };

                buildings_to_send.push(PartyBuilding::Building {
                    dead: building_dead,
                    tier: building_tier,
                    model: building_entity.generic_entity().model.clone(),
                    uid: building.0,
                    position: building_entity.generic_entity().position,
                    yaw: building_yaw
                });

                let building_entity = building_entity.clone();
                drop(entities);

                if building_was_upgraded == false {
                    // update_party_building will only be called on buildings that were created or destroyed, not upgraded
                    match self.primary_building_uid {
                        Some(uid) => {
                            let entities = e.borrow();

                            let mut building_positions: Vec<Position> = Vec::new();

                            for building_uid in self.buildings.iter() {
                                let building_entity = entities.get(building_uid).unwrap();

                                if ["Factory", "Harvester", "SpikeTrap"].contains(&building_entity.generic_entity().model.as_str()) {
                                    continue;
                                }

                                building_positions.push(building_entity.generic_entity().position.clone());
                            }

                            drop(entities);

                            let mut entities = e.borrow_mut();

                            let primary_entity = entities.get_mut(&uid).unwrap();
        
                            let EntityTypeEnum::Factory(ref mut factory_entity) = primary_entity else {
                                unreachable!();
                            };
        
                            factory_entity.update_party_building(building_positions, &building_entity, building_dead);
                        }
                        None => {}
                    }
                }
            });
        };

        for uid in self.members.iter() {
            let party_building_packet = encode_rpc::RpcPacket::PartyBuilding(encode_rpc_types::PartyBuilding::PartyBuildingRpc {
                buildings: buildings_to_send.clone()
            });
            ws_server::send_ws_message(*uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(party_building_packet));
        }
    }

    fn send_member_list_to_all_members(&mut self) {
        use encode_rpc_types::PartyMembersUpdated::PartyMember;

        let mut member_list: Vec<PartyMember> = Vec::new();

        for member_uid in self.members.iter() {
            let entity = manager::get_entity(*member_uid).unwrap();

            let EntityTypeEnum::Player(player_entity) = entity else {
                panic!("Expected a Player entity, but got a different type");
            };

            member_list.push(PartyMember {
                can_place: player_entity.can_place,
                can_sell: player_entity.can_sell,
                name: player_entity.name.clone(),
                uid: *member_uid,
                is_leader: self.leader_uid == *member_uid
            })
        }

        for uid in self.members.iter() {
            let member_list_packet = encode_rpc::RpcPacket::PartyMembersUpdated(encode_rpc_types::PartyMembersUpdated::PartyMembersUpdatedRpc {
                member_list: member_list.clone()
            });
            ws_server::send_ws_message(*uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(member_list_packet));
        }
    }

    // Returns whether or not the member was successfully added
    pub fn add_member(&mut self, player_uid: u16) -> Result<bool, &str> {
        if self.member_count >= self.member_limit {
            return Err("Party is full!");
        }

        let entity = manager::get_entity(player_uid).unwrap();

        let EntityTypeEnum::Player(player_entity) = entity else {
            panic!("Expected a Player entity, but got a different type");
        };

        player_entity.set_property("party_id", Box::new(self.id));

        self.member_count += 1;

        self.members.push(player_uid);

        let is_leader = self.leader_uid == player_uid;

        self.set_permission("can_place", player_uid, is_leader);
        self.set_permission("can_sell", player_uid, is_leader);

        self.send_key_to_member(player_uid);
        self.send_all_buildings_to_member(player_uid, false);
        self.send_member_list_to_all_members();

        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        if matches!(game_mode, GameModes::Scarcity) {
            manager::flag_property_as_changed(player_uid, "gold");
            manager::flag_property_as_changed(player_uid, "stone");
            manager::flag_property_as_changed(player_uid, "wood");
        }

        let active_spells = match self.primary_building_uid {
            Some(uid) => {
                ENTITIES.with(|e| {
                    let entities = e.borrow();
                    let primary_entity = entities.get(&uid).unwrap();

                    let EntityTypeEnum::Factory(primary_entity) = primary_entity else {
                        unreachable!();
                    };

                    let mut active_spells = Vec::new();

                    if primary_entity.timeout_info.timer_active == true {
                        active_spells.push(primary_entity.timeout_info.clone());
                    }

                    if primary_entity.rapidfire_info.timer_active == true {
                        active_spells.push(primary_entity.rapidfire_info.clone());
                    }

                    Some(active_spells)
                })
            },
            None => None
        };

        match active_spells {
            Some(spells) => {
                let (tick_number, tick_rate) = CONFIG.with(|c| {
                    let config = c.borrow();
                    (config.tick_number, config.tick_rate)
                });

                for spell in spells.iter() {
                    // The icon may have already been hidden while the cooldown is active
                    let mut ticks_to_icon_cooldown_end = 0;

                    if tick_number < spell.icon_end_tick {
                        ticks_to_icon_cooldown_end = spell.icon_end_tick - tick_number;
                    }

                    let ms_to_icon_cooldown_end = ticks_to_icon_cooldown_end * tick_rate as u32;

                    let ticks_to_cooldown_end = spell.timer_end_tick - tick_number;
                    let ms_to_cooldown_end = ticks_to_cooldown_end * tick_rate as u32;

                    let response_rpc = encode_rpc::RpcPacket::CastSpellResponse(encode_rpc_types::CastSpellResponse::CastSpellResponseRpc {
                        name: spell.spell_name.to_string(),
                        cooldown_ms: ms_to_cooldown_end,
                        icon_cooldown_ms: ms_to_icon_cooldown_end
                    });
            
                    ws_server::send_ws_message(player_uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(response_rpc));
                }
            },
            None => {}
        }

        Ok(true)
    }

    pub fn send_all_buildings_to_member(&mut self, player_uid: u16, buildings_dead: bool) {
        let mut buildings_to_send: Vec<PartyBuilding::Building> = Vec::new();

        for building_uid in self.buildings.iter() {
            manager::ENTITIES.with(|e| {
                let entities = e.borrow();
                let building_entity = entities.get(&building_uid).unwrap();

                let building_tier: u8;
                let building_yaw: u16;
    
                match &building_entity {
                    EntityTypeEnum::ArrowTower(entity) => {
                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::CannonTower(entity) => {
                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::MageTower(entity) => {
                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::RocketTower(entity) => {
                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::LightningTower(entity) => {
                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::SawTower(entity) => {
                        building_tier = entity.ranged_building.base_building.tier;
                        building_yaw = entity.ranged_building.base_building.yaw;
                    },
                    EntityTypeEnum::Wall(entity) => {
                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::LargeWall(entity) => {
                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::Door(entity) => {
                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::Drill(entity) => {
                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::Harvester(entity) => {
                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::SpikeTrap(entity) => {
                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    EntityTypeEnum::Factory(entity) => {
                        building_tier = entity.base_building.tier;
                        building_yaw = entity.base_building.yaw;
                    },
                    _ => unreachable!()
                };
    
                buildings_to_send.push(PartyBuilding::Building {
                    dead: buildings_dead,
                    tier: building_tier,
                    model: building_entity.generic_entity().model.clone(),
                    uid: *building_uid,
                    position: building_entity.generic_entity().position,
                    yaw: building_yaw
                })
            });
        };

        let party_building_packet = encode_rpc::RpcPacket::PartyBuilding(encode_rpc_types::PartyBuilding::PartyBuildingRpc {
            buildings: buildings_to_send.clone()
        });
        ws_server::send_ws_message(player_uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(party_building_packet));
    }

    pub fn remove_member(&mut self, player_uid: u16, player_socket_destroyed: bool) {
        if !self.members.contains(&player_uid) {
            return;
        }

        self.member_count -= 1;

        if let Some(pos) = self.members.iter().position(|&x| x == player_uid) {
            self.members.remove(pos);
        };

        if player_uid == self.leader_uid && self.member_count > 0 {
            self.leader_uid = self.members[0];

            self.set_permission("can_place", self.leader_uid, true);
            self.set_permission("can_sell", self.leader_uid, true);
        }

        self.send_member_list_to_all_members();

        if player_socket_destroyed == false {
            self.send_all_buildings_to_member(player_uid, true);

            let active_spells = match self.primary_building_uid {
                Some(uid) => {
                    ENTITIES.with(|e| {
                        let entities = e.borrow();
                        let primary_entity = entities.get(&uid).unwrap();
    
                        let EntityTypeEnum::Factory(primary_entity) = primary_entity else {
                            unreachable!();
                        };
    
                        let mut active_spells = Vec::new();
    
                        if primary_entity.timeout_info.timer_active == true {
                            active_spells.push("Timeout");
                        }
    
                        if primary_entity.rapidfire_info.timer_active == true {
                            active_spells.push("Rapidfire");
                        }
    
                        Some(active_spells)
                    })
                },
                None => None
            };
    
            match active_spells {
                Some(spells) => {
                    for spell in spells.iter() {
                        let response_rpc = encode_rpc::RpcPacket::ClearActiveSpell(encode_rpc_types::ClearActiveSpell::ClearActiveSpellRpc {
                            name: spell.to_string()
                        });
    
                        ws_server::send_ws_message(player_uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(response_rpc));
                    }
                },
                None => {}
            }
        }
    }

    pub fn set_permission(&mut self, permission_type: &str, uid: u16, value: bool) {
        let entity = manager::get_entity(uid).unwrap();
    
        let EntityTypeEnum::Player(player_entity) = entity else {
            panic!("Expected a Player entity, but got a different type");
        };

        match permission_type {
            "can_place" => {
                player_entity.set_property("can_place", Box::new(value));
            },
            "can_sell" => {
                player_entity.set_property("can_sell", Box::new(value));
            },
            _ => unreachable!()
        }

        self.send_member_list_to_all_members();
    }

    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }
}