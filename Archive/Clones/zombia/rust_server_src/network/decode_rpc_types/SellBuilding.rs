use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct SellBuildingRpc {
    pub building_uids: Vec<u16>
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let vec_len = byte_buffer.read_u16()?;


    let mut building_uids: Vec<u16> = Vec::new();
    for _ in 1..=vec_len {
        building_uids.push(byte_buffer.read_u32()? as u16);
    }

    let rpc = SellBuildingRpc {
        building_uids
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::SellBuilding(rpc)))
}