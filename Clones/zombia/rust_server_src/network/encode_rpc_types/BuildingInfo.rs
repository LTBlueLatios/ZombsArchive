use bytebuffer::ByteBuffer;
use crate::info;
use crate::info::buildings;

#[derive(Debug)]
pub struct BuildingInfoRpc {
    pub building_info: Vec<info::buildings::BuildingInfoEnum>
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: BuildingInfoRpc) {
    for (index, building_info) in data.building_info.iter().enumerate() {
        match building_info {
            buildings::BuildingInfoEnum::Base(building) => {
                byte_buffer.write_string(&building.name);

                let mut gold_costs: Vec<u32> = vec![];
                let mut wood_costs: Vec<u32> = vec![];
                let mut stone_costs: Vec<u32> = vec![];
                let mut tokens_costs: Vec<u32> = vec![];

                for i in &building.resource_costs {
                    gold_costs.push(i.gold_costs as u32);
                    wood_costs.push(i.wood_costs as u32);
                    stone_costs.push(i.stone_costs as u32);
                    tokens_costs.push(i.tokens_costs as u32);
                }

                for i in gold_costs {
                    byte_buffer.write_u32(i);
                }

                for i in wood_costs {
                    byte_buffer.write_u32(i);
                }

                for i in stone_costs {
                    byte_buffer.write_u32(i);
                }

                for i in tokens_costs {
                    byte_buffer.write_u32(i);
                }

                for i in building.health {
                    byte_buffer.write_u16(i);
                }

                for i in building.ms_before_health_regen {
                    byte_buffer.write_u16(i);
                }

                for i in building.health_regen_per_second {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_i16(building.grid_width);
    
                byte_buffer.write_i16(building.grid_height);

                byte_buffer.write_u8(if building.limit_static == true { 1 } else { 0 });

                byte_buffer.write_u16(building.limit_per_member);

                byte_buffer.write_string(&building.description);
            },
            buildings::BuildingInfoEnum::Ranged(building) => {
                let building_base_info = &building.base_info;
                byte_buffer.write_string(&building_base_info.name);

                let mut gold_costs: Vec<u32> = vec![];
                let mut wood_costs: Vec<u32> = vec![];
                let mut stone_costs: Vec<u32> = vec![];
                let mut tokens_costs: Vec<u32> = vec![];

                for i in &building_base_info.resource_costs {
                    gold_costs.push(i.gold_costs as u32);
                    wood_costs.push(i.wood_costs as u32);
                    stone_costs.push(i.stone_costs as u32);
                    tokens_costs.push(i.tokens_costs as u32);
                }

                for i in gold_costs {
                    byte_buffer.write_u32(i);
                }

                for i in wood_costs {
                    byte_buffer.write_u32(i);
                }

                for i in stone_costs {
                    byte_buffer.write_u32(i);
                }

                for i in tokens_costs {
                    byte_buffer.write_u32(i);
                }

                for i in building_base_info.health {
                    byte_buffer.write_u16(i);
                }

                for i in building_base_info.ms_before_health_regen {
                    byte_buffer.write_u16(i);
                }

                for i in building_base_info.health_regen_per_second {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_i16(building_base_info.grid_width);
    
                byte_buffer.write_i16(building_base_info.grid_height);

                byte_buffer.write_u8(if building_base_info.limit_static == true { 1 } else { 0 });

                byte_buffer.write_u16(building_base_info.limit_per_member);

                byte_buffer.write_string(&building_base_info.description);

                for i in building.ms_between_fires {
                    byte_buffer.write_u32(i);
                }

                for i in building.tower_range {
                    byte_buffer.write_u32(i);
                }

                for i in building.damage_to_zombies {
                    byte_buffer.write_u16(i);
                }

                for i in building.damage_to_players {
                    byte_buffer.write_u16(i);
                }

                for i in building.damage_to_pets {
                    byte_buffer.write_u16(i);
                }

                for i in building.damage_to_neutrals {
                    byte_buffer.write_u16(i);
                }

                for i in building.projectile_speed {
                    byte_buffer.write_u32(i);
                }

                for i in building.projectile_aoe_range {
                    byte_buffer.write_u16(i);
                }
            },
            buildings::BuildingInfoEnum::Melee(building) => {
                let building_base_info = &building.base_info;
                byte_buffer.write_string(&building_base_info.name);

                let mut gold_costs: Vec<u32> = vec![];
                let mut wood_costs: Vec<u32> = vec![];
                let mut stone_costs: Vec<u32> = vec![];
                let mut tokens_costs: Vec<u32> = vec![];

                for i in &building_base_info.resource_costs {
                    gold_costs.push(i.gold_costs as u32);
                    wood_costs.push(i.wood_costs as u32);
                    stone_costs.push(i.stone_costs as u32);
                    tokens_costs.push(i.tokens_costs as u32);
                }

                for i in gold_costs {
                    byte_buffer.write_u32(i);
                }

                for i in wood_costs {
                    byte_buffer.write_u32(i);
                }

                for i in stone_costs {
                    byte_buffer.write_u32(i);
                }

                for i in tokens_costs {
                    byte_buffer.write_u32(i);
                }

                for i in building_base_info.health {
                    byte_buffer.write_u16(i);
                }

                for i in building_base_info.ms_before_health_regen {
                    byte_buffer.write_u16(i);
                }

                for i in building_base_info.health_regen_per_second {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_i16(building_base_info.grid_width);
    
                byte_buffer.write_i16(building_base_info.grid_height);

                byte_buffer.write_u8(if building_base_info.limit_static == true { 1 } else { 0 });

                byte_buffer.write_u16(building_base_info.limit_per_member);

                byte_buffer.write_string(&building_base_info.description);

                for i in building.ms_between_fires {
                    byte_buffer.write_u32(i);
                }

                for i in building.tower_range {
                    byte_buffer.write_u32(i);
                }

                for i in building.damage_to_zombies {
                    byte_buffer.write_u16(i);
                }

                for i in building.damage_to_players {
                    byte_buffer.write_u16(i);
                }

                for i in building.damage_to_pets {
                    byte_buffer.write_u16(i);
                }

                for i in building.damage_to_neutrals {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_u16(building.max_yaw_deviation);
            },
            buildings::BuildingInfoEnum::Drill(building) => {
                let building_base_info = &building.base_info;
                byte_buffer.write_string(&building_base_info.name);

                let mut gold_costs: Vec<u32> = vec![];
                let mut wood_costs: Vec<u32> = vec![];
                let mut stone_costs: Vec<u32> = vec![];
                let mut tokens_costs: Vec<u32> = vec![];

                for i in &building_base_info.resource_costs {
                    gold_costs.push(i.gold_costs as u32);
                    wood_costs.push(i.wood_costs as u32);
                    stone_costs.push(i.stone_costs as u32);
                    tokens_costs.push(i.tokens_costs as u32);
                }

                for i in gold_costs {
                    byte_buffer.write_u32(i);
                }

                for i in wood_costs {
                    byte_buffer.write_u32(i);
                }

                for i in stone_costs {
                    byte_buffer.write_u32(i);
                }

                for i in tokens_costs {
                    byte_buffer.write_u32(i);
                }

                for i in building_base_info.health {
                    byte_buffer.write_u16(i);
                }

                for i in building_base_info.ms_before_health_regen {
                    byte_buffer.write_u16(i);
                }

                for i in building_base_info.health_regen_per_second {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_i16(building_base_info.grid_width);
    
                byte_buffer.write_i16(building_base_info.grid_height);

                byte_buffer.write_u8(if building_base_info.limit_static == true { 1 } else { 0 });

                byte_buffer.write_u16(building_base_info.limit_per_member);

                byte_buffer.write_string(&building_base_info.description);


                for i in building.gold_per_second {
                    byte_buffer.write_u16(i);
                }
            },
            buildings::BuildingInfoEnum::Harvester(building) => {
                let building_base_info = &building.base_info;
                byte_buffer.write_string(&building_base_info.name);

                let mut gold_costs: Vec<u32> = vec![];
                let mut wood_costs: Vec<u32> = vec![];
                let mut stone_costs: Vec<u32> = vec![];
                let mut tokens_costs: Vec<u32> = vec![];

                for i in &building_base_info.resource_costs {
                    gold_costs.push(i.gold_costs as u32);
                    wood_costs.push(i.wood_costs as u32);
                    stone_costs.push(i.stone_costs as u32);
                    tokens_costs.push(i.tokens_costs as u32);
                }

                for i in gold_costs {
                    byte_buffer.write_u32(i);
                }

                for i in wood_costs {
                    byte_buffer.write_u32(i);
                }

                for i in stone_costs {
                    byte_buffer.write_u32(i);
                }

                for i in tokens_costs {
                    byte_buffer.write_u32(i);
                }

                for i in building_base_info.health {
                    byte_buffer.write_u16(i);
                }

                for i in building_base_info.ms_before_health_regen {
                    byte_buffer.write_u16(i);
                }

                for i in building_base_info.health_regen_per_second {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_i16(building_base_info.grid_width);
    
                byte_buffer.write_i16(building_base_info.grid_height);

                byte_buffer.write_u8(if building_base_info.limit_static == true { 1 } else { 0 });

                byte_buffer.write_u16(building_base_info.limit_per_member);

                byte_buffer.write_string(&building_base_info.description);

                for i in building.max_drone_count {
                    byte_buffer.write_u8(i);
                }

                for i in building.harvest_range {
                    byte_buffer.write_u16(i);
                }

                byte_buffer.write_u16(building.drone_gold_costs);
            }
        }

        // Tell the client whether or not there is another building
        if index == data.building_info.len() - 1 {
            byte_buffer.write_u8(0);
        } else {
            byte_buffer.write_u8(1);
        }
    }
}