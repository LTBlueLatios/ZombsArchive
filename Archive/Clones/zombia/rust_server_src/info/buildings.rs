use crate::{GameModes, ResourceCosts, CONFIG};
use lazy_static::lazy_static;
use std::collections::HashMap;

pub const TIERS: usize = 8;

pub trait BuildingInfoTrait {
    fn height(&self) -> f32;
    fn width(&self) -> f32;
    fn max_count(&self) -> u16;
    fn count_static(&self) -> bool;
    fn costs(&self, tier: u8) -> ResourceCosts;
    fn grid_width(&self) -> i16;
    fn grid_height(&self) -> i16;
}

#[derive(Debug, Clone)]
pub struct BaseBuildingInfo {
    pub name: &'static str,
    pub resource_costs: [ResourceCosts; TIERS],
    pub width: f32,
    pub grid_width: i16,
    pub height: f32,
    pub grid_height: i16,
    pub health: [u16; TIERS],
    pub ms_before_health_regen: [u16; TIERS],
    pub health_regen_per_second: [u16; TIERS],
    pub limit_static: bool,
    pub limit_per_member: u16,
    pub description: &'static str,
    pub game_modes: &'static [GameModes],
}

impl BuildingInfoTrait for BaseBuildingInfo {
    fn height(&self) -> f32 {
        self.height
    }
    fn width(&self) -> f32 {
        self.width
    }
    fn grid_width(&self) -> i16 {
        self.grid_width
    }
    fn grid_height(&self) -> i16 {
        self.grid_height
    }
    fn max_count(&self) -> u16 {
        self.limit_per_member
    }
    fn count_static(&self) -> bool {
        self.limit_static
    }
    fn costs(&self, tier: u8) -> ResourceCosts {
        self.resource_costs[tier as usize - 1].clone()
    }
}

#[derive(Debug, Clone)]
pub struct RangedTowerInfo {
    pub base_info: BaseBuildingInfo,
    pub ms_between_fires: [u32; TIERS],
    pub tower_range: [u32; TIERS],
    pub damage_to_zombies: [u16; TIERS],
    pub damage_to_players: [u16; TIERS],
    pub damage_to_pets: [u16; TIERS],
    pub damage_to_neutrals: [u16; TIERS],
    pub projectile_speed: [u32; TIERS],
    pub projectile_lifetime: [u16; TIERS],
    pub projectile_aoe_range: [u16; TIERS],
    pub projectile_entity_knockback: [u8; TIERS],
    pub projectile_can_home: bool,
}

impl BuildingInfoTrait for RangedTowerInfo {
    fn height(&self) -> f32 {
        self.base_info.height
    }
    fn width(&self) -> f32 {
        self.base_info.width
    }
    fn grid_width(&self) -> i16 {
        self.base_info.grid_width
    }
    fn grid_height(&self) -> i16 {
        self.base_info.grid_height
    }
    fn max_count(&self) -> u16 {
        self.base_info.limit_per_member
    }
    fn count_static(&self) -> bool {
        self.base_info.limit_static
    }
    fn costs(&self, tier: u8) -> ResourceCosts {
        self.base_info.resource_costs[tier as usize - 1].clone()
    }
}

#[derive(Debug, Clone)]
pub struct MeleeTowerInfo {
    pub base_info: BaseBuildingInfo,
    pub ms_between_fires: [u32; TIERS],
    pub tower_range: [u32; TIERS],
    pub damage_to_zombies: [u16; TIERS],
    pub damage_to_players: [u16; TIERS],
    pub damage_to_pets: [u16; TIERS],
    pub damage_to_neutrals: [u16; TIERS],
    pub max_yaw_deviation: u16,
}

impl BuildingInfoTrait for MeleeTowerInfo {
    fn height(&self) -> f32 {
        self.base_info.height
    }
    fn width(&self) -> f32 {
        self.base_info.width
    }
    fn grid_width(&self) -> i16 {
        self.base_info.grid_width
    }
    fn grid_height(&self) -> i16 {
        self.base_info.grid_height
    }
    fn max_count(&self) -> u16 {
        self.base_info.limit_per_member
    }
    fn count_static(&self) -> bool {
        self.base_info.limit_static
    }
    fn costs(&self, tier: u8) -> ResourceCosts {
        self.base_info.resource_costs[tier as usize - 1].clone()
    }
}

