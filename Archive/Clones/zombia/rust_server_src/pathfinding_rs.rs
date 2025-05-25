use crate::entity_manager::entity_types::{factory::ZombiePathfindingGrid, generic_entity::Position};

#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct GridNode {
    pub position: Position,
    pub cell_position: (u16, u16),
    pub weight: u32,
    pub next_step: Vec<Position>
}

pub const GRID_SIZE_TO_WORLD: i16 = 48;

impl GridNode {
    pub fn successors(&self, zombie_grid: &ZombiePathfindingGrid) -> Vec<(GridNode, u32)> {
        let grid = &zombie_grid.grid;

        let &(cell_x, cell_y) = &self.cell_position;

        let cell_x = cell_x as i16;
        let cell_y = cell_y as i16;

        let mut successors: Vec<(GridNode, u32)> = Vec::new();

        let directions = [
            (1, 0), (-1, 0), (0, 1), (0, -1), // Cardinal (up, down, left, right)
            (1, 1), (-1, -1), (1, -1), (-1, 1), // Diagonal
        ];

        for (dx, dy) in directions.iter() {
            let nx = cell_x + dx;
            let ny = cell_y + dy;
    
            if nx >= 0 && ny >= 0 && nx < zombie_grid.width as i16 && ny < zombie_grid.height as i16 {
                let successor_cell = &grid[nx as usize][ny as usize];

                if successor_cell.weight == u32::MAX {
                    // If the weight is the max value, it is impassable
                    continue;
                }

                successors.push((successor_cell.clone(), successor_cell.weight));
            }
        }

        successors
    }

    pub fn heuristic(&self, goal: &GridNode) -> u32 {
        ((self.position.x - goal.position.x).abs() + (self.position.y - goal.position.y).abs()) as u32 // Manhattan 
    }
}