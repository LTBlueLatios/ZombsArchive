use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct EquipToolRpc {
    pub tool_name: String
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let tool_name = byte_buffer.read_string()?;

    let rpc = EquipToolRpc {
        tool_name
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::EquipTool(rpc)))
}