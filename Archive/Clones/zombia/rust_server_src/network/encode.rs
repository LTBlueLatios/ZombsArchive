use bytebuffer::ByteBuffer;

use lazy_static::lazy_static;
use tungstenite::Message;

use crate::entity_manager::manager::MODIFIED_PROPERTIES;
use crate::{GameModes, CONFIG, PARTIES};

use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::{entity_manager::manager, network::OPCODES};

use super::encode_rpc;
use super::model_shared_props;

lazy_static! {
    pub static ref ENTITY_PROPS: Vec<String> = vec![
        "aiming_yaw".to_string(),
        "aggro_enabled".to_string(),
        "harvest_stage".to_string(),
        "dead".to_string(),
        "drone_count".to_string(),
        "entity_class".to_string(),
        "experience".to_string(),
        "firing_tick".to_string(),
        "hat_name".to_string(),
        "health".to_string(),
        "hits".to_string(),
        "target_beams".to_string(),
        "last_player_damages".to_string(),
        "last_pet_damage".to_string(),
        "last_pet_damage_target".to_string(),
        "last_pet_damage_tick".to_string(),
        "last_damaged_tick".to_string(),
        "max_health".to_string(),
        "gold".to_string(),
        "model".to_string(),
        "name".to_string(),
        "party_id".to_string(),
        "pet_uid".to_string(),
        "position".to_string(),
        "short_position".to_string(),
        "spell_type".to_string(),
        "radius".to_string(),
        "resource_pickup_type".to_string(),
        "resource_type".to_string(),
        "resource_variant".to_string(),
        "score".to_string(),
        "stone".to_string(),
        "target_resource_uid".to_string(),
        "tier".to_string(),
        "tokens".to_string(),
        "warming_up".to_string(),
        "wave".to_string(),
        "weapon_name".to_string(),
        "weapon_tier".to_string(),
        "wood".to_string(),
        "yaw".to_string(),
        "zombie_shield_health".to_string(),
        "zombie_shield_max_health".to_string(),
        "zombie_colour".to_string(),
        "scale".to_string(),
        "invulnerable".to_string()
    ];
}

#[derive(Debug)]
pub enum EnterWorldPacket {
    Allowed {
        name: String,
        uid: u16,
        tick_rate: u16,
        tick: u32,
        world_width: i16,
        world_height: i16,
        day_length_ms: u32,
        night_length_ms: u32,
        minimum_map_edge_build_distance: i16,
        max_build_distance_from_primary: i16,
        max_build_distance_from_player: i16,
        max_party_member_count: u8
    },
    Denied {
        reason: String
    }
}

#[derive(Debug)]
pub struct EntityUpdatePacket {
    pub uid: u16,
    pub average_frame_time: f64,
}

#[derive(Debug)]
pub enum EncodedMessageEnum {
    EntityUpdate(EntityUpdatePacket),
    EnterWorld(EnterWorldPacket),
    Ping,
    Rpc(encode_rpc::RpcPacket),
}

pub fn encode_message(opcode: OPCODES, data: EncodedMessageEnum) -> Message {
    let mut byte_buffer = ByteBuffer::new();

    byte_buffer.write_u8(opcode as u8);

    match data {
        EncodedMessageEnum::EnterWorld(packet) => {
            encode_enter_world(&mut byte_buffer, packet);
        }
        EncodedMessageEnum::Ping => {
            // No additional data for Ping, just the opcode
        }
        EncodedMessageEnum::EntityUpdate(packet) => {
            encode_entity_update(&mut byte_buffer, packet);
        }
        EncodedMessageEnum::Rpc(packet) => {
            encode_rpc::encode_rpc(&mut byte_buffer, packet);
        }
    }

    let message_data = byte_buffer.as_bytes();
    return Message::binary(message_data);
}

