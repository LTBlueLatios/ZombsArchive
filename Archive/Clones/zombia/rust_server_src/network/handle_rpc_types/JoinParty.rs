use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::entity_manager::entity_types::Player;
use crate::entity_manager::manager::ENTITIES;
use crate::network::decode_rpc_types::JoinParty::JoinPartyRpc;
use crate::network::encode_rpc_types;
use crate::network::encode_rpc_types::PartyRequest::PartyRequestRpc;
use crate::network::ws_server;
use crate::network::ws_server::send_ws_message;
use crate::network::OPCODES;
use crate::network::encode_rpc;

use crate::CONFIG;

use crate::PARTIES;

pub fn handle_rpc(player_entity_ref: &Player, rpc: JoinPartyRpc) {
    // Can't join your own party
    if rpc.party_id == player_entity_ref.party_id {
        return;
    }

    // Players can only have one active party request
    match player_entity_ref.party_request_id {
        Some(_) => return,
        None => {}
    }

    let party_clone = PARTIES.with(|p| {
        let parties = p.borrow();
        match parties.get(&rpc.party_id) {
            Some(party) => Some(party.clone()),
            None => None
        }
    });

    let party_clone = match party_clone {
        Some(p) => p,
        None => return
    };
    let leader_uid = party_clone.leader_uid;

    let data = encode_rpc::RpcPacket::PartyRequest(PartyRequestRpc {
        player_name: player_entity_ref.name.clone(),
        player_uid: player_entity_ref.generic_entity.uid
    });

    let _ = send_ws_message(leader_uid, OPCODES::PacketRpc, crate::network::encode::EncodedMessageEnum::Rpc(data));

    let tick_number = CONFIG.with(|config| config.borrow().tick_number);

    ENTITIES.with(|e| {
        let mut entities = e.borrow_mut();
        let player_entity = entities.get_mut(&player_entity_ref.generic_entity.uid).unwrap();

        let EntityTypeEnum::Player(player_entity) = player_entity else {
            unreachable!();
        };

        player_entity.party_request_id = Some(rpc.party_id);
        player_entity.party_request_sent_tick = Some(tick_number);

        player_entity.wait_ticks(30000, |param_u16, param_u32| {
            let player_uid = param_u16.unwrap();
            let party_request_sent_tick = param_u32.unwrap();

            ENTITIES.with(|e| {
                let mut entities = e.borrow_mut();
                let player_entity = entities.get_mut(&player_uid);

                let Some(EntityTypeEnum::Player(player_entity)) = player_entity else {
                    return;
                };

                match player_entity.party_request_sent_tick {
                    Some(tick) => {
                        if tick != party_request_sent_tick {
                            return;
                        }
                    },
                    None => return
                }

                let data = encode_rpc::RpcPacket::PartyRequestMet(encode_rpc_types::PartyRequestMet::PartyRequestMetRpc {});
            
                ws_server::send_ws_message(player_uid, OPCODES::PacketRpc, crate::network::encode::EncodedMessageEnum::Rpc(data));

                player_entity.party_request_sent_tick = None;
                player_entity.party_request_id = None;
            });
        }, Some(player_entity_ref.generic_entity.uid), Some(tick_number));
    })
}