#[derive(Debug, Clone)]
pub struct DrillInfo {
    pub base_info: BaseBuildingInfo,
    pub gold_per_second: [u16; TIERS],
}

impl BuildingInfoTrait for DrillInfo {
    fn height(&self) -> f32 {
        self.base_info.height
    }
    fn width(&self) -> f32 {
        self.base_info.width
    }
    fn grid_width(&self) -> i16 {
        self.base_info.grid_width
    }
    fn grid_height(&self) -> i16 {
        self.base_info.grid_height
    }
    fn max_count(&self) -> u16 {
        self.base_info.limit_per_member
    }
    fn count_static(&self) -> bool {
        self.base_info.limit_static
    }
    fn costs(&self, tier: u8) -> ResourceCosts {
        self.base_info.resource_costs[tier as usize - 1].clone()
    }
}

#[derive(Debug, Clone)]
pub struct HarvesterInfo {
    pub base_info: BaseBuildingInfo,
    pub harvest_range: [u16; TIERS],
    pub max_drone_count: [u8; TIERS],
    pub drone_spawn_frequency_ms: [u16; TIERS],
    pub drone_gold_costs: u16,

    pub drone_health: [u16; TIERS],
    pub drone_ms_before_health_regen: u16,
    pub drone_health_regen_percent_per_second: u8,
    pub drone_speed: [u8; TIERS],
    pub drone_harvest_amount: [f32; TIERS],
    pub drone_harvest_range: [f32; TIERS],
    pub drone_max_capacity: [f32; TIERS],
    pub drone_charge_frequency_ms: [u16; TIERS],

    pub resource_pickup_lifetime_ms: u16,
    pub resource_pickup_player_pickup_range: u16,
}

impl BuildingInfoTrait for HarvesterInfo {
    fn height(&self) -> f32 {
        self.base_info.height
    }
    fn width(&self) -> f32 {
        self.base_info.width
    }
    fn grid_width(&self) -> i16 {
        self.base_info.grid_width
    }
    fn grid_height(&self) -> i16 {
        self.base_info.grid_height
    }
    fn max_count(&self) -> u16 {
        self.base_info.limit_per_member
    }
    fn count_static(&self) -> bool {
        self.base_info.limit_static
    }
    fn costs(&self, tier: u8) -> ResourceCosts {
        self.base_info.resource_costs[tier as usize - 1].clone()
    }
}

#[derive(Debug, Clone)]
pub enum BuildingInfoEnum {
    Base(BaseBuildingInfo),
    Ranged(RangedTowerInfo),
    Melee(MeleeTowerInfo),
    Drill(DrillInfo),
    Harvester(HarvesterInfo),
}

