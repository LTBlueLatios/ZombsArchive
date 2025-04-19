use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct PartyRequestRpc {
    pub player_name: String,
    pub player_uid: u16
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: PartyRequestRpc) {
    byte_buffer.write_string(&data.player_name);
    byte_buffer.write_u16(data.player_uid);
}