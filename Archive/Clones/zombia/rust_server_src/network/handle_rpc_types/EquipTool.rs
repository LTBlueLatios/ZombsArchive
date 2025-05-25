use crate::entity_manager::entity_types::Player;
use crate::network::decode_rpc_types::EquipTool::EquipToolRpc;
use crate::info::equippables::ToolTrait;

pub fn handle_rpc(player_entity: &Player, rpc: EquipToolRpc) {
    for equippable in player_entity.owned_items.iter() {
        if equippable.name() == rpc.tool_name {
            if equippable.class() != "Tools" {
                continue;
            }

            let weapon_name = equippable.name().to_string();
            let weapon_tier = equippable.tier();

            player_entity.set_property("weapon_name", Box::new(weapon_name));
            player_entity.set_property("weapon_tier", Box::new(weapon_tier));

            player_entity.set_property("equipped_item", Box::new(equippable.clone()));
        }
    }
}