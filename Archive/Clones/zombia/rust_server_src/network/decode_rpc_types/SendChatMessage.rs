use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct SendChatMessageRpc {
    pub message: String,
    pub channel: String
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let message = byte_buffer.read_string()?;
    let channel = byte_buffer.read_string()?;

    let rpc = SendChatMessageRpc {
        message,
        channel
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::SendChatMessage(rpc)))
}