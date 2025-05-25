use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct ClearActiveSpellRpc {
    pub name: String
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: ClearActiveSpellRpc) {
    byte_buffer.write_string(&data.name);
}