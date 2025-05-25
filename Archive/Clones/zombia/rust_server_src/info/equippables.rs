use lazy_static::lazy_static;
use std::collections::HashMap;

const TIERS: usize = 7;

#[derive(Debug, Clone)]
pub struct MeleeHarvestingToolInfo {
    pub name: &'static str,
    pub class: &'static str,
    pub ms_between_fires: [u16; TIERS],
    pub tiers: u8,
    pub gold_costs: [f32; TIERS],
    pub wood_costs: [f32; TIERS],
    pub stone_costs: [f32; TIERS],
    pub tokens_costs: [f32; TIERS],
    pub range: [u16; TIERS],
    pub max_yaw_deviation: u16,
    pub harvest_amount: [f32; TIERS],
    pub description: &'static str,
}

#[derive(Debug, Clone)]
pub struct MeleeWeaponInfo {
    pub name: &'static str,
    pub class: &'static str,
    pub ms_between_fires: [u16; TIERS],
    pub tiers: u8,
    // pub damageToNeutrals: [50, 50, 50, 60, 70, 75, 90],
    // pub damageToPets: [3, 3.5, 4, 4.5, 5, 5.5, 5.5],
    pub damage_to_zombies: [u16; TIERS],
    pub damage_to_buildings: [u16; TIERS],
    pub damage_to_players: [u16; TIERS],
    pub gold_costs: [f32; TIERS],
    pub stone_costs: [f32; TIERS],
    pub wood_costs: [f32; TIERS],
    pub tokens_costs: [f32; TIERS],
    pub range: [u16; TIERS],
    pub max_yaw_deviation: u16,
    pub description: &'static str,
}

#[derive(Debug, Clone)]
pub struct RangedWeaponInfo {
    pub name: &'static str,
    pub class: &'static str,
    pub ms_between_fires: [u16; TIERS],
    pub tiers: u8,
    // pub damageToNeutrals: [50, 50, 50, 60, 70, 75, 90],
    // pub damageToPets: [3, 3.5, 4, 4.5, 5, 5.5, 5.5],
    pub damage_to_zombies: [u16; TIERS],
    pub damage_to_buildings: [u16; TIERS],
    pub damage_to_players: [u16; TIERS],
    pub gold_costs: [f32; TIERS],
    pub stone_costs: [f32; TIERS],
    pub wood_costs: [f32; TIERS],
    pub tokens_costs: [f32; TIERS],
    pub projectile_speed: [u16; TIERS],
    pub projectile_lifetime: [u16; TIERS],
    pub projectile_entity_knockback: [u8; TIERS],
    pub projectile_aoe_range: [u16; TIERS],
    pub projectile_can_home: bool,
    pub description: &'static str,
}

pub const ARMOUR_TIERS: usize = 10;

#[derive(Debug, Clone)]
pub struct ZombieShieldInfo {
    pub name: &'static str,
    pub class: &'static str,
    pub tiers: u8,
    pub description: &'static str,
    pub gold_costs: [f32; ARMOUR_TIERS],
    pub stone_costs: [f32; ARMOUR_TIERS],
    pub wood_costs: [f32; ARMOUR_TIERS],
    pub tokens_costs: [f32; ARMOUR_TIERS],
    pub health: [u16; ARMOUR_TIERS],
    pub health_regen_per_second: [u16; ARMOUR_TIERS],
    pub ms_before_health_regen: [u16; ARMOUR_TIERS]
}

#[derive(Debug, Clone)]
pub struct HealthPotionInfo {
    pub name: &'static str,
    pub class: &'static str,
    pub description: &'static str,
    pub gold_costs: [f32; 1],
    pub stone_costs: [f32; 1],
    pub wood_costs: [f32; 1],
    pub tokens_costs: [f32; 1],
    pub purchase_cooldown_ms: u16
}

#[derive(Debug, Clone)]
pub enum EquippableInfo {
    MeleeHarvestingToolInfo(MeleeHarvestingToolInfo),
    MeleeWeaponInfo(MeleeWeaponInfo),
    RangedWeaponInfo(RangedWeaponInfo),
    ZombieShieldInfo(ZombieShieldInfo),
    HealthPotionInfo(HealthPotionInfo)
}

