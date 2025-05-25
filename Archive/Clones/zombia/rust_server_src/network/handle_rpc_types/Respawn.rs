use crate::entity_manager::entity_types::generic_entity::Position;
use crate::entity_manager::entity_types::Player;
use crate::entity_manager::manager::ENTITIES;
use crate::entity_manager::entity_types::EntityTypeEnum;
use crate::network::decode_rpc_types::Respawn::RespawnRpc;
use crate::PARTIES;

pub fn handle_rpc(player_entity: &Player, _rpc: RespawnRpc) {
    if player_entity.dead == false {
        return;
    };

    ENTITIES.with(|e| {
        let entities = e.borrow();

        let factory_position: Option<Position> = PARTIES.with(|p| {
            let parties = p.borrow();
            let player_party = parties.get(&player_entity.party_id).unwrap();

            match player_party.primary_building_uid {
                Some(uid) => {
                    let factory_entity = entities.get(&uid).unwrap();
                    Some(factory_entity.generic_entity().position)
                },
                None => None
            }
        });
    
        drop(entities);

        let mut entities = e.borrow_mut();

        let entity = entities.get_mut(&player_entity.generic_entity.uid).unwrap();

        match entity {
            EntityTypeEnum::Player(ref mut player_entity) => player_entity.respawn(factory_position),
            _ => unreachable!()
        }
    });
}