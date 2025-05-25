use bytebuffer::ByteBuffer;

#[derive(Debug)]
pub struct UpdateLeaderboardRpc {
    pub entries: Vec<LeaderboardEntry>
}

#[derive(Debug, Clone)]
pub struct LeaderboardEntry {
    pub uid: u16,
    pub name: String,
    pub score: u32,
    pub wave: u32,
    pub rank: u8
}

pub fn encode_rpc(byte_buffer: &mut ByteBuffer, data: UpdateLeaderboardRpc) {
    let entries = data.entries;

    byte_buffer.write_u16(entries.len() as u16);

    for entry in entries {
        byte_buffer.write_u16(entry.uid);
        byte_buffer.write_string(&entry.name);
        byte_buffer.write_u32(entry.score);
        byte_buffer.write_u32(entry.wave);
        byte_buffer.write_u8(entry.rank);
    }
}