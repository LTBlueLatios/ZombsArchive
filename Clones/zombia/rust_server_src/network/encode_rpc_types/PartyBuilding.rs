use bytebuffer::ByteBuffer;

use crate::entity_manager::entity_types::generic_entity::Position;

#[derive(Debug)]
pub struct PartyBuildingRpc {
    pub buildings: Vec<Building>
}

#[derive(Clone, Debug)]
pub struct Building {
    pub dead: bool,
    pub tier: u8,
    pub model: String,
    pub uid: u16,
    pub position: Position,
    pub yaw: u16
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: PartyBuildingRpc) {
    byte_buffer.write_u16(data.buildings.len() as u16);

    for building in data.buildings.iter() {
        byte_buffer.write_u8(if building.dead == true { 1 } else { 0 });
        byte_buffer.write_u8(building.tier);
        byte_buffer.write_string(&building.model);
        byte_buffer.write_u16(building.uid);
        byte_buffer.write_i16(building.position.x);
        byte_buffer.write_i16(building.position.y);
        byte_buffer.write_u16(building.yaw);
    }

    // dbg!(data);
}