lazy_static! {
    #[derive(Debug)]
    pub static ref tool_info: HashMap<&'static str, EquippableInfo> = HashMap::from([
        ("Pickaxe", EquippableInfo::MeleeHarvestingToolInfo(MeleeHarvestingToolInfo {
            name: "Pickaxe",
            class: "Tools",
            ms_between_fires: [300, 300, 285, 250, 200, 200, 200],
            tiers: 7,
            gold_costs: [0.0, 1000.0, 3000.0, 6000.0, 8000.0, 24000.0, 90000.0],
            stone_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            wood_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            tokens_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            range: [64, 64, 64, 64, 64, 64, 64],
            max_yaw_deviation: 70,
            harvest_amount: [2.0, 4.0, 4.0, 5.0, 6.0, 7.0, 10.0],
            description: "Use this to collect resources used to build your base!"
        })),

        ("Sword", EquippableInfo::MeleeWeaponInfo(MeleeWeaponInfo {
            name: "Sword",
            class: "Tools",
            ms_between_fires: [250, 250, 250, 250, 250, 250, 200],
            tiers: 7,
            // damageToNeutrals: [50, 50, 50, 60, 70, 75, 90],
            // damageToPets: [3, 3.5, 4, 4.5, 5, 5.5, 5.5],
            damage_to_zombies: [30, 80, 120, 300, 800, 1500, 3000],
            damage_to_buildings: [3, 3, 3, 3, 4, 4, 5],
            damage_to_players: [15, 16, 17, 18, 20, 22, 22],
            gold_costs: [100.0, 400.0, 3000.0, 5000.0, 25000.0, 50000.0, 200000.0],
            stone_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            wood_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            tokens_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            range: [72, 72, 72, 72, 72, 72, 72],
            max_yaw_deviation: 50,
            description: "This sword can be used to defeat zombies and other troubles."
        })),

        ("Crossbow", EquippableInfo::RangedWeaponInfo(RangedWeaponInfo {
            name: "Crossbow",
            class: "Tools",
            ms_between_fires: [500, 500, 500, 500, 450, 400, 300],
            tiers: 7,
            // damageToNeutrals: [50, 100, 150, 200, 250, 400, 700],
            // damageToPets: [2, 2.3, 2.5, 2.7, 3, 3, 3],
            damage_to_zombies: [20, 40, 100, 300, 500, 1200, 3000],
            damage_to_buildings: [2, 3, 3, 3, 4, 4, 5],
            damage_to_players: [22, 24, 26, 28, 30, 32, 36],
            gold_costs: [100.0, 400.0, 2000.0, 7000.0, 24000.0, 60000.0, 120000.0],
            stone_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            wood_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            tokens_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            projectile_speed: [64, 68, 72, 75, 78, 82, 86],
            projectile_lifetime: [550, 550, 550, 550, 550, 550, 550],
            projectile_entity_knockback: [2, 2, 3, 4, 4, 4, 6],
            projectile_can_home: false,
            projectile_aoe_range: [0, 0, 0, 0, 0, 0, 0],
            description: "Shoot down your enemies from afar!",
        })),

        ("Dynamite", EquippableInfo::RangedWeaponInfo(RangedWeaponInfo {
            name: "Dynamite",
            class: "Tools",
            tiers: 7,
            gold_costs: [100.0, 400.0, 3000.0, 5000.0, 24000.0, 45000.0, 200000.0],
            // "damageToNeutrals": [50, 100, 150, 200, 250, 300, 500],
            // "damageToPets": [1, 1, 1, 1, 1, 1, 1],
            stone_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            wood_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            tokens_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            ms_between_fires: [500, 500, 500, 500, 500, 500, 500],
            damage_to_zombies: [30, 60, 90, 150, 300, 600, 800],
            damage_to_buildings: [0, 0, 0, 0, 0, 0, 0],
            damage_to_players: [0, 0, 0, 0, 0, 0, 0],
            projectile_speed: [36, 42, 46, 50, 54, 58, 60],
            projectile_lifetime: [700, 700, 700, 700, 700, 700, 700],
            projectile_can_home: false,
            projectile_entity_knockback: [2, 2, 3, 4, 4, 4, 6],
            projectile_aoe_range: [48, 48, 48, 48, 96, 96, 192],
            description: "This Dynamite will explode a short time after you throw it, damaging enemies in an area."
        })),

        ("ZombieShield", EquippableInfo::ZombieShieldInfo(ZombieShieldInfo {
            name: "ZombieShield",
            class: "Armour",
            tiers: 10,
            description: "This shield will give you a bonus protection against zombies.",
            gold_costs: [1_000.0, 3_000.0, 7_000.0, 14_000.0, 18_000.0, 22_000.0, 24_000.0, 30_000.0, 45_000.0, 70_000.0],
            wood_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            stone_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            tokens_costs: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            health: [500, 1000, 1800, 4000, 10000, 15000, 17500, 25000, 30000, 45000],
            health_regen_per_second: [50, 100, 200, 400, 1000, 2000, 3500, 5000, 6500, 8500],
            ms_before_health_regen: [10000, 9000, 8000, 7000, 6000, 6000, 6000, 6000, 6000, 6000]
        })),

        ("HealthPotion", EquippableInfo::HealthPotionInfo(HealthPotionInfo {
            name: "HealthPotion",
            class: "Potion",
            description: "Use this potion to instantly heal yourself.",
            gold_costs: [100.0],
            wood_costs: [0.0],
            stone_costs: [0.0],
            tokens_costs: [0.0],
            purchase_cooldown_ms: 15000
        }))
    ]);
}

