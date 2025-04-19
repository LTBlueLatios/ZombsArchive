use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct LeavePartyRpc {}

pub fn decode_rpc(mut _byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let rpc = LeavePartyRpc {};

    Ok(DecodedMessageEnum::Rpc(RpcPacket::LeaveParty(rpc)))
}