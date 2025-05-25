use std::collections::HashMap;
use lazy_static::lazy_static;

pub const TIERS: usize = 10;

use crate::ResourceCosts;

#[derive(Debug, Clone)]
pub struct ZombieShield {
    pub name: &'static str,
    pub description: &'static str,
    pub resource_costs: [ResourceCosts; TIERS],
    pub health: [u16; TIERS],
    pub health_regen_per_second: [u16; TIERS],
    pub ms_before_health_regen: [u16; TIERS]
}

#[derive(Debug, Clone)]
pub enum ArmourInfo {
    ZombieShield(ZombieShield)
}

impl ArmourInfo {
    pub fn get_costs(&self, tier: u8) -> ResourceCosts {
        match self {
            ArmourInfo::ZombieShield(shield_info) => {
                shield_info.resource_costs[tier as usize - 1].clone()
            }
        }
    }
}

lazy_static! {
    pub static ref ARMOUR: HashMap<&'static str, ArmourInfo> = {
        let mut armour = HashMap::new();

        armour.insert(
            "ZombieShield",
            ArmourInfo::ZombieShield(ZombieShield {
                name: "ZombieShield",
                description: "This shield will give you a bonus protection against zombies.",
                resource_costs: [
                    ResourceCosts { gold_costs: 1_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 3_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 7_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 14_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 18_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 22_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 24_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 30_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 45_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 70_000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ],
                health: [500, 1000, 1800, 4000, 10000, 15000, 17500, 25000, 30000, 45000],
                health_regen_per_second: [50, 100, 200, 400, 1000, 2000, 3500, 5000, 6500, 8500],
                ms_before_health_regen: [10000, 9000, 8000, 7000, 6000, 6000, 6000, 6000, 6000, 6000]
            })
        );

        armour
    };
}

pub fn grab_armour_info(armour_name: &str) -> Option<&ArmourInfo> {
    match ARMOUR.get(armour_name) {
        Some(armour) => Some(&armour),
        None => None,
    }
}