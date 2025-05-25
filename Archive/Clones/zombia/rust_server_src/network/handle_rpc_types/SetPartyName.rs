use crate::entity_manager::entity_types::Player;
use crate::network::decode_rpc_types::SetPartyName::SetPartyNameRpc;
use crate::{StringClamp, PARTIES};

pub fn handle_rpc(player_entity: &Player, rpc: SetPartyNameRpc) {
    PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        let party = parties.get_mut(&player_entity.party_id).unwrap();

        if party.leader_uid != player_entity.generic_entity.uid {
            return;
        }

        party.set_name(rpc.party_name.clamp_len(16));
    });
}