impl BuildingInfoTrait for BuildingInfoEnum {
    fn height(&self) -> f32 {
        match self {
            BuildingInfoEnum::Base(e) => e.height(),
            BuildingInfoEnum::Ranged(e) => e.height(),
            BuildingInfoEnum::Melee(e) => e.height(),
            BuildingInfoEnum::Drill(e) => e.height(),
            BuildingInfoEnum::Harvester(e) => e.height(),
        }
    }
    fn width(&self) -> f32 {
        match self {
            BuildingInfoEnum::Base(e) => e.width(),
            BuildingInfoEnum::Ranged(e) => e.width(),
            BuildingInfoEnum::Melee(e) => e.width(),
            BuildingInfoEnum::Drill(e) => e.width(),
            BuildingInfoEnum::Harvester(e) => e.width(),
        }
    }
    fn max_count(&self) -> u16 {
        match self {
            BuildingInfoEnum::Base(e) => e.max_count(),
            BuildingInfoEnum::Ranged(e) => e.max_count(),
            BuildingInfoEnum::Melee(e) => e.max_count(),
            BuildingInfoEnum::Drill(e) => e.max_count(),
            BuildingInfoEnum::Harvester(e) => e.max_count(),
        }
    }
    fn count_static(&self) -> bool {
        match self {
            BuildingInfoEnum::Base(e) => e.count_static(),
            BuildingInfoEnum::Ranged(e) => e.count_static(),
            BuildingInfoEnum::Melee(e) => e.count_static(),
            BuildingInfoEnum::Drill(e) => e.count_static(),
            BuildingInfoEnum::Harvester(e) => e.count_static(),
        }
    }
    fn costs(&self, tier: u8) -> ResourceCosts {
        match self {
            BuildingInfoEnum::Base(e) => e.costs(tier),
            BuildingInfoEnum::Ranged(e) => e.costs(tier),
            BuildingInfoEnum::Melee(e) => e.costs(tier),
            BuildingInfoEnum::Drill(e) => e.costs(tier),
            BuildingInfoEnum::Harvester(e) => e.costs(tier),
        }
    }
    fn grid_width(&self) -> i16 {
        match self {
            BuildingInfoEnum::Base(e) => e.grid_width(),
            BuildingInfoEnum::Ranged(e) => e.grid_width(),
            BuildingInfoEnum::Melee(e) => e.grid_width(),
            BuildingInfoEnum::Drill(e) => e.grid_width(),
            BuildingInfoEnum::Harvester(e) => e.grid_width(),
        }
    }
    fn grid_height(&self) -> i16 {
        match self {
            BuildingInfoEnum::Base(e) => e.grid_height(),
            BuildingInfoEnum::Ranged(e) => e.grid_height(),
            BuildingInfoEnum::Melee(e) => e.grid_height(),
            BuildingInfoEnum::Drill(e) => e.grid_height(),
            BuildingInfoEnum::Harvester(e) => e.grid_height(),
        }
    }
}