pub fn grab_tool_info(tool_name: &str) -> Option<&EquippableInfo> {
    match tool_info.get(tool_name) {
        Some(tool) => Some(&tool),
        None => None,
    }
}

pub trait ToolTrait {
    fn class(&self) -> &str;
    fn upgrade(&mut self);
    fn name(&self) -> &str;
    fn tier(&self) -> u8;
}

#[derive(Debug, Clone, PartialEq)]
pub struct MeleeHarvestingTool {
    pub name: &'static str,
    pub class: &'static str,
    pub ms_between_fires: u16,
    pub tier: u8,
    pub range: u16,
    pub max_yaw_deviation: u16,
    pub harvest_amount: f32,
}

impl MeleeHarvestingTool {
    pub fn new(name: &'static str, tier: u8) -> Self {
        let pickaxe_info = grab_tool_info(name).unwrap().clone();

        let EquippableInfo::MeleeHarvestingToolInfo(pickaxe_info) = pickaxe_info else {
            unreachable!()
        };

        let tier_usize = (tier - 1) as usize;

        let ms_between_fires = pickaxe_info.ms_between_fires[tier_usize];
        let range = pickaxe_info.range[tier_usize];
        let max_yaw_deviation = pickaxe_info.max_yaw_deviation;
        let harvest_amount = pickaxe_info.harvest_amount[tier_usize];

        MeleeHarvestingTool {
            name,
            class: "Tools",
            ms_between_fires,
            tier,
            range,
            max_yaw_deviation,
            harvest_amount,
        }
    }
}

