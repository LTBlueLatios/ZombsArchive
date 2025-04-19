use crate::entity_manager::entity_types::Player;
use crate::network::decode_rpc_types::RandomisePartyKey::RandomisePartyKeyRpc;
use crate::PARTIES;

pub fn handle_rpc(player_entity: &Player, _rpc: RandomisePartyKeyRpc) {
    PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        let party = parties.get_mut(&player_entity.party_id).unwrap();

        if party.leader_uid != player_entity.generic_entity.uid {
            return;
        }

        party.generate_key();
    });
}