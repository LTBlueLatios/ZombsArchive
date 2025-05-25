use crate::entity_manager::entity_types::Player;
use crate::network::decode_rpc_types::LeaveParty::LeavePartyRpc;
use crate::{PARTIES, create_party};

pub fn handle_rpc(player_entity: &Player, _rpc: LeavePartyRpc) {
    PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        let party = parties.get_mut(&player_entity.party_id).unwrap();

        if party.member_count <= 0 {
            return;
        }

        party.remove_member(player_entity.generic_entity.uid, false);
    });

    create_party(player_entity.generic_entity.uid);
}