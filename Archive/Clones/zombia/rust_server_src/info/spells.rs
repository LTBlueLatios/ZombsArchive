use std::collections::HashMap;
use lazy_static::lazy_static;

use crate::ResourceCosts;

#[derive(Debug, Clone)]
pub struct SpellCommonInfo {
    pub name: &'static str,
    pub description: &'static str,
    pub costs: ResourceCosts
}

#[derive(Debug, Clone)]
pub struct TimeoutInfo {
    pub common: SpellCommonInfo
}

#[derive(Debug, Clone)]
pub struct RapidfireInfo {
    pub common: SpellCommonInfo,
    pub buff_duration_ms: u32,
    pub radius: u32
}

#[derive(Debug, Clone)]
pub enum SpellInfo {
    Timeout(TimeoutInfo),
    Rapidfire(RapidfireInfo)
}

impl SpellInfo {
    pub fn get_costs(&self) -> ResourceCosts {
        match self {
            SpellInfo::Timeout(timeout_info) => {
                timeout_info.common.costs.clone()
            },
            SpellInfo::Rapidfire(rapidfire_info) => {
                rapidfire_info.common.costs.clone()
            }
        }
    }
}

pub enum SpellsEnum {
    Timeout,
    Rapidfire
}

lazy_static! {
    pub static ref SPELLS: HashMap<&'static str, SpellInfo> = {
        let mut spells = HashMap::new();

        spells.insert(
            "Timeout",
            SpellInfo::Timeout(TimeoutInfo {
                common: SpellCommonInfo {
                    name: "Timeout",
                    description: "Use this spell to prevent zombies from spawning for one night.",
                    costs: ResourceCosts {
                        gold_costs: 10000.0,
                        wood_costs: 0.0,
                        stone_costs: 0.0,
                        tokens_costs: 0.0
                    }
                }
            })
        );

        spells.insert(
            "Rapidfire",
            SpellInfo::Rapidfire(RapidfireInfo {
                common: SpellCommonInfo {
                    name: "Rapidfire",
                    description: "Temporarily boost the attack speed of towers in an area with this spell!",
                    costs: ResourceCosts {
                        gold_costs: 5000.0,
                        wood_costs: 0.0,
                        stone_costs: 0.0,
                        tokens_costs: 0.0
                    }
                },
                buff_duration_ms: 10000,
                radius: 300
            })
        );

        spells
    };
}