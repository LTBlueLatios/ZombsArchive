use crate::entity_manager::entity_types::{EntityTypeEnum, Player};
use crate::entity_manager::manager::ENTITIES;
use crate::network::decode_rpc_types::OutOfSync::OutOfSyncRpc;

pub fn handle_rpc(player_entity: &Player, _rpc: OutOfSyncRpc) {
    ENTITIES.with(|e| {
        let mut entities = e.borrow_mut();

        let player_entity = entities.get_mut(&player_entity.generic_entity.uid).unwrap();

        let EntityTypeEnum::Player(player_entity) = player_entity else {
            unreachable!();
        };

        player_entity.out_of_sync = true;
    });
}