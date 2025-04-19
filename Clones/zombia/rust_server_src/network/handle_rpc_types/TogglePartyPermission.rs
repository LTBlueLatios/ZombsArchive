use crate::entity_manager::entity_types::Player;
use crate::entity_manager::{entity_types::EntityTypeEnum, manager};
use crate::network::decode_rpc_types::TogglePartyPermission::{Permissions, TogglePartyPermissionRpc};
use crate::PARTIES;

pub fn handle_rpc(player_entity: &Player, rpc: TogglePartyPermissionRpc) {
    let player_to_update = manager::get_entity(rpc.uid);

    let player_to_update = match player_to_update {
        Some(EntityTypeEnum::Player(e)) => e,
        _ => return
    };

    if rpc.uid == player_entity.generic_entity.uid {
        return;
    }

    PARTIES.with(|parties| {
        let mut parties = parties.borrow_mut();

        let party = parties.get(&player_entity.party_id).unwrap();

        if party.leader_uid != player_entity.generic_entity.uid {
            return;
        }

        let party = parties.get_mut(&player_entity.party_id).unwrap();

        match rpc.permission {
            Permissions::CanPlace => {
                party.set_permission("can_place", player_to_update.generic_entity.uid, !player_to_update.can_place);
            },
            Permissions::CanSell => {
                party.set_permission("can_sell", player_to_update.generic_entity.uid, !player_to_update.can_sell);
            }
        };
    });
}