use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct KickMemberRpc {
    pub uid: u16
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let member_uid = byte_buffer.read_u16()?;

    let rpc = KickMemberRpc {
        uid: member_uid
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::KickMember(rpc)))
}