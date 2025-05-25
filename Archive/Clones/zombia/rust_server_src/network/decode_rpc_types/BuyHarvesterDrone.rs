use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct BuyHarvesterDroneRpc {
    pub harvester_uid: u16
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let harvester_uid = byte_buffer.read_u16()?;

    let rpc = BuyHarvesterDroneRpc {
        harvester_uid
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::BuyHarvesterDrone(rpc)))
}