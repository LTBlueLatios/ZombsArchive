use bytebuffer::ByteBuffer;

use crate::info::equippables;

#[derive(Debug)]
pub struct SetToolRpc {
    pub equippables: Vec<equippables::Equippables>
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: SetToolRpc) {
    byte_buffer.write_u16(data.equippables.len() as u16);

    for owned_item in data.equippables.iter() {
        match owned_item {
            equippables::Equippables::MeleeHarvestingTool(item) => {
                byte_buffer.write_string(&item.name);
                byte_buffer.write_u8(item.tier);
            },
            equippables::Equippables::MeleeWeapon(item) => {
                byte_buffer.write_string(&item.name);
                byte_buffer.write_u8(item.tier);
            },
            equippables::Equippables::RangedWeapon(item) => {
                byte_buffer.write_string(&item.name);
                byte_buffer.write_u8(item.tier);
            },
            equippables::Equippables::ZombieShield(item) => {
                byte_buffer.write_string(&item.name);
                byte_buffer.write_u8(item.tier);
            }
        }
    }
}