fn encode_enter_world(byte_buffer: &mut ByteBuffer, data: EnterWorldPacket) {
    match data {
        EnterWorldPacket::Allowed {
            name,
            uid,
            tick_rate,
            tick,
            world_width,
            world_height,
            day_length_ms,
            night_length_ms,
            minimum_map_edge_build_distance,
            max_build_distance_from_primary,
            max_build_distance_from_player,
            max_party_member_count
        } => {
            byte_buffer.write_u8(1); // Allowed
            byte_buffer.write_string(&name);
            byte_buffer.write_u16(uid);
            byte_buffer.write_u16(tick_rate);
            byte_buffer.write_u32(tick);
            byte_buffer.write_i16(world_width);
            byte_buffer.write_i16(world_height);
            byte_buffer.write_u32(day_length_ms / (tick_rate as u32));
            byte_buffer.write_u32(night_length_ms / (tick_rate as u32));
            byte_buffer.write_i16(minimum_map_edge_build_distance);
            byte_buffer.write_i16(max_build_distance_from_primary);
            byte_buffer.write_i16(max_build_distance_from_player);
            byte_buffer.write_u8(max_party_member_count);
        },
        EnterWorldPacket::Denied {
            reason
        } => {
            byte_buffer.write_u8(0); // Denied
            byte_buffer.write_string(&reason);
        }
    }
}

fn encode_entity_update(mut byte_buffer: &mut ByteBuffer, data: EntityUpdatePacket) {
    let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

    let (visible_entities, mut brand_new_entity_uids, mut retained_entity_uids) = manager::ENTITIES.with(|e| {
        let entities = e.borrow();

        let EntityTypeEnum::Player(player_entity) = entities.get(&data.uid).unwrap() else {
            unreachable!();
        };

        player_entity.get_visible_entities()
    });

    let last_visible_entities= manager::ENTITIES.with(|e| {
        let mut entities = e.borrow_mut();

        let EntityTypeEnum::Player(player_entity_mut) = entities.get_mut(&data.uid).unwrap() else {
            unreachable!();
        };

        let was_out_of_sync = player_entity_mut.out_of_sync;

        if was_out_of_sync == true {
            player_entity_mut.visible_entities.clear();
            brand_new_entity_uids = visible_entities.clone();
            retained_entity_uids.clear();
        }

        let last_visible_entities = std::mem::take(&mut player_entity_mut.visible_entities);

        player_entity_mut.last_visible_entities = last_visible_entities.clone();
        player_entity_mut.visible_entities = visible_entities.clone();

        player_entity_mut.visible_entities_set = player_entity_mut.visible_entities.iter().copied().collect();

        // Out of sync
        byte_buffer.write_u8(was_out_of_sync as u8);
    
        if was_out_of_sync == true {
            let tick_number = CONFIG.with(|config| config.borrow().tick_number);
    
            byte_buffer.write_u32(tick_number);
    
            player_entity_mut.out_of_sync = false;
        }

        last_visible_entities
    });

    let count_pos = byte_buffer.len();
    byte_buffer.write_u16(0); // Reserve space for removed_entity_uids count

    let mut removed_count = 0;

    // // Finding removed entities
    let mut i = 0;
    let mut j = 0;

    while i < last_visible_entities.len() {
        if j >= visible_entities.len() || last_visible_entities[i] < visible_entities[j] {
            // last_visible_entities[i] is NOT in visible_entities
            byte_buffer.write_u16(last_visible_entities[i]);
            removed_count += 1;
            i += 1;
        } else if last_visible_entities[i] > visible_entities[j] {
            // last_visible_entities[i] is greater, so visible_entities[j] was skipped
            j += 1;
        } else {
            // Both are equal -> entity still exists
            i += 1;
            j += 1;
        }
    }

    let current_pos = byte_buffer.len();

    byte_buffer.set_wpos(count_pos);
    byte_buffer.write_u16(removed_count);
    byte_buffer.set_wpos(current_pos);

    byte_buffer.write_u16(brand_new_entity_uids.len() as u16);

    let flag_bytes_len = (retained_entity_uids.len() + 7) / 8;
    let mut flag_bytes: Vec<u8> = vec![0xFF; flag_bytes_len];
    let mut bit_index = 0;

    let mut retained_entities_with_modified_properties: Vec<u16> = Vec::new();

    manager::ENTITIES.with(|e| {
        let entities = e.borrow();

        for brand_new_entity in brand_new_entity_uids.iter().filter_map(|uid| entities.get(uid)) {
            byte_buffer.write_u16(brand_new_entity.generic_entity().uid);

            let props_to_send = model_shared_props
                .get(&brand_new_entity.generic_entity().model.as_str())
                .unwrap();

            byte_buffer.write_u8(props_to_send.index);

            for prop in props_to_send.props.iter() {
                encode_entity_attribute(&mut byte_buffer, *prop, &brand_new_entity, false, &game_mode);
            }
        }

        MODIFIED_PROPERTIES.with(|mp| {
            let modified_properties = mp.borrow();

            for uid in retained_entity_uids.iter() {
                if modified_properties.contains_key(uid) {
                    retained_entities_with_modified_properties.push(*uid);

                    let byte_index = bit_index / 8;
                    let bit_position = bit_index % 8;
                    flag_bytes[byte_index] &= !(1 << bit_position);
                };

                bit_index += 1;
            }

            byte_buffer.write_u16(flag_bytes_len as u16);

            for byte in flag_bytes.iter() {
                byte_buffer.write_u8(*byte);
            }

            for retained_uid in retained_entities_with_modified_properties.iter() {
                let props_to_send = modified_properties.get(retained_uid).unwrap();

                byte_buffer.write_u8(props_to_send.len() as u8);

                let retained_entity = entities.get(retained_uid).unwrap();

                for prop in props_to_send.iter() {
                    encode_entity_attribute(byte_buffer, prop.as_str(), &retained_entity, true, &game_mode);
                }
            }
        });
    });

    byte_buffer.write_f64(data.average_frame_time);
}

