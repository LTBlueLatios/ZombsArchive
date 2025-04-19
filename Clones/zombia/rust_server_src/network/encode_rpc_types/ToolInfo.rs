use bytebuffer::ByteBuffer;
use crate::info;

#[derive(Debug)]
pub struct ToolInfoRpc {
    pub tool_info: Vec<info::equippables::EquippableInfo>
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: ToolInfoRpc) {
    for tool in data.tool_info {
        match tool {
            info::equippables::EquippableInfo::MeleeHarvestingToolInfo(harvesting_tool) => {
                byte_buffer.write_string(&harvesting_tool.name);

                byte_buffer.write_string(&harvesting_tool.class);

                for i in harvesting_tool.ms_between_fires {
                    byte_buffer.write_u16(i);
                }

                for i in harvesting_tool.gold_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in harvesting_tool.wood_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in harvesting_tool.stone_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in harvesting_tool.tokens_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in harvesting_tool.range {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_u16(harvesting_tool.max_yaw_deviation);

                for i in harvesting_tool.harvest_amount {
                    byte_buffer.write_u32(i as u32);
                }

                byte_buffer.write_string(&harvesting_tool.description);
            },
            info::equippables::EquippableInfo::MeleeWeaponInfo(melee_weapon) => {
                byte_buffer.write_string(&melee_weapon.name);

                byte_buffer.write_string(&melee_weapon.class);

                for i in melee_weapon.ms_between_fires {
                    byte_buffer.write_u16(i);
                }

                for i in melee_weapon.damage_to_zombies {
                    byte_buffer.write_u16(i);
                }

                for i in melee_weapon.damage_to_buildings {
                    byte_buffer.write_u16(i);
                }

                for i in melee_weapon.damage_to_players {
                    byte_buffer.write_u16(i);
                }

                for i in melee_weapon.gold_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in melee_weapon.wood_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in melee_weapon.stone_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in melee_weapon.tokens_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in melee_weapon.range {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_u16(melee_weapon.max_yaw_deviation);

                byte_buffer.write_string(&melee_weapon.description);
            },
            info::equippables::EquippableInfo::RangedWeaponInfo(ranged_weapon) => {
                byte_buffer.write_string(&ranged_weapon.name);

                byte_buffer.write_string(&ranged_weapon.class);

                for i in ranged_weapon.ms_between_fires {
                    byte_buffer.write_u16(i);
                }

                for i in ranged_weapon.damage_to_zombies {
                    byte_buffer.write_u16(i);
                }

                for i in ranged_weapon.damage_to_buildings {
                    byte_buffer.write_u16(i);
                }

                for i in ranged_weapon.damage_to_players {
                    byte_buffer.write_u16(i);
                }

                for i in ranged_weapon.gold_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in ranged_weapon.wood_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in ranged_weapon.stone_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in ranged_weapon.tokens_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in ranged_weapon.projectile_speed {
                    byte_buffer.write_u16(i);
                }

                for i in ranged_weapon.projectile_lifetime {
                    byte_buffer.write_u16(i);
                }

                for i in ranged_weapon.projectile_entity_knockback {
                    byte_buffer.write_u8(i);
                }

                for i in ranged_weapon.projectile_aoe_range {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_u8(if ranged_weapon.projectile_can_home { 1 } else { 0 });

                byte_buffer.write_string(&ranged_weapon.description);
            }
            info::equippables::EquippableInfo::ZombieShieldInfo(zombie_shield_info) => {
                byte_buffer.write_string(&zombie_shield_info.name);

                byte_buffer.write_string(&zombie_shield_info.class);

                byte_buffer.write_string(&zombie_shield_info.description);

                for i in zombie_shield_info.gold_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in zombie_shield_info.wood_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in zombie_shield_info.stone_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in zombie_shield_info.tokens_costs {
                    byte_buffer.write_u32(i as u32);
                }

                for i in zombie_shield_info.health {
                    byte_buffer.write_u16(i);
                }

                for i in zombie_shield_info.health_regen_per_second {
                    byte_buffer.write_u16(i);
                }

                for i in zombie_shield_info.ms_before_health_regen {
                    byte_buffer.write_u16(i);
                }
            }
            info::equippables::EquippableInfo::HealthPotionInfo(health_potion_info) => {
                byte_buffer.write_string(&health_potion_info.name);

                byte_buffer.write_string(&health_potion_info.class);

                byte_buffer.write_string(&health_potion_info.description);

                byte_buffer.write_u32(health_potion_info.gold_costs[0] as u32);
                byte_buffer.write_u32(health_potion_info.wood_costs[0] as u32);
                byte_buffer.write_u32(health_potion_info.stone_costs[0] as u32);
                byte_buffer.write_u32(health_potion_info.tokens_costs[0] as u32);
            }
        }
    }
}