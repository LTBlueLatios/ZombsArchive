use crate::entity_manager::entity_types::Player;
use crate::entity_manager::{entity_types::EntityTypeEnum, manager};
use crate::network::decode_rpc_types::KickMember::KickMemberRpc;
use crate::{PARTIES, create_party};

pub fn handle_rpc(player_entity: &Player, rpc: KickMemberRpc) {
    let player_to_kick = manager::get_entity(rpc.uid);

    let player_to_kick = match player_to_kick {
        Some(EntityTypeEnum::Player(player_entity)) => player_entity,
        _ => return
    };

    if player_entity.party_id != player_to_kick.party_id {
        return;
    }

    PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        let party = parties.get_mut(&player_entity.party_id).unwrap();

        // is the player sending the packet the leader?
        if party.leader_uid != player_entity.generic_entity.uid {
            return;
        }

        // is the player trying to kick themselves?
        if rpc.uid == player_entity.generic_entity.uid {
            return;
        }

        party.remove_member(rpc.uid, false);
    });

    create_party(rpc.uid);
}