pub enum PropertyNamesEnum {
    AimingYaw,
    Dead,
    DroneCount,
    FiringTick,
    Invulnerable,
    Gold,
    Wood,
    Stone,
    Tokens,
    Health,
    MaxHealth,
    LastDamagedTick,
    LastPlayerDamages,
    Name,
    PartyId,
    Position,
    Wave,
    WeaponName,
    WeaponTier,
    ZombieShieldHealth,
    ZombieShieldMaxHealth,
    Hits,
    ResourceType,
    ResourceVariant,
    AggroEnabled,
    Radius,
    TargetResourceUid,
    Tier,
    TargetBeams,
    WarmingUp,
    Yaw,
    HarvestStage,
    ResourcePickupType,
    ZombieColour,
    SpellType
}

fn property_name_str_as_variant(property_name: &str) -> PropertyNamesEnum {
    match property_name {
        "aiming_yaw" => PropertyNamesEnum::AimingYaw,
        "dead" => PropertyNamesEnum::Dead,
        "drone_count" => PropertyNamesEnum::DroneCount,
        "firing_tick" => PropertyNamesEnum::FiringTick,
        "invulnerable" => PropertyNamesEnum::Invulnerable,
        "gold" => PropertyNamesEnum::Gold,
        "wood" => PropertyNamesEnum::Wood,
        "stone" => PropertyNamesEnum::Stone,
        "tokens" => PropertyNamesEnum::Tokens,
        "health" => PropertyNamesEnum::Health,
        "max_health" => PropertyNamesEnum::MaxHealth,
        "last_damaged_tick" => PropertyNamesEnum::LastDamagedTick,
        "last_player_damages" => PropertyNamesEnum::LastPlayerDamages,
        "name" => PropertyNamesEnum::Name,
        "party_id" => PropertyNamesEnum::PartyId,
        "position" => PropertyNamesEnum::Position,
        "wave" => PropertyNamesEnum::Wave,
        "weapon_name" => PropertyNamesEnum::WeaponName,
        "weapon_tier" => PropertyNamesEnum::WeaponTier,
        "zombie_shield_health" => PropertyNamesEnum::ZombieShieldHealth,
        "zombie_shield_max_health" => PropertyNamesEnum::ZombieShieldMaxHealth,
        "hits" => PropertyNamesEnum::Hits,
        "resource_type" => PropertyNamesEnum::ResourceType,
        "resource_variant" => PropertyNamesEnum::ResourceVariant,
        "aggro_enabled" => PropertyNamesEnum::AggroEnabled,
        "radius" => PropertyNamesEnum::Radius,
        "target_beams" => PropertyNamesEnum::TargetBeams,
        "target_resource_uid" => PropertyNamesEnum::TargetResourceUid,
        "tier" => PropertyNamesEnum::Tier,
        "warming_up" => PropertyNamesEnum::WarmingUp,
        "yaw" => PropertyNamesEnum::Yaw,
        "harvest_stage" => PropertyNamesEnum::HarvestStage,
        "resource_pickup_type" => PropertyNamesEnum::ResourcePickupType,
        "zombie_colour" => PropertyNamesEnum::ZombieColour,
        "spell_type" => PropertyNamesEnum::SpellType,
        _ => unreachable!("{}", property_name),
    }
}

