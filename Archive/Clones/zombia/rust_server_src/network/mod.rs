pub mod decode;
pub mod decode_rpc;
pub mod decode_rpc_types;
pub mod encode;
pub mod encode_rpc;
pub mod encode_rpc_types;
pub mod handle_rpc_types;
pub mod ws_server;
pub mod website_ws;

use lazy_static::lazy_static;
use std::collections::HashMap;

pub enum OPCODES {
    PacketEntityUpdate = 0,
    PacketInput = 1,
    PacketEnterWorld = 2,
    PacketPing = 3,
    PacketRpc = 4,
}

impl OPCODES {
    fn try_from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(OPCODES::PacketEntityUpdate),
            1 => Some(OPCODES::PacketInput),
            2 => Some(OPCODES::PacketEnterWorld),
            3 => Some(OPCODES::PacketPing),
            4 => Some(OPCODES::PacketRpc),
            _ => None,
        }
    }
}

pub struct SharedProps {
    pub name: &'static str,
    pub index: u8,
    pub props: Vec<&'static str>,
    pub entity_class: &'static str,
}

lazy_static! {
    pub static ref model_shared_props: HashMap<&'static str, SharedProps> = {
        let mut m = HashMap::new();

        m.insert(
            "ArrowProjectile",
            SharedProps {
                name: "ArrowProjectile",
                index: 0,
                props: vec!["position", "yaw"],
                entity_class: "Projectile",
            },
        );

        m.insert(
            "CannonProjectile",
            SharedProps {
                name: "CannonProjectile",
                index: 1,
                props: vec!["position", "yaw"],
                entity_class: "Projectile",
            },
        );

        m.insert(
            "DynamiteProjectile",
            SharedProps {
                name: "DynamiteProjectile",
                index: 2,
                props: vec!["position", "tier", "yaw"],
                entity_class: "Projectile",
            },
        );

        m.insert(
            "MageProjectile",
            SharedProps {
                name: "MageProjectile",
                index: 3,
                props: vec!["position", "yaw"],
                entity_class: "Projectile",
            },
        );

        m.insert(
            "RocketProjectile",
            SharedProps {
                name: "RocketProjectile",
                index: 4,
                props: vec!["position", "tier", "yaw"],
                entity_class: "Projectile",
            },
        );

        m.insert(
            "ArrowTower",
            SharedProps {
                name: "ArrowTower",
                index: 5,
                props: vec![
                    "aiming_yaw",
                    "firing_tick",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "CannonTower",
            SharedProps {
                name: "CannonTower",
                index: 6,
                props: vec![
                    "aiming_yaw",
                    "firing_tick",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "LightningTower",
            SharedProps {
                name: "LightningTower",
                index: 7,
                props: vec![
                    "firing_tick",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "target_beams",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "MageTower",
            SharedProps {
                name: "MageTower",
                index: 8,
                props: vec![
                    "aiming_yaw",
                    "firing_tick",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "RocketTower",
            SharedProps {
                name: "RocketTower",
                index: 9,
                props: vec![
                    "aiming_yaw",
                    "firing_tick",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "SawTower",
            SharedProps {
                name: "SawTower",
                index: 10,
                props: vec![
                    "firing_tick",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                    "yaw",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "Wall",
            SharedProps {
                name: "Wall",
                index: 11,
                props: vec![
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "LargeWall",
            SharedProps {
                name: "LargeWall",
                index: 12,
                props: vec![
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "Door",
            SharedProps {
                name: "Door",
                index: 13,
                props: vec![
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "party_id",
                    "position",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "SpikeTrap",
            SharedProps {
                name: "SpikeTrap",
                index: 14,
                props: vec!["last_damaged_tick", "party_id", "position", "tier"],
                entity_class: "Building",
            },
        );

        m.insert(
            "Drill",
            SharedProps {
                name: "Drill",
                index: 15,
                props: vec![
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "Harvester",
            SharedProps {
                name: "Harvester",
                index: 16,
                props: vec![
                    "drone_count",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "target_resource_uid",
                    "tier",
                    "yaw",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "HarvesterDrone",
            SharedProps {
                name: "HarvesterDrone",
                index: 17,
                props: vec![
                    "harvest_stage",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "position",
                    "tier",
                    "yaw",
                ],
                entity_class: "Npc",
            },
        );

        m.insert(
            "ResourcePickup",
            SharedProps {
                name: "ResourcePickup",
                index: 18,
                props: vec!["position", "resource_pickup_type"],
                entity_class: "ResourcePickup",
            },
        );

        m.insert(
            "Factory",
            SharedProps {
                name: "Factory",
                index: 19,
                props: vec![
                    "aggro_enabled",
                    "health",
                    "last_damaged_tick",
                    "max_health",
                    "party_id",
                    "position",
                    "tier",
                    "warming_up",
                ],
                entity_class: "Building",
            },
        );

        m.insert(
            "Player",
            SharedProps {
                name: "Player",
                index: 20,
                props: vec![
                    "aiming_yaw",
                    "dead",
                    "firing_tick",
                    "invulnerable",
                    "gold",
                    "health",
                    "last_damaged_tick",
                    "last_player_damages",
                    "max_health",
                    "name",
                    "party_id",
                    "position",
                    "stone",
                    "tokens",
                    "wave",
                    "weapon_name",
                    "weapon_tier",
                    "wood",
                    "zombie_shield_health",
                    "zombie_shield_max_health",
                ],
                entity_class: "Player",
            },
        );

        m.insert(
            "Resource",
            SharedProps {
                name: "Resource",
                index: 21,
                props: vec![
                    "aiming_yaw",
                    "hits",
                    "position",
                    "radius",
                    "resource_type",
                    "resource_variant",
                ],
                entity_class: "Resource",
            },
        );

        m.insert(
            "Zombie",
            SharedProps {
                name: "Zombie",
                index: 22,
                props: vec![
                    "zombie_colour",
                    "health",
                    "max_health",
                    "position",
                    "tier",
                    "yaw",
                ],
                entity_class: "Zombie",
            },
        );

        m.insert(
            "SpellIndicator",
            SharedProps {
                name: "SpellIndicator",
                index: 23,
                props: vec!["position", "radius", "spell_type"],
                entity_class: "Spell",
            },
        );

        m.insert(
            "Visualiser",
            SharedProps {
                name: "Visualiser",
                index: 24,
                props: vec!["position", "yaw"],
                entity_class: "Visualiser",
            },
        );

        m
    };
}
