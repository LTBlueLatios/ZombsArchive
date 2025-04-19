use bytebuffer::ByteBuffer;
use lazy_static::lazy_static;

use super::encode_rpc_types;

lazy_static! {
    pub static ref SERVER_RPCS: Vec<&'static str> = vec!["PartyKey", "PartyBuilding", "PartyRequest", "PartyRequestCancelled", "PartyRequestMet", "PartyMembersUpdated", "UpdateParty", "UpdateLeaderboard", "Respawned", "SetTool", "Dead", "ToolInfo", "BuildingInfo", "SpellInfo", "CastSpellResponse", "ClearActiveSpell", "EntityData", "Failure", "ReceiveChatMessage"];
}

#[derive(Debug)]
pub enum RpcPacket {
    ToolInfo(encode_rpc_types::ToolInfo::ToolInfoRpc),
    SetTool(encode_rpc_types::SetTool::SetToolRpc),
    UpdateParty(encode_rpc_types::UpdateParty::UpdatePartyRpc),
    PartyKey(encode_rpc_types::PartyKey::PartyKeyRpc),
    PartyRequest(encode_rpc_types::PartyRequest::PartyRequestRpc),
    PartyRequestMet(encode_rpc_types::PartyRequestMet::PartyRequestMetRpc),
    PartyMembersUpdated(encode_rpc_types::PartyMembersUpdated::PartyMembersUpdatedRpc),
    PartyRequestCancelled(encode_rpc_types::PartyRequestCancelled::PartyRequestCancelledRpc),
    Failure(encode_rpc_types::Failure::FailureRpc),
    BuildingInfo(encode_rpc_types::BuildingInfo::BuildingInfoRpc),
    PartyBuilding(encode_rpc_types::PartyBuilding::PartyBuildingRpc),
    Dead(encode_rpc_types::Dead::DeadRpc),
    Respawned(encode_rpc_types::Respawned::RespawnedRpc),
    SpellInfo(encode_rpc_types::SpellInfo::SpellInfoRpc),
    CastSpellResponse(encode_rpc_types::CastSpellResponse::CastSpellResponseRpc),
    ClearActiveSpell(encode_rpc_types::ClearActiveSpell::ClearActiveSpellRpc),
    UpdateLeaderboard(encode_rpc_types::UpdateLeaderboard::UpdateLeaderboardRpc),
    ReceiveChatMessage(encode_rpc_types::ReceiveChatMessage::ReceiveChatMessageRpc)
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: RpcPacket) {
    let rpc_name = match data {
        RpcPacket::ToolInfo(_) => "ToolInfo",
        RpcPacket::SetTool(_) => "SetTool",
        RpcPacket::UpdateParty(_) => "UpdateParty",
        RpcPacket::PartyKey(_) => "PartyKey",
        RpcPacket::PartyRequest(_) => "PartyRequest",
        RpcPacket::PartyRequestMet(_) => "PartyRequestMet",
        RpcPacket::PartyMembersUpdated(_) => "PartyMembersUpdated",
        RpcPacket::PartyRequestCancelled(_) => "PartyRequestCancelled",
        RpcPacket::Failure(_) => "Failure",
        RpcPacket::BuildingInfo(_) => "BuildingInfo",
        RpcPacket::PartyBuilding(_) => "PartyBuilding",
        RpcPacket::Dead(_) => "Dead",
        RpcPacket::Respawned(_) => "Respawned",
        RpcPacket::SpellInfo(_) => "SpellInfo",
        RpcPacket::CastSpellResponse(_) => "CastSpellResponse",
        RpcPacket::ClearActiveSpell(_) => "ClearActiveSpell",
        RpcPacket::UpdateLeaderboard(_) => "UpdateLeaderboard",
        RpcPacket::ReceiveChatMessage(_) => "ReceiveChatMessage"
    };

    let rpc_index = SERVER_RPCS.iter().position(|&name| name == rpc_name).expect("Rpc not found in SERVER_RPCS");

    byte_buffer.write_u8(rpc_index as u8);

    match data {
        RpcPacket::SetTool(rpc) => encode_rpc_types::SetTool::encode_rpc(byte_buffer, rpc),
        RpcPacket::ToolInfo(rpc) => encode_rpc_types::ToolInfo::encode_rpc(byte_buffer, rpc),
        RpcPacket::UpdateParty(rpc) => encode_rpc_types::UpdateParty::encode_rpc(byte_buffer, rpc),
        RpcPacket::PartyKey(rpc) => encode_rpc_types::PartyKey::encode_rpc(byte_buffer, rpc),
        RpcPacket::PartyRequest(rpc) => encode_rpc_types::PartyRequest::encode_rpc(byte_buffer, rpc),
        RpcPacket::PartyRequestMet(rpc) => encode_rpc_types::PartyRequestMet::encode_rpc(byte_buffer, rpc),
        RpcPacket::PartyMembersUpdated(rpc) => encode_rpc_types::PartyMembersUpdated::encode_rpc(byte_buffer, rpc),
        RpcPacket::PartyRequestCancelled(rpc) => encode_rpc_types::PartyRequestCancelled::encode_rpc(byte_buffer, rpc),
        RpcPacket::Failure(rpc) => encode_rpc_types::Failure::encode_rpc(byte_buffer, rpc),
        RpcPacket::BuildingInfo(rpc) => encode_rpc_types::BuildingInfo::encode_rpc(byte_buffer, rpc),
        RpcPacket::PartyBuilding(rpc) => encode_rpc_types::PartyBuilding::encode_rpc(byte_buffer, rpc),
        RpcPacket::Dead(rpc) => encode_rpc_types::Dead::encode_rpc(byte_buffer, rpc),
        RpcPacket::Respawned(rpc) => encode_rpc_types::Respawned::encode_rpc(byte_buffer, rpc),
        RpcPacket::SpellInfo(rpc) => encode_rpc_types::SpellInfo::encode_rpc(byte_buffer, rpc),
        RpcPacket::CastSpellResponse(rpc) => encode_rpc_types::CastSpellResponse::encode_rpc(byte_buffer, rpc),
        RpcPacket::ClearActiveSpell(rpc) => encode_rpc_types::ClearActiveSpell::encode_rpc(byte_buffer, rpc),
        RpcPacket::UpdateLeaderboard(rpc) => encode_rpc_types::UpdateLeaderboard::encode_rpc(byte_buffer, rpc),
        RpcPacket::ReceiveChatMessage(rpc) => encode_rpc_types::ReceiveChatMessage::encode_rpc(byte_buffer, rpc)
    }
}