use std::cell::RefCell;
use std::collections::HashMap;

use rand::seq::SliceRandom;
use rand::Rng;

use crate::entity_manager::entity_types::zombie::ZombieColours;

#[derive(Debug, Clone)]
pub struct ZombieType {
    pub colour: ZombieColours,
    pub tier: u8,
}

#[derive(Debug, Clone)]
pub struct SpawnRule {
    pub zombie_type: ZombieType,
    pub count: u32,
    pub start_percentage: f32, // Start of the spawn window (0.0 = start of night)
    pub end_percentage: f32,   // End of the spawn window (1.0 = end of night)
}

#[derive(Debug, Clone)]
pub struct Wave {
    pub spawn_rules: Vec<SpawnRule>,
}

#[derive(Debug, Clone)]
pub struct InfiniteWaveRule {
    pub min_wave: u32,
    pub max_wave: Option<u32>,
    pub min_zombies: u32,
    pub max_zombies: u32,
    pub zombie_colour: ZombieColours,
    pub tiers: Vec<u8>,
}

impl InfiniteWaveRule {
    pub fn applies_to(&self, wave_number: u32) -> bool {
        wave_number >= self.min_wave && self.max_wave.map_or(true, |max| wave_number <= max)
    }

    pub fn generate_wave(&self, wave_number: u32) -> Wave {
        let mut rng = rand::thread_rng();
        let zombie_count = rng.gen_range(self.min_zombies..self.max_zombies);
        let tier = *self.tiers.choose(&mut rng).unwrap();

        Wave {
            spawn_rules: vec![SpawnRule {
                zombie_type: ZombieType {
                    colour: self.zombie_colour,
                    tier,
                },
                count: zombie_count,
                start_percentage: 0.0,
                end_percentage: 0.75,
            }],
        }
    }
}

thread_local! {
    pub static INFINITE_WAVE_DATA: RefCell<Vec<InfiniteWaveRule>> = RefCell::new({
        let mut waves = Vec::new();

        waves.push(InfiniteWaveRule {
            min_wave: 41,
            max_wave: None,
            min_zombies: 175,
            max_zombies: 350,
            zombie_colour: ZombieColours::Red,
            tiers: vec![6, 7, 8]
        });

        waves
    });

    pub static WAVE_DATA: RefCell<HashMap<u32, Wave>> = RefCell::new({
        let mut waves = HashMap::new();

        waves.insert(1, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 1
                    },
                    count: 40,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
            ]
        });
        waves.insert(2, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 1
                    },
                    count: 80,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 2
                    },
                    count: 40,
                    start_percentage: 0.25,
                    end_percentage: 0.75
                }
            ]
        });
        waves.insert(3, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 2
                    },
                    count: 140,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
            ]
        });
        waves.insert(4, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 2
                    },
                    count: 80,
                    start_percentage: 0.0,
                    end_percentage: 0.75
                },
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 3
                    },
                    count: 100,
                    start_percentage: 0.25,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(5, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 3
                    },
                    count: 100,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 4
                    },
                    count: 40,
                    start_percentage: 0.50,
                    end_percentage: 0.75
                }
            ]
        });
        waves.insert(6, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 4
                    },
                    count: 40,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 5
                    },
                    count: 100,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(7, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 5
                    },
                    count: 80,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 6
                    },
                    count: 80,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(8, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 6
                    },
                    count: 80,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 7
                    },
                    count: 40,
                    start_percentage: 0.20,
                    end_percentage: 0.75
                }
            ]
        });
        waves.insert(9, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 7
                    },
                    count: 80,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 8
                    },
                    count: 80,
                    start_percentage: 0.20,
                    end_percentage: 0.75
                }
            ]
        });
        waves.insert(10, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Grey,
                        tier: 8
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(11, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 100,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(12, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 110,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(13, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 110,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(14, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(15, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 100,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(16, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 110,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(17, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 90,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(18, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 100,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(19, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(20, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Green,
                        tier: 1
                    },
                    count: 110,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(21, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 20,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                },
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 3
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(22, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 25,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(23, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 130,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(24, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 35,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(25, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(26, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 140,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(27, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(28, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 90,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(29, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 90,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(30, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Blue,
                        tier: 1
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(31, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 150,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(32, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 160,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(33, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 3
                    },
                    count: 200,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(34, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(35, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 100,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(36, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 110,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(37, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 90,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(38, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 120,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(39, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 130,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });
        waves.insert(40, Wave {
            spawn_rules: vec![
                SpawnRule {
                    zombie_type: ZombieType {
                        colour: ZombieColours::Red,
                        tier: 1
                    },
                    count: 250,
                    start_percentage: 0.0,
                    end_percentage: 0.50
                }
            ]
        });

        waves
    });
}
