use crate::entity_manager::entity_types::{EntityTypeEnum, Player};
use crate::entity_manager::manager::ENTITIES;
use crate::network::decode_rpc_types::CancelPartyRequest::CancelPartyRequestRpc;
use crate::{CONFIG, PARTIES};

use crate::network::{encode, encode_rpc, encode_rpc_types, OPCODES, ws_server};

pub fn handle_rpc(player_entity: &Player, _rpc: CancelPartyRequestRpc) {
    let (party_id, party_request_sent_tick) = match player_entity.party_request_id {
        Some(id) => {
            (id, player_entity.party_request_sent_tick.unwrap())
        },
        None => return
    };

    let (tick_number, tick_rate) = CONFIG.with(|c| {
        let config = c.borrow();
        (config.tick_number, config.tick_rate)
    });

    // 2 second timer after requesting to join
    if tick_number - party_request_sent_tick < 2000 / tick_rate as u32 {
        return;
    }

    PARTIES.with(|parties| {
        let parties = parties.borrow();

        let party = parties.get(&party_id);

        if party.is_none() {
            return;
        }

        let party = party.unwrap();

        let request_cancelled_rpc = encode_rpc::RpcPacket::PartyRequestCancelled(encode_rpc_types::PartyRequestCancelled::PartyRequestCancelledRpc {
            player_uid: player_entity.generic_entity.uid
        });

        ws_server::send_ws_message(party.leader_uid, OPCODES::PacketRpc, encode::EncodedMessageEnum::Rpc(request_cancelled_rpc));

        let data = encode_rpc::RpcPacket::PartyRequestMet(encode_rpc_types::PartyRequestMet::PartyRequestMetRpc {});
    
        ws_server::send_ws_message(player_entity.generic_entity.uid, OPCODES::PacketRpc, crate::network::encode::EncodedMessageEnum::Rpc(data));

        ENTITIES.with(|e| {
            let mut entities = e.borrow_mut();
            let player_entity_mut = entities.get_mut(&player_entity.generic_entity.uid).unwrap();

            let EntityTypeEnum::Player(player_entity_mut) = player_entity_mut else {
                unreachable!();
            };

            player_entity_mut.party_request_id = None;
            player_entity_mut.party_request_sent_tick = None;
        });
    });
}