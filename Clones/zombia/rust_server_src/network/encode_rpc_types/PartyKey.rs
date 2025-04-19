use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct PartyKeyRpc {
    pub party_key: String
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: PartyKeyRpc) {
    byte_buffer.write_string(&data.party_key);
}