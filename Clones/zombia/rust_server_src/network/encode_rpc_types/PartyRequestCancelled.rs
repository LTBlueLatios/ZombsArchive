use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct PartyRequestCancelledRpc {
    pub player_uid: u16
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: PartyRequestCancelledRpc) {
    byte_buffer.write_u16(data.player_uid);
}