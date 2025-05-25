use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct CastSpellRpc {
    pub spell_name: String,
    pub x: i16,
    pub y: i16
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let spell_name = byte_buffer.read_string()?;
    let x = byte_buffer.read_i16()?;
    let y = byte_buffer.read_i16()?;

    let rpc = CastSpellRpc {
        spell_name,
        x,
        y
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::CastSpell(rpc)))
}