use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct ReceiveChatMessageRpc {
    pub channel: String,
    pub name: String,
    pub message: String
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: ReceiveChatMessageRpc) {
    byte_buffer.write_string(&data.channel);
    byte_buffer.write_string(&data.name);
    byte_buffer.write_string(&data.message);
}