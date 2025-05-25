use crate::entity_manager::entity_types::{EntityTypeEnum, Player};
use crate::entity_manager::manager::ENTITIES;
use crate::{ResourceCosts, CONFIG};
use crate::network::decode_rpc_types::BuyTool::BuyToolRpc;

use crate::info::equippables::{self, EquippableInfo, Equippables, HealthPotionInfo, ToolTrait, ZombieShieldInfo};
use crate::network::ws_server;

pub fn handle_rpc(player_entity: &Player, rpc: BuyToolRpc) {
    let tool_info = match equippables::grab_tool_info(&rpc.tool_name) {
        Some(info) => info,
        None => return
    };

    let mut tool_info_to_send: Vec<Equippables> = Vec::new();

    // Check if the player owns the tool already, upgrade if so
    let mut tool: Option<equippables::Equippables> = None;
    let mut tool_index_in_owned_items: Option<usize> = None;
    let mut owns_item = false;
    let mut upgrade_costs: Option<ResourceCosts> = None;
    let mut next_tier: Option<u8>;

    for (index, equippable) in player_entity.owned_items.iter().enumerate() {
        if equippable.name() == rpc.tool_name {
            owns_item = true;
            tool_index_in_owned_items = Some(index);

            next_tier = Some(equippable.tier() + 1);
            let next_tier_usize = next_tier.unwrap() as usize;

            let tier_count = match tool_info {
                EquippableInfo::MeleeHarvestingToolInfo(item) => item.tiers,
                EquippableInfo::MeleeWeaponInfo(item) => item.tiers,
                EquippableInfo::RangedWeaponInfo(item) => item.tiers,
                EquippableInfo::ZombieShieldInfo(zombie_shield_info) => zombie_shield_info.tiers,
                EquippableInfo::HealthPotionInfo(_) => 1,
            };

            if equippable.tier() >= tier_count {
                ws_server::send_failure(player_entity.generic_entity.uid, "You have met the maximum tier for this item!");
                return;
            }

            let costs = match tool_info {
                EquippableInfo::MeleeHarvestingToolInfo(info) => ResourceCosts {
                    gold_costs: info.gold_costs[next_tier_usize - 1],
                    stone_costs: info.stone_costs[next_tier_usize - 1],
                    wood_costs: info.wood_costs[next_tier_usize - 1],
                    tokens_costs: info.tokens_costs[next_tier_usize - 1],
                },
                EquippableInfo::MeleeWeaponInfo(info) => ResourceCosts {
                    gold_costs: info.gold_costs[next_tier_usize - 1],
                    stone_costs: info.stone_costs[next_tier_usize - 1],
                    wood_costs: info.wood_costs[next_tier_usize - 1],
                    tokens_costs: info.tokens_costs[next_tier_usize - 1],
                },
                EquippableInfo::RangedWeaponInfo(info) => ResourceCosts {
                    gold_costs: info.gold_costs[next_tier_usize - 1],
                    stone_costs: info.stone_costs[next_tier_usize - 1],
                    wood_costs: info.wood_costs[next_tier_usize - 1],
                    tokens_costs: info.tokens_costs[next_tier_usize - 1],
                },
                EquippableInfo::ZombieShieldInfo(info) => ResourceCosts {
                    gold_costs: info.gold_costs[next_tier_usize - 1],
                    stone_costs: info.stone_costs[next_tier_usize - 1],
                    wood_costs: info.wood_costs[next_tier_usize - 1],
                    tokens_costs: info.tokens_costs[next_tier_usize - 1],
                },
                EquippableInfo::HealthPotionInfo(info) => ResourceCosts {
                    gold_costs: info.gold_costs[next_tier_usize - 1],
                    stone_costs: info.stone_costs[next_tier_usize - 1],
                    wood_costs: info.wood_costs[next_tier_usize - 1],
                    tokens_costs: info.tokens_costs[next_tier_usize - 1],
                },
            };

            upgrade_costs = Some(costs);
            tool = Some(equippable.clone());
        }
    }

    if owns_item == true {
        let mut tool = tool.unwrap();
        let tool_index_in_owned_items = tool_index_in_owned_items.unwrap();

        let upgrade_costs = upgrade_costs.unwrap();

        let can_afford = player_entity.can_afford(&upgrade_costs);

        if !can_afford {
            ws_server::send_failure(player_entity.generic_entity.uid, "You do not have enough resources to purchase this item.");
            return;
        }

        player_entity.deduct_resource_costs(&upgrade_costs);

        tool.upgrade();

        match &tool {
            Equippables::ZombieShield(zombie_shield) => {
                player_entity.set_property("zombie_shield_health", Box::new(zombie_shield.health));
                player_entity.set_property("zombie_shield_max_health", Box::new(zombie_shield.health));
            }
            _ => {
                if player_entity.weapon_name == tool.name() {
                    player_entity.set_property("weapon_tier", Box::new(tool.tier()));
                    player_entity.set_property("equipped_item", Box::new(tool.clone()));
                }
            }
        };

        tool_info_to_send.push(tool.clone());
        player_entity.send_tools_to_client(tool_info_to_send);

        let mut owned_items_clone = player_entity.owned_items.clone();
        owned_items_clone[tool_index_in_owned_items] = tool;
        player_entity.set_property("owned_items", Box::new(owned_items_clone));

        return;
    }

    let tool = match tool_info {
        equippables::EquippableInfo::MeleeHarvestingToolInfo(_) => equippables::Equippables::MeleeHarvestingTool(equippables::MeleeHarvestingTool::new("Pickaxe", 1)),
        equippables::EquippableInfo::MeleeWeaponInfo(_) => equippables::Equippables::MeleeWeapon(equippables::MeleeWeapon::new("Sword", 1)),
        equippables::EquippableInfo::RangedWeaponInfo(_) => {
            match rpc.tool_name.as_str() {
                "Crossbow" => equippables::Equippables::RangedWeapon(equippables::RangedWeapon::new("Crossbow", 1)),
                "Dynamite" => equippables::Equippables::RangedWeapon(equippables::RangedWeapon::new("Dynamite", 1)),
                _ => unreachable!()
            }
        },
        EquippableInfo::ZombieShieldInfo(zombie_shield_info) => {
            handle_buy_armour(player_entity, zombie_shield_info);
            return;
        },
        EquippableInfo::HealthPotionInfo(health_potion_info) => {
            handle_buy_health_potion(player_entity, health_potion_info);
            return;
        },
    };

    let tool_costs = match tool_info {
        EquippableInfo::MeleeHarvestingToolInfo(info) => ResourceCosts {
            gold_costs: info.gold_costs[0],
            stone_costs: info.stone_costs[0],
            wood_costs: info.wood_costs[0],
            tokens_costs: info.tokens_costs[0],
        },
        EquippableInfo::MeleeWeaponInfo(info) => ResourceCosts {
            gold_costs: info.gold_costs[0],
            stone_costs: info.stone_costs[0],
            wood_costs: info.wood_costs[0],
            tokens_costs: info.tokens_costs[0],
        },
        EquippableInfo::RangedWeaponInfo(info) => ResourceCosts {
            gold_costs: info.gold_costs[0],
            stone_costs: info.stone_costs[0],
            wood_costs: info.wood_costs[0],
            tokens_costs: info.tokens_costs[0],
        },
        EquippableInfo::ZombieShieldInfo(_) => unreachable!(),
        EquippableInfo::HealthPotionInfo(_) => unreachable!(),
    };

    let can_afford = player_entity.can_afford(&tool_costs);

    if !can_afford {
        ws_server::send_failure(player_entity.generic_entity.uid, "You do not have enough resources to purchase this item.");
        return;
    }

    player_entity.deduct_resource_costs(&tool_costs);

    tool_info_to_send.push(tool.clone());

    let mut owned_items_clone = player_entity.owned_items.clone();
    owned_items_clone.push(tool);
    player_entity.set_property("owned_items", Box::new(owned_items_clone));

    player_entity.send_tools_to_client(tool_info_to_send);
}

