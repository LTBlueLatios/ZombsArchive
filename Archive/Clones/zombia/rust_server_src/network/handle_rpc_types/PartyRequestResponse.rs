use crate::entity_manager::entity_types::Player;
use crate::entity_manager::manager::ENTITIES;
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::network::decode_rpc_types::PartyRequestResponse::PartyRequestResponseRpc;
use crate::network::encode_rpc_types::PartyRequestMet::PartyRequestMetRpc;
use crate::PARTIES;
use crate::network::ws_server::send_ws_message;
use crate::network::encode_rpc;
use crate::network::OPCODES;

pub fn handle_rpc(player_entity: &Player, rpc: PartyRequestResponseRpc) {
    let requested_player_info = ENTITIES.with(|e| {
        let entities = e.borrow();
        match entities.get(&rpc.requested_uid) {
            Some(EntityTypeEnum::Player(player_entity)) => {
                Some((player_entity.party_request_id, player_entity.party_id))
            },
            _ => None
        }
    });

    let (requested_player_entity_request_id, requested_player_party_id) = match requested_player_info {
        Some(e) => match e.0 {
            Some(party_request_id) => (party_request_id, e.1),
            None => return
        },
        None => return
    };

    if requested_player_entity_request_id != player_entity.party_id {
        return;
    }

    if rpc.accepted == true {
        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let player_entity = entities.get_mut(&rpc.requested_uid).unwrap();

            let EntityTypeEnum::Player(player_entity) = player_entity else {
                unreachable!();
            };

            player_entity.party_request_id = None;
            player_entity.party_request_sent_tick = None;
        });

        PARTIES.with(|parties| {
            let mut parties = parties.borrow_mut();

            {
                let accepting_party = parties.get(&player_entity.party_id).unwrap();

                if accepting_party.member_count >= accepting_party.member_limit {
                    return;
                }
            }

            let requesting_party = parties.get_mut(&requested_player_party_id).unwrap();
            requesting_party.remove_member(rpc.requested_uid, false);

            let accepting_party = parties.get_mut(&player_entity.party_id).unwrap();
            accepting_party.add_member(rpc.requested_uid).unwrap();
        });
    }

    let data = encode_rpc::RpcPacket::PartyRequestMet(PartyRequestMetRpc {});

    send_ws_message(rpc.requested_uid, OPCODES::PacketRpc, crate::network::encode::EncodedMessageEnum::Rpc(data));
}