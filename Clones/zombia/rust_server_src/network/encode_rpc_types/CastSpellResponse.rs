use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct CastSpellResponseRpc {
    pub name: String,
    pub cooldown_ms: u32,
    pub icon_cooldown_ms: u32
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: CastSpellResponseRpc) {
    byte_buffer.write_string(&data.name);
    byte_buffer.write_u32(data.cooldown_ms);
    byte_buffer.write_u32(data.icon_cooldown_ms);
}