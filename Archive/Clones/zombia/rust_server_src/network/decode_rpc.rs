use bytebuffer::ByteBuffer;
use crate::network::decode_rpc_types;

use super::decode;

#[derive(Debug)]
pub enum RpcPacket {
    OutOfSync(decode_rpc_types::OutOfSync::OutOfSyncRpc),
    JoinParty(decode_rpc_types::JoinParty::JoinPartyRpc),
    PartyRequestResponse(decode_rpc_types::PartyRequestResponse::PartyRequestResponseRpc),
    TogglePartyPermission(decode_rpc_types::TogglePartyPermission::TogglePartyPermissionRpc),
    LeaveParty(decode_rpc_types::LeaveParty::LeavePartyRpc),
    KickMember(decode_rpc_types::KickMember::KickMemberRpc),
    TogglePartyVisibility(decode_rpc_types::TogglePartyVisibility::TogglePartyVisibilityRpc),
    SetPartyName(decode_rpc_types::SetPartyName::SetPartyNameRpc),
    RandomisePartyKey(decode_rpc_types::RandomisePartyKey::RandomisePartyKeyRpc),
    CancelPartyRequest(decode_rpc_types::CancelPartyRequest::CancelPartyRequestRpc),
    BuyTool(decode_rpc_types::BuyTool::BuyToolRpc),
    EquipTool(decode_rpc_types::EquipTool::EquipToolRpc),
    PlaceBuilding(decode_rpc_types::PlaceBuilding::PlaceBuildingRpc),
    SellBuilding(decode_rpc_types::SellBuilding::SellBuildingRpc),
    UpgradeBuilding(decode_rpc_types::UpgradeBuilding::UpgradeBuildingRpc),
    BuyHarvesterDrone(decode_rpc_types::BuyHarvesterDrone::BuyHarvesterDroneRpc),
    UpdateHarvesterTarget(decode_rpc_types::UpdateHarvesterTarget::UpdateHarvesterTargetRpc),
    Respawn(decode_rpc_types::Respawn::RespawnRpc),
    CastSpell(decode_rpc_types::CastSpell::CastSpellRpc),
    SendChatMessage(decode_rpc_types::SendChatMessage::SendChatMessageRpc)
}

pub fn decode_rpc(mut byte_buffer: ByteBuffer) -> Result<decode::DecodedMessageEnum, &'static str> {
    let rpc_types = vec![
        "OutOfSync",
        "RandomisePartyKey",
        "CancelPartyRequest",
        "TogglePartyVisibility",
        "Respawn",
        "TogglePrimaryAggro",
        "LeaveParty",
        "UpgradeBuilding",
        "SellBuilding",
        "UpdateHarvesterTarget",
        "BuyHarvesterDrone",
        "SendChatMessage",
        "SetPartyName",
        "JoinParty",
        "KickMember",
        "TogglePartyPermission",
        "PartyRequest",
        "PartyRequestResponse",
        "PlaceBuilding",
        "BuyTool",
        "EquipTool",
        "CastSpell",
        "Admin",
        "AdminCommand"
    ];

    let rpc_index = byte_buffer.read_u8().unwrap() as usize;

    if rpc_index > rpc_types.len() - 1 {
        return Err("Attempted to index rpc out of array bounds");
    }

    let rpc_type = rpc_types[rpc_index];

    let rpc_packet_result = match rpc_type {
        "OutOfSync" => decode_rpc_types::OutOfSync::decode_rpc(byte_buffer),
        "JoinParty" => decode_rpc_types::JoinParty::decode_rpc(byte_buffer),
        "PartyRequestResponse" => decode_rpc_types::PartyRequestResponse::decode_rpc(byte_buffer),
        "TogglePartyPermission" => decode_rpc_types::TogglePartyPermission::decode_rpc(byte_buffer),
        "LeaveParty" => decode_rpc_types::LeaveParty::decode_rpc(byte_buffer),
        "KickMember" => decode_rpc_types::KickMember::decode_rpc(byte_buffer),
        "TogglePartyVisibility" => decode_rpc_types::TogglePartyVisibility::decode_rpc(byte_buffer),
        "SetPartyName" => decode_rpc_types::SetPartyName::decode_rpc(byte_buffer),
        "RandomisePartyKey" => decode_rpc_types::RandomisePartyKey::decode_rpc(byte_buffer),
        "CancelPartyRequest" => decode_rpc_types::CancelPartyRequest::decode_rpc(byte_buffer),
        "BuyTool" => decode_rpc_types::BuyTool::decode_rpc(byte_buffer),
        "EquipTool" => decode_rpc_types::EquipTool::decode_rpc(byte_buffer),
        "PlaceBuilding" => decode_rpc_types::PlaceBuilding::decode_rpc(byte_buffer),
        "SellBuilding" => decode_rpc_types::SellBuilding::decode_rpc(byte_buffer),
        "UpgradeBuilding" => decode_rpc_types::UpgradeBuilding::decode_rpc(byte_buffer),
        "BuyHarvesterDrone" => decode_rpc_types::BuyHarvesterDrone::decode_rpc(byte_buffer),
        "UpdateHarvesterTarget" => decode_rpc_types::UpdateHarvesterTarget::decode_rpc(byte_buffer),
        "Respawn" => decode_rpc_types::Respawn::decode_rpc(byte_buffer),
        "CastSpell" => decode_rpc_types::CastSpell::decode_rpc(byte_buffer),
        "SendChatMessage" => decode_rpc_types::SendChatMessage::decode_rpc(byte_buffer),
        _ => return Err("Failed to decode RPC")
    };

    let rpc_packet = match rpc_packet_result {
        Ok(res) => res,
        Err(_) => return Err("Failed to decode RPC")
    };

    Ok(rpc_packet)
}