impl ToolTrait for MeleeHarvestingTool {
    fn upgrade(&mut self) {
        self.tier += 1;
        let tier_index_usize = (self.tier - 1) as usize;

        let pickaxe_info = grab_tool_info(&self.name).unwrap().clone();

        let EquippableInfo::MeleeHarvestingToolInfo(pickaxe_info) = pickaxe_info else {
            unreachable!()
        };

        self.ms_between_fires = pickaxe_info.ms_between_fires[tier_index_usize];
        self.range = pickaxe_info.range[tier_index_usize];
        self.max_yaw_deviation = pickaxe_info.max_yaw_deviation;
        self.harvest_amount = pickaxe_info.harvest_amount[tier_index_usize];
    }
    fn name(&self) -> &str {
        &self.name
    }
    fn tier(&self) -> u8 {
        self.tier
    }
    fn class(&self) -> &str {
        self.class
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct MeleeWeapon {
    pub name: &'static str,
    pub class: &'static str,
    pub ms_between_fires: u16,
    pub tier: u8,
    // pub damageToNeutrals: [50, 50, 50, 60, 70, 75, 90],
    // pub damageToPets: [3, 3.5, 4, 4.5, 5, 5.5, 5.5],
    pub damage_to_zombies: u16,
    pub damage_to_buildings: u16,
    pub damage_to_players: u16,
    pub range: u16,
    pub max_yaw_deviation: u16,
}

impl MeleeWeapon {
    pub fn new(name: &'static str, tier: u8) -> Self {
        let pickaxe_info = grab_tool_info(name).unwrap().clone();

        let EquippableInfo::MeleeWeaponInfo(pickaxe_info) = pickaxe_info else {
            unreachable!()
        };

        let tier_usize = (tier - 1) as usize;

        let ms_between_fires = pickaxe_info.ms_between_fires[tier_usize];
        let damage_to_zombies = pickaxe_info.damage_to_zombies[tier_usize];
        let damage_to_buildings = pickaxe_info.damage_to_buildings[tier_usize];
        let damage_to_players = pickaxe_info.damage_to_players[tier_usize];
        let range = pickaxe_info.range[tier_usize];
        let max_yaw_deviation = pickaxe_info.max_yaw_deviation;

        MeleeWeapon {
            name,
            class: "Tools",
            ms_between_fires,
            tier,
            damage_to_zombies,
            damage_to_buildings,
            damage_to_players,
            range,
            max_yaw_deviation,
        }
    }
}

impl ToolTrait for MeleeWeapon {
    fn upgrade(&mut self) {
        self.tier += 1;
        let tier_index_usize = (self.tier - 1) as usize;

        let item_info = grab_tool_info(&self.name).unwrap().clone();

        let EquippableInfo::MeleeWeaponInfo(item_info) = item_info else {
            unreachable!();
        };

        self.ms_between_fires = item_info.ms_between_fires[tier_index_usize];
        self.damage_to_zombies = item_info.damage_to_zombies[tier_index_usize];
        self.damage_to_buildings = item_info.damage_to_buildings[tier_index_usize];
        self.damage_to_players = item_info.damage_to_players[tier_index_usize];
        self.range = item_info.range[tier_index_usize];
    }
    fn name(&self) -> &str {
        &self.name
    }
    fn tier(&self) -> u8 {
        self.tier
    }
    fn class(&self) -> &str {
        self.class
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct RangedWeapon {
    pub name: &'static str,
    pub class: &'static str,
    pub ms_between_fires: u16,
    pub tier: u8,
    // pub damageToNeutrals: [50, 50, 50, 60, 70, 75, 90],
    // pub damageToPets: [3, 3.5, 4, 4.5, 5, 5.5, 5.5],
    pub damage_to_zombies: u16,
    pub damage_to_buildings: u16,
    pub damage_to_players: u16,
    pub projectile_speed: u16,
    pub projectile_lifetime: u16,
    pub projectile_entity_knockback: u8,
    pub projectile_aoe_range: u16,
    pub projectile_can_home: bool,
}

impl RangedWeapon {
    pub fn new(name: &'static str, tier: u8) -> Self {
        let pickaxe_info = grab_tool_info(name).unwrap().clone();

        let EquippableInfo::RangedWeaponInfo(pickaxe_info) = pickaxe_info else {
            unreachable!()
        };

        let tier_usize = (tier - 1) as usize;

        let ms_between_fires = pickaxe_info.ms_between_fires[tier_usize];

        let damage_to_zombies = pickaxe_info.damage_to_zombies[tier_usize];
        let damage_to_buildings = pickaxe_info.damage_to_buildings[tier_usize];
        let damage_to_players = pickaxe_info.damage_to_players[tier_usize];
        let projectile_speed = pickaxe_info.projectile_speed[tier_usize];
        let projectile_lifetime = pickaxe_info.projectile_lifetime[tier_usize];
        let projectile_entity_knockback = pickaxe_info.projectile_entity_knockback[tier_usize];
        let projectile_aoe_range =
            pickaxe_info.projectile_aoe_range[tier_usize];
        let projectile_can_home = pickaxe_info.projectile_can_home;

        RangedWeapon {
            name,
            class: "Tools",
            ms_between_fires,
            tier,
            damage_to_zombies,
            damage_to_buildings,
            damage_to_players,
            projectile_speed,
            projectile_lifetime,
            projectile_entity_knockback,
            projectile_aoe_range,
            projectile_can_home,
        }
    }
}

impl ToolTrait for RangedWeapon {
    fn upgrade(&mut self) {
        self.tier += 1;
        let tier_index_usize = (self.tier - 1) as usize;

        let item_info = grab_tool_info(&self.name).unwrap().clone();

        let EquippableInfo::RangedWeaponInfo(item_info) = item_info else {
            unreachable!();
        };

        self.ms_between_fires = item_info.ms_between_fires[tier_index_usize];
        self.damage_to_zombies = item_info.damage_to_zombies[tier_index_usize];
        self.damage_to_buildings = item_info.damage_to_buildings[tier_index_usize];
        self.damage_to_players = item_info.damage_to_players[tier_index_usize];
        self.projectile_speed = item_info.projectile_speed[tier_index_usize];
        self.projectile_lifetime = item_info.projectile_lifetime[tier_index_usize];
        self.projectile_entity_knockback = item_info.projectile_entity_knockback[tier_index_usize];
        self.projectile_aoe_range = item_info.projectile_aoe_range[tier_index_usize];
    }
    fn name(&self) -> &str {
        &self.name
    }
    fn tier(&self) -> u8 {
        self.tier
    }
    fn class(&self) -> &str {
        self.class
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct ZombieShield {
    pub name: &'static str,
    pub class: &'static str,
    pub tier: u8,
    pub health: u16,
    pub health_regen_per_second: u16,
    pub ms_before_health_regen: u16
}

impl ZombieShield {
    pub fn new(name: &'static str, tier: u8) -> Self {
        let shield_info = grab_tool_info(name).unwrap().clone();

        let EquippableInfo::ZombieShieldInfo(shield_info) = shield_info else {
            unreachable!()
        };

        let tier_usize = (tier - 1) as usize;

        let health = shield_info.health[tier_usize];
        let health_regen_per_second = shield_info.health_regen_per_second[tier_usize];
        let ms_before_health_regen = shield_info.ms_before_health_regen[tier_usize];

        ZombieShield {
            name,
            class: "Armour",
            tier,
            health,
            health_regen_per_second,
            ms_before_health_regen,
        }
    }
}

impl ToolTrait for ZombieShield {
    fn upgrade(&mut self) {
        self.tier += 1;
        let tier_index_usize = (self.tier - 1) as usize;

        let item_info = grab_tool_info(&self.name).unwrap().clone();

        let EquippableInfo::ZombieShieldInfo(item_info) = item_info else {
            unreachable!();
        };

        self.health = item_info.health[tier_index_usize];
        self.health_regen_per_second = item_info.health_regen_per_second[tier_index_usize];
        self.ms_before_health_regen = item_info.ms_before_health_regen[tier_index_usize];
    }
    fn name(&self) -> &str {
        &self.name
    }
    fn tier(&self) -> u8 {
        self.tier
    }
    fn class(&self) -> &str {
        self.class
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Equippables {
    MeleeHarvestingTool(MeleeHarvestingTool),
    MeleeWeapon(MeleeWeapon),
    RangedWeapon(RangedWeapon),
    ZombieShield(ZombieShield)
}

impl ToolTrait for Equippables {
    fn upgrade(&mut self) {
        match self {
            Equippables::MeleeHarvestingTool(item) => item.upgrade(),
            Equippables::MeleeWeapon(item) => item.upgrade(),
            Equippables::RangedWeapon(item) => item.upgrade(),
            Equippables::ZombieShield(item) => item.upgrade(),
        };
    }
    fn name(&self) -> &str {
        match self {
            Equippables::MeleeHarvestingTool(item) => item.name(),
            Equippables::MeleeWeapon(item) => item.name(),
            Equippables::RangedWeapon(item) => item.name(),
            Equippables::ZombieShield(item) => item.name(),
        }
    }
    fn tier(&self) -> u8 {
        match self {
            Equippables::MeleeHarvestingTool(item) => item.tier(),
            Equippables::MeleeWeapon(item) => item.tier(),
            Equippables::RangedWeapon(item) => item.tier(),
            Equippables::ZombieShield(item) => item.tier(),
        }
    }
    fn class(&self) -> &str {
        match self {
            Equippables::MeleeHarvestingTool(item) => item.class(),
            Equippables::MeleeWeapon(item) => item.class(),
            Equippables::RangedWeapon(item) => item.class(),
            Equippables::ZombieShield(item) => item.class(),
        }
    }
}