fn handle_buy_health_potion(player_entity: &Player, health_potion_info: &HealthPotionInfo) {
    // Can't buy the health potion unless the player has been damaged
    if player_entity.health == player_entity.max_health {
        return;
    }

    if player_entity.action_timers.get("HealthPotion").unwrap().timer_active == true {
        return;
    }

    let potion_costs = ResourceCosts {
        gold_costs: health_potion_info.gold_costs[0],
        wood_costs: health_potion_info.wood_costs[0],
        stone_costs: health_potion_info.stone_costs[0],
        tokens_costs: health_potion_info.tokens_costs[0],
    };

    let can_afford = player_entity.can_afford(&potion_costs);

    if !can_afford {
        ws_server::send_failure(player_entity.generic_entity.uid, "You do not have enough resources to purchase this item.");
        return;
    }

    player_entity.deduct_resource_costs(&potion_costs);

    player_entity.set_property("health", Box::new(player_entity.max_health));

    let (tick_number, tick_rate) = CONFIG.with(|c| {
        let config = c.borrow();

        (config.tick_number, config.tick_rate)
    });

    ENTITIES.with(|e| {
        let mut entities = e.borrow_mut();
        let entity = entities.get_mut(&player_entity.generic_entity.uid).unwrap();

        let EntityTypeEnum::Player(entity) = entity else {
            unreachable!();
        };

        let action_timer = entity.action_timers.get_mut("HealthPotion").unwrap();
        action_timer.timer_active = true;
        action_timer.action_timeout_end_tick = tick_number + (health_potion_info.purchase_cooldown_ms / tick_rate) as u32;
    });
}

fn handle_buy_armour(player_entity: &Player, zombie_shield_info: &ZombieShieldInfo) {
    let armour_costs = ResourceCosts {
        gold_costs: zombie_shield_info.gold_costs[0],
        wood_costs: zombie_shield_info.wood_costs[0],
        stone_costs: zombie_shield_info.stone_costs[0],
        tokens_costs: zombie_shield_info.tokens_costs[0],
    };

    let can_afford = player_entity.can_afford(&armour_costs);

    if !can_afford {
        ws_server::send_failure(player_entity.generic_entity.uid, "You do not have enough resources to purchase this item.");
        return;
    }

    player_entity.deduct_resource_costs(&armour_costs);

    let mut tool_info_to_send: Vec<Equippables> = Vec::new();

    let armour = equippables::Equippables::ZombieShield(equippables::ZombieShield::new("ZombieShield", 1));

    tool_info_to_send.push(armour.clone());

    let mut owned_items_clone = player_entity.owned_items.clone();
    owned_items_clone.push(armour);
    player_entity.set_property("owned_items", Box::new(owned_items_clone));

    player_entity.send_tools_to_client(tool_info_to_send);

    player_entity.set_property("zombie_shield_health", Box::new(zombie_shield_info.health[0]));
    player_entity.set_property("zombie_shield_max_health", Box::new(zombie_shield_info.health[0]));
}