lazy_static! {
    pub static ref BUILDING_INFO: HashMap<&'static str, BuildingInfoEnum> = {
        let mut m = HashMap::new();

        m.insert("Factory", BuildingInfoEnum::Base(BaseBuildingInfo {
            name: "Factory",
            resource_costs: [
                ResourceCosts { gold_costs: 0.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 5000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 10000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 16000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 20000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 32000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 100000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 400000.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
            ],
            width: 95.99,
            grid_width: 2,
            height: 95.99,
            grid_height: 2,
            health: [1500, 1800, 2800, 3000, 5000, 8000, 12000, 20000],
            ms_before_health_regen: [10000; TIERS],
            health_regen_per_second: [50, 60, 70, 90, 110, 150, 400, 700],
            limit_static: true,
            limit_per_member: 1,
            description: "This is what you're here to defend. Make sure it doesn't fall.",
            game_modes: &[GameModes::Standard, GameModes::Scarcity],
        }));

        m.insert("Wall", BuildingInfoEnum::Base(BaseBuildingInfo {
            name: "Wall",
            resource_costs: [
                ResourceCosts { gold_costs: 0.0, wood_costs: 1.0, stone_costs: 1.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 5.0, wood_costs: 2.0, stone_costs: 2.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 30.0, wood_costs: 4.0, stone_costs: 4.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 60.0, wood_costs: 6.0, stone_costs: 6.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 80.0, wood_costs: 8.0, stone_costs: 8.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 200.0, wood_costs: 12.0, stone_costs: 12.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 500.0, wood_costs: 15.0, stone_costs: 15.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 1000.0, wood_costs: 20.0, stone_costs: 20.0, tokens_costs: 0.0 },
            ],
            width: 47.99,
            grid_width: 1,
            height: 47.99,
            grid_height: 1,
            health: [400, 500, 600, 800, 1000, 1800, 3000, 5500],
            ms_before_health_regen: [10000; TIERS],
            health_regen_per_second: [20, 25, 30, 50, 75, 140, 180, 250],
            limit_static: false,
            limit_per_member: 250,
            description: "Use these walls to defend your base!",
            game_modes: &[GameModes::Standard, GameModes::Scarcity],
        }));

        m.insert("LargeWall", BuildingInfoEnum::Base(BaseBuildingInfo {
            name: "LargeWall",
            resource_costs: [
                ResourceCosts { gold_costs: 0.0, wood_costs: 3.0, stone_costs: 3.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 15.0, wood_costs: 6.0, stone_costs: 6.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 90.0, wood_costs: 12.0, stone_costs: 12.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 180.0, wood_costs: 18.0, stone_costs: 18.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 240.0, wood_costs: 24.0, stone_costs: 24.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 600.0, wood_costs: 36.0, stone_costs: 36.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 1500.0, wood_costs: 45.0, stone_costs: 45.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 3000.0, wood_costs: 60.0, stone_costs: 60.0, tokens_costs: 0.0 },
            ],
            width: 95.99,
            grid_width: 2,
            height: 95.99,
            grid_height: 2,
            health: [1700, 2125, 2550, 3400, 4250, 7650, 12750, 23375],
            ms_before_health_regen: [10000; TIERS],
            health_regen_per_second: [20, 25, 30, 50, 75, 140, 180, 250],
            limit_static: false,
            limit_per_member: 20,
            description: "Use these bigger walls to defend more of your base!",
            game_modes: &[GameModes::Standard, GameModes::Scarcity],
        }));

        m.insert("Door", BuildingInfoEnum::Base(BaseBuildingInfo {
            name: "Door",
            resource_costs: [
                ResourceCosts { gold_costs: 0.0, wood_costs: 5.0, stone_costs: 5.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 10.0, wood_costs: 5.0, stone_costs: 5.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 50.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 70.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 150.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 200.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 400.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
                ResourceCosts { gold_costs: 800.0, wood_costs: 0.0, stone_costs: 0.0, tokens_costs: 0.0 },
            ],
            width: 47.99,
            grid_width: 1,
            height: 47.99,
            grid_height: 1,
            health: [150, 200, 300, 500, 600, 700, 1000, 1500],
            ms_before_health_regen: [10000; TIERS],
            health_regen_per_second: [5, 7, 12, 17, 25, 40, 70, 100],
            limit_static: false,
            limit_per_member: 80,
            description: "These doors can only be traversed by your party members.",
            game_modes: &[GameModes::Standard, GameModes::Scarcity],
        }));

        m.insert("SpikeTrap", BuildingInfoEnum::Melee(MeleeTowerInfo {
            base_info: BaseBuildingInfo {
                name: "SpikeTrap",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 5.0, stone_costs: 5.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 100.0, wood_costs: 25.0, stone_costs: 20.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 30.0, stone_costs: 30.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 400.0, wood_costs: 40.0, stone_costs: 40.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 50.0, stone_costs: 60.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 800.0, wood_costs: 70.0, stone_costs: 80.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1000.0, wood_costs: 300.0, stone_costs: 300.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1500.0, wood_costs: 800.0, stone_costs: 800.0, tokens_costs: 0.0 },
                ],
                width: 47.99,
                grid_width: 1,
                height: 47.99,
                grid_height: 1,
                health: [u16::MAX; TIERS],
                ms_before_health_regen: [0; TIERS],
                health_regen_per_second: [0; TIERS],
                limit_static: false,
                limit_per_member: 12,
                description: "These invincible tiles will spike any zombie that walks over them.",
                game_modes: &[GameModes::Standard, GameModes::Scarcity]
            },
            ms_between_fires: [0; TIERS],
            tower_range: [0; TIERS],
            damage_to_zombies: [1, 2, 4, 6, 8, 12, 16, 28],
            damage_to_players: [0; TIERS],
            damage_to_pets: [0; TIERS],
            damage_to_neutrals: [0; TIERS],
            max_yaw_deviation: 360
        }));

        m.insert("LightningTower", BuildingInfoEnum::Ranged(RangedTowerInfo {
            base_info: BaseBuildingInfo {
                name: "LightningTower",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 15.0, stone_costs: 15.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 100.0, wood_costs: 25.0, stone_costs: 25.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 40.0, stone_costs: 40.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 50.0, stone_costs: 50.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1200.0, wood_costs: 70.0, stone_costs: 70.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 2000.0, wood_costs: 100.0, stone_costs: 100.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 8000.0, wood_costs: 300.0, stone_costs: 300.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 35000.0, wood_costs: 800.0, stone_costs: 800.0, tokens_costs: 0.0 },
                ],
                width: 95.99,
                grid_width: 2,
                height: 95.99,
                grid_height: 2,
                health: [150, 200, 400, 800, 1200, 1600, 2200, 3600],
                ms_before_health_regen: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
                health_regen_per_second: [20, 25, 30, 40, 80, 80, 110, 150],
                limit_static: false,
                limit_per_member: 6,
                description: "Shoots beams of electricity which arc between enemies.",
                game_modes: &[GameModes::Standard, GameModes::Scarcity]
            },
            ms_between_fires: [500, 500, 400, 400, 350, 300, 150, 50],
            tower_range: [600, 600, 600, 600, 600, 600, 600, 600],
            damage_to_zombies: [40, 40, 50, 60, 80, 120, 150, 200],
            damage_to_players: [2, 2, 2, 2, 2, 3, 3, 4],
            damage_to_pets: [5, 5, 5, 5, 5, 5, 5, 5],
            damage_to_neutrals: [250, 350, 450, 550, 650, 750, 850, 1000],
            projectile_speed: [0; TIERS],
            projectile_lifetime: [0; TIERS],
            projectile_aoe_range: [0; TIERS],
            projectile_entity_knockback: [0; TIERS],
            projectile_can_home: false
        }));

        m.insert("ArrowTower", BuildingInfoEnum::Ranged(RangedTowerInfo {
            base_info: BaseBuildingInfo {
                name: "ArrowTower",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 5.0, stone_costs: 5.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 100.0, wood_costs: 25.0, stone_costs: 20.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 30.0, stone_costs: 30.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 40.0, stone_costs: 30.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1200.0, wood_costs: 50.0, stone_costs: 60.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 2000.0, wood_costs: 80.0, stone_costs: 80.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 8000.0, wood_costs: 300.0, stone_costs: 300.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 35000.0, wood_costs: 800.0, stone_costs: 800.0, tokens_costs: 0.0 },
                ],
                width: 95.99,
                grid_width: 2,
                height: 95.99,
                grid_height: 2,
                health: [150, 200, 400, 800, 1200, 1600, 2200, 3600],
                ms_before_health_regen: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
                health_regen_per_second: [20, 25, 30, 40, 80, 80, 110, 150],
                limit_static: false,
                limit_per_member: 6,
                description: "Shoots fast, hits hard, and cheap!",
                game_modes: &[GameModes::Standard, GameModes::Scarcity]
            },
            ms_between_fires: [400, 333, 285, 250, 250, 250, 200, 150],
            tower_range: [600, 650, 700, 750, 800, 850, 900, 950],
            damage_to_zombies: [20, 30, 50, 80, 120, 150, 250, 500],
            damage_to_players: [2, 2, 2, 3, 3, 4, 4, 4],
            damage_to_pets: [5, 5, 5, 5, 5, 5, 5, 5],
            damage_to_neutrals: [250, 350, 450, 550, 650, 750, 850, 1000],
            projectile_speed: [42, 58, 64, 64, 72, 72, 86, 100],
            projectile_lifetime: [1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300],
            projectile_aoe_range: [0; TIERS],
            projectile_entity_knockback: [2, 2, 3, 3, 3, 3, 3, 3],
            projectile_can_home: false
        }));

        m.insert("CannonTower", BuildingInfoEnum::Ranged(RangedTowerInfo {
            base_info: BaseBuildingInfo {
                name: "CannonTower",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 15.0, stone_costs: 15.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 100.0, wood_costs: 25.0, stone_costs: 25.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 30.0, stone_costs: 40.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 40.0, stone_costs: 50.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1200.0, wood_costs: 60.0, stone_costs: 80.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 2000.0, wood_costs: 80.0, stone_costs: 120.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 8000.0, wood_costs: 300.0, stone_costs: 300.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 35000.0, wood_costs: 800.0, stone_costs: 800.0, tokens_costs: 0.0 },
                ],
                width: 95.99,
                grid_width: 2,
                height: 95.99,
                grid_height: 2,
                health: [150, 200, 400, 800, 1200, 1600, 2200, 3600],
                ms_before_health_regen: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
                health_regen_per_second: [20, 25, 30, 40, 80, 80, 110, 150],
                limit_static: false,
                limit_per_member: 6,
                description: "Cannon balls for big knockback!",
                game_modes: &[GameModes::Standard, GameModes::Scarcity]
            },
            ms_between_fires: [1000, 950, 950, 800, 700, 600, 500, 400],
            tower_range: [500, 500, 500, 500, 600, 600, 600, 600],
            damage_to_zombies: [20, 30, 50, 70, 120, 150, 200, 300],
            damage_to_players: [3, 3, 4, 4, 5, 5, 5, 6],
            damage_to_pets: [5, 5, 5, 5, 5, 5, 5, 5],
            damage_to_neutrals: [250, 350, 450, 550, 650, 750, 850, 1000],
            projectile_speed: [42, 42, 42, 50, 58, 72, 72, 86],
            projectile_lifetime: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            projectile_aoe_range: [48, 48, 48, 48, 48, 48, 72, 96],
            projectile_entity_knockback: [4, 4, 4, 4, 4, 4, 4, 4],
            projectile_can_home: false
        }));

        m.insert("SawTower", BuildingInfoEnum::Melee(MeleeTowerInfo {
            base_info: BaseBuildingInfo {
                name: "SawTower",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 10.0, stone_costs: 10.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 100.0, wood_costs: 25.0, stone_costs: 20.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 30.0, stone_costs: 30.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 40.0, stone_costs: 40.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1200.0, wood_costs: 50.0, stone_costs: 60.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 2000.0, wood_costs: 70.0, stone_costs: 80.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 8000.0, wood_costs: 300.0, stone_costs: 300.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 35000.0, wood_costs: 800.0, stone_costs: 800.0, tokens_costs: 0.0 },
                ],
                width: 95.99,
                grid_width: 2,
                height: 95.99,
                grid_height: 2,
                health: [200, 400, 800, 1200, 1600, 2200, 4000, 9000],
                ms_before_health_regen: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
                health_regen_per_second: [20, 25, 30, 40, 80, 80, 110, 150],
                limit_static: false,
                limit_per_member: 6,
                description: "These saws cut through anything that gets too close.",
                game_modes: &[GameModes::Standard, GameModes::Scarcity]
            },
            ms_between_fires: [0; TIERS],
            tower_range: [144; TIERS],
            // Saw towers deal this amount of damage **per second**
            damage_to_zombies: [120, 150, 200, 500, 700, 1400, 3500, 5000],
            damage_to_players: [40, 50, 50, 60, 70, 70, 80, 110],
            damage_to_pets: [5, 5, 5, 5, 5, 5, 6, 6],
            damage_to_neutrals: [250, 350, 450, 550, 650, 750, 850, 1000],
            max_yaw_deviation: 45
        }));

        m.insert("RocketTower", BuildingInfoEnum::Ranged(RangedTowerInfo {
            base_info: BaseBuildingInfo {
                name: "RocketTower",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 10.0, stone_costs: 10.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 100.0, wood_costs: 25.0, stone_costs: 25.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 40.0, stone_costs: 40.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 50.0, stone_costs: 50.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1200.0, wood_costs: 80.0, stone_costs: 80.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 2000.0, wood_costs: 120.0, stone_costs: 120.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 8000.0, wood_costs: 300.0, stone_costs: 300.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 35000.0, wood_costs: 800.0, stone_costs: 800.0, tokens_costs: 0.0 },
                ],
                width: 95.99,
                grid_width: 2,
                height: 95.99,
                grid_height: 2,
                health: [150, 200, 400, 800, 1200, 1600, 2200, 3600],
                ms_before_health_regen: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
                health_regen_per_second: [20, 25, 30, 40, 80, 80, 110, 150],
                limit_static: false,
                limit_per_member: 6,
                description: "Shoots homing rockets that deal splash damage.",
                game_modes: &[GameModes::Standard, GameModes::Scarcity]
            },
            ms_between_fires: [1000, 1000, 1000, 800, 800, 750, 750, 700],
            tower_range: [600, 625, 675, 700, 750, 800, 800, 1000],
            damage_to_zombies: [50, 50, 70, 80, 100, 240, 400, 750],
            damage_to_players: [3, 4, 4, 4, 5, 5, 6, 6],
            damage_to_pets: [10, 10, 10, 10, 10, 10, 10, 10],
            damage_to_neutrals: [250, 350, 450, 550, 650, 750, 850, 1000],
            projectile_speed: [20, 20, 20, 60, 60, 65, 70, 80],
            projectile_lifetime: [2000, 2000, 2000, 1000, 1000, 1000, 1000, 1000],
            projectile_aoe_range: [150, 150, 150, 200, 200, 200, 250, 250],
            projectile_entity_knockback: [0; TIERS],
            projectile_can_home: true
        }));

        m.insert("MageTower", BuildingInfoEnum::Ranged(RangedTowerInfo {
            base_info: BaseBuildingInfo {
                name: "MageTower",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 15.0, stone_costs: 15.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 100.0, wood_costs: 25.0, stone_costs: 25.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 40.0, stone_costs: 40.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 50.0, stone_costs: 50.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1200.0, wood_costs: 70.0, stone_costs: 70.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 2000.0, wood_costs: 100.0, stone_costs: 100.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 8000.0, wood_costs: 300.0, stone_costs: 300.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 35000.0, wood_costs: 800.0, stone_costs: 800.0, tokens_costs: 0.0 },
                ],
                width: 95.99,
                grid_width: 2,
                height: 95.99,
                grid_height: 2,
                health: [150, 200, 400, 800, 1200, 1600, 2200, 3600],
                ms_before_health_regen: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
                health_regen_per_second: [20, 25, 30, 40, 80, 80, 110, 150],
                limit_static: false,
                limit_per_member: 6,
                description: "Fast shooting, low damage, but a whole three projectiles?!",
                game_modes: &[GameModes::Standard, GameModes::Scarcity]
            },
            ms_between_fires: [800, 800, 700, 600, 500, 400, 300, 200],
            tower_range: [300, 300, 300, 300, 300, 300, 300, 300],
            damage_to_zombies: [10, 20, 40, 50, 70, 80, 120, 160],
            damage_to_players: [2, 2, 2, 2, 2, 3, 3, 3],
            damage_to_pets: [5, 5, 5, 5, 5, 5, 5, 5],
            damage_to_neutrals: [250, 350, 450, 550, 650, 750, 850, 1000],
            projectile_speed: [55, 55, 55, 55, 55, 55, 55, 55],
            projectile_lifetime: [500, 500, 500, 500, 500, 500, 500, 500],
            projectile_aoe_range: [0; TIERS],
            projectile_entity_knockback: [2, 2, 3, 4, 5, 6, 7, 8],
            projectile_can_home: false
        }));

        m.insert("Drill", BuildingInfoEnum::Drill(DrillInfo {
            base_info: BaseBuildingInfo {
                name: "Drill",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 5.0, stone_costs: 5.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 15.0, stone_costs: 15.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 300.0, wood_costs: 25.0, stone_costs: 25.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 35.0, stone_costs: 35.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 800.0, wood_costs: 45.0, stone_costs: 45.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1200.0, wood_costs: 55.0, stone_costs: 55.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 8000.0, wood_costs: 700.0, stone_costs: 700.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 30000.0, wood_costs: 1600.0, stone_costs: 1600.0, tokens_costs: 0.0 },
                ],
                width: 95.99,
                grid_width: 2,
                height: 95.99,
                grid_height: 2,
                health: [150, 250, 350, 500, 800, 1400, 1800, 2800],
                ms_before_health_regen: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
                health_regen_per_second: [5, 7, 12, 17, 25, 40, 70, 120],
                limit_static: true,
                limit_per_member: 8,
                description: "These drills produce gold over time.",
                game_modes: &[GameModes::Standard]
            },
            gold_per_second: [10, 12, 14, 15, 18, 24, 45, 75],
        }));

        m.insert("Harvester", BuildingInfoEnum::Harvester(HarvesterInfo {
            base_info: BaseBuildingInfo {
                name: "Harvester",
                resource_costs: [
                    ResourceCosts { gold_costs: 0.0, wood_costs: 5.0, stone_costs: 5.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 100.0, wood_costs: 25.0, stone_costs: 20.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 200.0, wood_costs: 30.0, stone_costs: 30.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 600.0, wood_costs: 40.0, stone_costs: 40.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 1200.0, wood_costs: 50.0, stone_costs: 60.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 2000.0, wood_costs: 70.0, stone_costs: 80.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 8000.0, wood_costs: 300.0, stone_costs: 300.0, tokens_costs: 0.0 },
                    ResourceCosts { gold_costs: 10000.0, wood_costs: 600.0, stone_costs: 600.0, tokens_costs: 0.0 },
                ],
                width: 95.99,
                grid_width: 2,
                height: 143.99,
                grid_height: 3,
                health: [150, 200, 400, 800, 1200, 1600, 2200, 2800],
                ms_before_health_regen: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
                health_regen_per_second: [20, 25, 30, 40, 80, 80, 110, 150],
                limit_static: false,
                limit_per_member: 2,
                description: "This spawns drones to collect resources for you!",
                game_modes: &[GameModes::Standard, GameModes::Scarcity]
            },
            harvest_range: [600, 600, 600, 600, 600, 700, 800, 800],
            max_drone_count: [3, 3, 5, 5, 5, 5, 5, 5],
            drone_spawn_frequency_ms: [3000, 3000, 3000, 3000, 2500, 2500, 2500, 1500],
            drone_gold_costs: 5000,

            drone_health: [200, 400, 400, 600, 600, 800, 800, 1000],
            drone_ms_before_health_regen: 5000,
            drone_health_regen_percent_per_second: 10,
            drone_speed: [12, 12, 12, 12, 12, 12, 12, 12],
            drone_harvest_amount: [4.0, 6.0, 6.0, 8.0, 15.0, 20.0, 24.0, 30.0],
            drone_harvest_range: [4.0; TIERS],
            drone_max_capacity: [20.0, 30.0, 30.0, 40.0, 80.0, 100.0, 120.0, 150.0],
            drone_charge_frequency_ms: [5000, 5000, 4000, 4000, 3000, 2500, 2500, 2000],

            resource_pickup_lifetime_ms: 10000,
            resource_pickup_player_pickup_range: 144
        }));

        m
    };
}

pub fn get_building(model: &str) -> BuildingInfoEnum {
    BUILDING_INFO.get(&model).unwrap().clone()
}

pub fn get_player_buildings() -> Vec<BuildingInfoEnum> {
    let mut buildings: Vec<BuildingInfoEnum> = Vec::new();

    for (_model, building) in BUILDING_INFO.iter() {
        let game_mode = CONFIG.with(|c| c.borrow().game_mode.clone());

        let game_modes = match building {
            BuildingInfoEnum::Base(base_building_info) => base_building_info.game_modes,
            BuildingInfoEnum::Ranged(ranged_tower_info) => ranged_tower_info.base_info.game_modes,
            BuildingInfoEnum::Melee(melee_tower_info) => melee_tower_info.base_info.game_modes,
            BuildingInfoEnum::Drill(drill_info) => drill_info.base_info.game_modes,
            BuildingInfoEnum::Harvester(harvester_info) => harvester_info.base_info.game_modes,
        };

        if game_modes.contains(&game_mode) {
            buildings.push(building.clone());
        }
    }

    buildings
}
