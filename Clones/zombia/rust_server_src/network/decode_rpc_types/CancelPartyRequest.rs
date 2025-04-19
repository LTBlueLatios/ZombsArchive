use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct CancelPartyRequestRpc {}

pub fn decode_rpc(mut _byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let rpc = CancelPartyRequestRpc {};

    Ok(DecodedMessageEnum::Rpc(RpcPacket::CancelPartyRequest(rpc)))
}