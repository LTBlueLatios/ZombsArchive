use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct DeadRpc {
    pub reason: DeathReasons,
    pub wave: u32,
    pub score: u32,
    pub party_score: u32
}

#[derive(Debug)]
pub enum DeathReasons {
    Killed,
    KilledWithBase,
    FactoryDied
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: DeadRpc) {
    match data.reason {
        DeathReasons::Killed => {
            byte_buffer.write_string("Killed");
        },
        DeathReasons::KilledWithBase => {
            byte_buffer.write_string("KilledWithBase");
        },
        DeathReasons::FactoryDied => {
            byte_buffer.write_string("FactoryDied");
        }
    }
    byte_buffer.write_u32(data.wave);
    byte_buffer.write_u32(data.score);
    byte_buffer.write_u32(data.party_score);
}