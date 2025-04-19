use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct FailureRpc {
    pub message: String
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: FailureRpc) {
    byte_buffer.write_string(&data.message);
}