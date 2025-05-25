use std::f32::consts::PI;

pub trait EntityTrait {
    fn on_die(&self);
}

#[derive(Clone, Debug, Copy, Eq, Hash, PartialEq, Ord, PartialOrd)]
pub struct Position {
    pub x: i16,
    pub y: i16
}

impl Position {
    pub fn angle_to(self, other: &Position) -> u16 {
        let dx = other.x as f32 - self.x as f32;
        let dy = other.y as f32 - self.y as f32;
        let mut angle = dy.atan2(dx);

        angle += PI / 2.0;

        if angle < 0.0 {
            angle += 2.0 * PI;
        } else if angle >= 2.0 * PI {
            angle -= 2.0 * PI;
        }

        return angle.to_degrees().round() as u16;
    }

    pub fn is_facing(self, facing_angle: u16, angle_to_other: u16, max_deviation: u16) -> bool {
        let facing_angle = (facing_angle as f32).to_radians();
        let angle_to_other = (angle_to_other as f32).to_radians();
        let max_deviation = (max_deviation as f32).to_radians();

        let mut diff = (facing_angle - angle_to_other).abs();

        if diff > PI {
            diff = 2.0 * PI - diff;
        }

        return diff <= max_deviation;
    }

    pub fn distance_to(self, other: &Position) -> u32 {
        let x_dist: u32;
        let y_dist: u32;

        if self.x > other.x {
            x_dist = (self.x - other.x) as u32;
        } else {
            x_dist = (other.x - self.x) as u32;
        };

        if self.y > other.y {
            y_dist = (self.y - other.y) as u32;
        } else {
            y_dist = (other.y - self.y) as u32;
        };

        // Result is not squared for performance reasons
        x_dist.pow(2) + y_dist.pow(2)
    }
}

#[derive(Clone, Debug)]
pub struct GenericEntity {
    pub uid: u16,
    pub position: Position,
    pub model: String
}

impl GenericEntity {
    pub fn new(uid: u16, model: String, position: Position) -> Self {
        GenericEntity {
            uid,
            position,
            model
        }
    }
}

impl EntityTrait for GenericEntity {
    fn on_die(&self) {
        // println!("{} ded!", self.model);
    }
}