use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct PartyRequestResponseRpc {
    pub accepted: bool,
    pub requested_uid: u16
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let request_accepted_u8 = byte_buffer.read_u8()?;

    let accepted = if request_accepted_u8 == 1 { true } else { false};
    let requested_uid = byte_buffer.read_u16()?;

    let rpc = PartyRequestResponseRpc {
        accepted,
        requested_uid
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::PartyRequestResponse(rpc)))
}