use bytebuffer::ByteBuffer;
use crate::info::spells::SpellInfo;

#[derive(Debug)]
pub struct SpellInfoRpc {
    pub spell_info: Vec<SpellInfo>
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: SpellInfoRpc) {
    for spell in data.spell_info {
        match spell {
            SpellInfo::Timeout(timeout_spell) => {
                byte_buffer.write_string(&timeout_spell.common.name);

                byte_buffer.write_string(&timeout_spell.common.description);

                byte_buffer.write_u32(timeout_spell.common.costs.gold_costs as u32);
                byte_buffer.write_u32(timeout_spell.common.costs.wood_costs as u32);
                byte_buffer.write_u32(timeout_spell.common.costs.stone_costs as u32);
            },
            SpellInfo::Rapidfire(rapidfire_spell) => {
                byte_buffer.write_string(&rapidfire_spell.common.name);

                byte_buffer.write_string(&rapidfire_spell.common.description);

                byte_buffer.write_u32(rapidfire_spell.common.costs.gold_costs as u32);
                byte_buffer.write_u32(rapidfire_spell.common.costs.wood_costs as u32);
                byte_buffer.write_u32(rapidfire_spell.common.costs.stone_costs as u32);

                byte_buffer.write_u32(rapidfire_spell.radius)
            }
        }
    }
}