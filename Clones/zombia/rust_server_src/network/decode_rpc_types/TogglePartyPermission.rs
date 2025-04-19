use bytebuffer::ByteBuffer;
use super::super::decode::DecodedMessageEnum;
use super::super::decode_rpc::RpcPacket;

#[derive(Debug)]
pub struct TogglePartyPermissionRpc {
    pub permission: Permissions,
    pub uid: u16
}

#[derive(Debug)]
pub enum Permissions {
    CanSell,
    CanPlace
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, std::io::Error> {
    let permission_u8 = byte_buffer.read_u8()?;

    let permission = match permission_u8 {
        0 => Permissions::CanSell,
        1 | _ => Permissions::CanPlace
    };

    let requested_uid = byte_buffer.read_u16()?;

    let rpc = TogglePartyPermissionRpc {
        permission: permission,
        uid: requested_uid
    };

    Ok(DecodedMessageEnum::Rpc(RpcPacket::TogglePartyPermission(rpc)))
}