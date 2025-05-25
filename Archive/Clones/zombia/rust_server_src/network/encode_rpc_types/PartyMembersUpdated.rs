use bytebuffer::ByteBuffer;

#[derive(Debug, Clone)]
pub struct PartyMembersUpdatedRpc {
    pub member_list: Vec<PartyMember>
}

#[derive(Debug, Clone)]
pub struct PartyMember {
    pub can_place: bool,
    pub can_sell: bool,
    pub name: String,
    pub uid: u16,
    pub is_leader: bool
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: PartyMembersUpdatedRpc) {
    byte_buffer.write_u16(data.member_list.len() as u16);

    for member in data.member_list.iter() {
        byte_buffer.write_u8(if member.can_place == true { 1 } else { 0 });
        byte_buffer.write_u8(if member.can_sell == true { 1 } else { 0 });
        byte_buffer.write_string(&member.name);
        byte_buffer.write_u16(member.uid);
        byte_buffer.write_u8(if member.is_leader == true { 1 } else { 0 });
    }
}