use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct RespawnedRpc {}

pub fn encode_rpc(_byte_buffer: &mut ByteBuffer, _data: RespawnedRpc) {}