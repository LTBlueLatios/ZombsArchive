use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct JoinPartyRpc {
    pub party_id: u32
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let party_id = byte_buffer.read_u32()?;

    let rpc = JoinPartyRpc {
        party_id
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::JoinParty(rpc)))
}