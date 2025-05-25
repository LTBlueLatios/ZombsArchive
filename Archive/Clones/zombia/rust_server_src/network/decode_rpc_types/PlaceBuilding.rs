use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct PlaceBuildingRpc {
    pub x: i16,
    pub y: i16,
    pub model: String,
    pub yaw: u16
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let x = byte_buffer.read_i16()?;
    let y = byte_buffer.read_i16()?;
    let model = byte_buffer.read_string()?;
    let yaw = byte_buffer.read_u16()?;

    let rpc = PlaceBuildingRpc {
        x,
        y,
        model,
        yaw
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::PlaceBuilding(rpc)))
}