fn encode_entity_attribute(
    byte_buffer: &mut ByteBuffer,
    prop: &str,
    entity: &EntityTypeEnum,
    encode_attribute_index: bool,
    game_mode: &GameModes
) {
    if encode_attribute_index == true {
        if let Some(index) = ENTITY_PROPS.iter().position(|x| *x == prop.to_string()) {
            byte_buffer.write_u8(index as u8);
        } else {
            panic!("Property not found in ENTITY_PROPS vector!: {}", prop);
        }
    }

    let prop_as_variant = property_name_str_as_variant(prop);

    // Position is on every entity
    if matches!(prop_as_variant, PropertyNamesEnum::Position) {
        let generic_entity = entity.generic_entity();

        byte_buffer.write_i16(generic_entity.position.x);
        byte_buffer.write_i16(generic_entity.position.y);
        return;
    }

    match entity {
        EntityTypeEnum::ArrowTower(entity) => match prop_as_variant {
            PropertyNamesEnum::AimingYaw => {
                byte_buffer.write_u16(entity.ranged_building.aiming_yaw)
            }
            PropertyNamesEnum::FiringTick => {
                byte_buffer.write_u32(entity.ranged_building.firing_tick)
            }
            PropertyNamesEnum::Health => {
                byte_buffer.write_u16(entity.ranged_building.base_building.health)
            }
            PropertyNamesEnum::MaxHealth => {
                byte_buffer.write_u16(entity.ranged_building.base_building.max_health)
            }
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.ranged_building.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => {
                byte_buffer.write_u32(entity.ranged_building.base_building.party_id)
            }
            PropertyNamesEnum::Tier => {
                byte_buffer.write_u8(entity.ranged_building.base_building.tier)
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::SawTower(entity) => match prop_as_variant {
            PropertyNamesEnum::AimingYaw => {
                byte_buffer.write_u16(entity.ranged_building.aiming_yaw)
            }
            PropertyNamesEnum::FiringTick => {
                byte_buffer.write_u32(entity.ranged_building.firing_tick)
            }
            PropertyNamesEnum::Health => {
                byte_buffer.write_u16(entity.ranged_building.base_building.health)
            }
            PropertyNamesEnum::MaxHealth => {
                byte_buffer.write_u16(entity.ranged_building.base_building.max_health)
            }
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.ranged_building.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => {
                byte_buffer.write_u32(entity.ranged_building.base_building.party_id)
            }
            PropertyNamesEnum::Tier => {
                byte_buffer.write_u8(entity.ranged_building.base_building.tier)
            }
            PropertyNamesEnum::Yaw => {
                byte_buffer.write_u16(entity.ranged_building.base_building.yaw)
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::CannonTower(entity) => match prop_as_variant {
            PropertyNamesEnum::AimingYaw => {
                byte_buffer.write_u16(entity.ranged_building.aiming_yaw)
            }
            PropertyNamesEnum::FiringTick => {
                byte_buffer.write_u32(entity.ranged_building.firing_tick)
            }
            PropertyNamesEnum::Health => {
                byte_buffer.write_u16(entity.ranged_building.base_building.health)
            }
            PropertyNamesEnum::MaxHealth => {
                byte_buffer.write_u16(entity.ranged_building.base_building.max_health)
            }
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.ranged_building.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => {
                byte_buffer.write_u32(entity.ranged_building.base_building.party_id)
            }
            PropertyNamesEnum::Tier => {
                byte_buffer.write_u8(entity.ranged_building.base_building.tier)
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::MageTower(entity) => match prop_as_variant {
            PropertyNamesEnum::AimingYaw => {
                byte_buffer.write_u16(entity.ranged_building.aiming_yaw)
            }
            PropertyNamesEnum::FiringTick => {
                byte_buffer.write_u32(entity.ranged_building.firing_tick)
            }
            PropertyNamesEnum::Health => {
                byte_buffer.write_u16(entity.ranged_building.base_building.health)
            }
            PropertyNamesEnum::MaxHealth => {
                byte_buffer.write_u16(entity.ranged_building.base_building.max_health)
            }
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.ranged_building.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => {
                byte_buffer.write_u32(entity.ranged_building.base_building.party_id)
            }
            PropertyNamesEnum::Tier => {
                byte_buffer.write_u8(entity.ranged_building.base_building.tier)
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::RocketTower(entity) => match prop_as_variant {
            PropertyNamesEnum::AimingYaw => {
                byte_buffer.write_u16(entity.ranged_building.aiming_yaw)
            }
            PropertyNamesEnum::FiringTick => {
                byte_buffer.write_u32(entity.ranged_building.firing_tick)
            }
            PropertyNamesEnum::Health => {
                byte_buffer.write_u16(entity.ranged_building.base_building.health)
            }
            PropertyNamesEnum::MaxHealth => {
                byte_buffer.write_u16(entity.ranged_building.base_building.max_health)
            }
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.ranged_building.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => {
                byte_buffer.write_u32(entity.ranged_building.base_building.party_id)
            }
            PropertyNamesEnum::Tier => {
                byte_buffer.write_u8(entity.ranged_building.base_building.tier)
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::LightningTower(entity) => match prop_as_variant {
            PropertyNamesEnum::AimingYaw => {
                byte_buffer.write_u16(entity.ranged_building.aiming_yaw)
            }
            PropertyNamesEnum::FiringTick => {
                byte_buffer.write_u32(entity.ranged_building.firing_tick)
            }
            PropertyNamesEnum::Health => {
                byte_buffer.write_u16(entity.ranged_building.base_building.health)
            }
            PropertyNamesEnum::MaxHealth => {
                byte_buffer.write_u16(entity.ranged_building.base_building.max_health)
            }
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.ranged_building.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => {
                byte_buffer.write_u32(entity.ranged_building.base_building.party_id)
            }
            PropertyNamesEnum::TargetBeams => {
                byte_buffer.write_u8((entity.target_beams.len() * 2) as u8);
                for i in entity.target_beams.iter() {
                    byte_buffer.write_i16(i.0);
                    byte_buffer.write_i16(i.1);
                }
            }
            PropertyNamesEnum::Tier => {
                byte_buffer.write_u8(entity.ranged_building.base_building.tier)
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Factory(entity) => match prop_as_variant {
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.base_building.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.base_building.max_health),
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => byte_buffer.write_u32(entity.base_building.party_id),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.base_building.tier),
            PropertyNamesEnum::WarmingUp => {
                byte_buffer.write_u8(if entity.warming_up == true { 1 } else { 0 })
            }
            PropertyNamesEnum::AggroEnabled => {
                byte_buffer.write_u8(if entity.aggro_enabled == true { 1 } else { 0 })
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Wall(entity) => match prop_as_variant {
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.base_building.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.base_building.max_health),
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => byte_buffer.write_u32(entity.base_building.party_id),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.base_building.tier),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::LargeWall(entity) => match prop_as_variant {
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.base_building.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.base_building.max_health),
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => byte_buffer.write_u32(entity.base_building.party_id),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.base_building.tier),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Door(entity) => match prop_as_variant {
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.base_building.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.base_building.max_health),
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => byte_buffer.write_u32(entity.base_building.party_id),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.base_building.tier),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Drill(entity) => match prop_as_variant {
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.base_building.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.base_building.max_health),
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => byte_buffer.write_u32(entity.base_building.party_id),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.base_building.tier),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Harvester(entity) => match prop_as_variant {
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.base_building.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.base_building.max_health),
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => byte_buffer.write_u32(entity.base_building.party_id),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.base_building.tier),
            PropertyNamesEnum::DroneCount => byte_buffer.write_u8(entity.drone_count),
            PropertyNamesEnum::TargetResourceUid => match entity.target_resource_uid {
                Some(uid) => byte_buffer.write_u16(uid),
                None => byte_buffer.write_u16(0),
            },
            PropertyNamesEnum::Yaw => byte_buffer.write_u16(entity.base_building.yaw),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::SpikeTrap(entity) => match prop_as_variant {
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.base_building.health),
            PropertyNamesEnum::FiringTick => byte_buffer.write_u32(entity.firing_tick),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.base_building.max_health),
            PropertyNamesEnum::LastDamagedTick => {
                byte_buffer.write_u32(entity.base_building.last_damaged_tick)
            }
            PropertyNamesEnum::PartyId => byte_buffer.write_u32(entity.base_building.party_id),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.base_building.tier),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Player(entity) => match prop_as_variant {
            PropertyNamesEnum::AimingYaw => byte_buffer.write_u16(entity.aiming_yaw),
            PropertyNamesEnum::Dead => {
                byte_buffer.write_u8(if entity.dead == true { 1 } else { 0 })
            }
            PropertyNamesEnum::FiringTick => byte_buffer.write_u32(entity.firing_tick),
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.max_health),
            PropertyNamesEnum::Invulnerable => {
                byte_buffer.write_u8(if entity.invulnerable == true { 1 } else { 0 })
            }
            PropertyNamesEnum::Gold => {
                match game_mode {
                    GameModes::Scarcity => {
                        let gold = PARTIES.with(|p| p.borrow().get(&entity.party_id).unwrap().resources.gold);
                        byte_buffer.write_u32(gold as u32)
                    },
                    _ => byte_buffer.write_u32(entity.gold as u32)
                }
            },
            PropertyNamesEnum::Wood => {
                match game_mode {
                    GameModes::Scarcity => {
                        let wood = PARTIES.with(|p| p.borrow().get(&entity.party_id).unwrap().resources.wood);
                        byte_buffer.write_u32(wood as u32)
                    },
                    _ => byte_buffer.write_u32(entity.wood as u32)
                }
            },
            PropertyNamesEnum::Stone => {
                match game_mode {
                    GameModes::Scarcity => {
                        let stone = PARTIES.with(|p| p.borrow().get(&entity.party_id).unwrap().resources.stone);
                        byte_buffer.write_u32(stone as u32)
                    },
                    _ => byte_buffer.write_u32(entity.stone as u32)
                }
            },
            PropertyNamesEnum::Tokens => byte_buffer.write_u32(entity.tokens as u32),
            PropertyNamesEnum::LastDamagedTick => byte_buffer.write_u32(entity.last_damaged_tick),
            PropertyNamesEnum::LastPlayerDamages => {
                byte_buffer.write_u16(entity.last_player_damages.len() as u16 * 3);

                for i in entity.last_player_damages.iter() {
                    byte_buffer.write_i16(i.0.x);
                    byte_buffer.write_i16(i.0.y);
                    byte_buffer.write_u16(i.1);
                }
            }
            PropertyNamesEnum::Name => byte_buffer.write_string(&entity.name),
            PropertyNamesEnum::PartyId => byte_buffer.write_u32(entity.party_id),
            PropertyNamesEnum::Wave => byte_buffer.write_u32(entity.wave),
            PropertyNamesEnum::WeaponName => byte_buffer.write_string(&entity.weapon_name),
            PropertyNamesEnum::WeaponTier => byte_buffer.write_u8(entity.weapon_tier),
            PropertyNamesEnum::ZombieShieldHealth => {
                byte_buffer.write_u16(entity.zombie_shield_health)
            }
            PropertyNamesEnum::ZombieShieldMaxHealth => {
                byte_buffer.write_u16(entity.zombie_shield_max_health)
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Resource(entity) => match prop_as_variant {
            PropertyNamesEnum::AimingYaw => byte_buffer.write_u16(entity.aiming_yaw),
            PropertyNamesEnum::Hits => {
                byte_buffer.write_u16((entity.hits.len() * 2) as u16);
                for val in entity.hits.iter() {
                    byte_buffer.write_u32(val.0);
                    byte_buffer.write_u32(val.1 as u32);
                }
            }
            PropertyNamesEnum::Radius => byte_buffer.write_u16(entity.radius as u16),
            PropertyNamesEnum::ResourceType => byte_buffer.write_string(&entity.resource_type),
            PropertyNamesEnum::ResourceVariant => byte_buffer.write_u8(entity.resource_variant),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::HarvesterDrone(entity) => match prop_as_variant {
            PropertyNamesEnum::HarvestStage => {
                let harvest_stage_index = entity.harvest_stage.harvest_stage_as_index();
                byte_buffer.write_u8(harvest_stage_index);
            }
            PropertyNamesEnum::LastDamagedTick => byte_buffer.write_u32(entity.last_damaged_tick),
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.max_health),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.tier),
            PropertyNamesEnum::Yaw => byte_buffer.write_u16(entity.yaw),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Projectile(entity) => match prop_as_variant {
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.tier),
            PropertyNamesEnum::Yaw => byte_buffer.write_u16(entity.yaw),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::ResourcePickup(entity) => match prop_as_variant {
            PropertyNamesEnum::ResourcePickupType => {
                byte_buffer.write_u8(entity.resource_pickup_type.type_index())
            }
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Zombie(entity) => match prop_as_variant {
            PropertyNamesEnum::ZombieColour => {
                byte_buffer.write_u8(entity.zombie_colour.colour_as_index())
            }
            PropertyNamesEnum::FiringTick => byte_buffer.write_u32(entity.firing_tick),
            PropertyNamesEnum::LastDamagedTick => byte_buffer.write_u32(entity.last_damaged_tick),
            PropertyNamesEnum::Health => byte_buffer.write_u16(entity.health),
            PropertyNamesEnum::MaxHealth => byte_buffer.write_u16(entity.max_health),
            PropertyNamesEnum::Tier => byte_buffer.write_u8(entity.tier),
            PropertyNamesEnum::Yaw => byte_buffer.write_u16(entity.yaw),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::SpellIndicator(entity) => match prop_as_variant {
            PropertyNamesEnum::SpellType => byte_buffer.write_u8(entity.spell_type.to_index()),
            PropertyNamesEnum::Radius => byte_buffer.write_u16(entity.radius as u16),
            _ => unreachable!("{}", prop),
        },
        EntityTypeEnum::Visualiser(entity) => match prop_as_variant {
            PropertyNamesEnum::Yaw => byte_buffer.write_u16(entity.yaw),
            _ => unreachable!("{}", prop),
        },
    }
}