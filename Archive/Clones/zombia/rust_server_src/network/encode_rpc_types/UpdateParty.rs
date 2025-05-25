use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct UpdatePartyRpc {
    pub parties: Vec<Party>
}

#[derive(Debug)]
pub struct Party {
    pub is_open: bool,
    pub party_name: String,
    pub party_id: u32,
    pub member_count: u8,
    pub member_limit: u8
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: UpdatePartyRpc) {
    let parties = data.parties;

    byte_buffer.write_u16(parties.len() as u16);

    for party in parties.iter() {
        byte_buffer.write_u8(if party.is_open == true { 1 } else { 0 });
        byte_buffer.write_u32(party.party_id);
        byte_buffer.write_string(&party.party_name);
        byte_buffer.write_u8(party.member_count);
        byte_buffer.write_u8(party.member_limit);
    }
}