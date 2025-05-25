use bytebuffer::ByteBuffer;
use std::error::Error;

use crate::network::OPCODES;
use super::decode_rpc;

#[derive(Debug)]
pub struct EnterWorldPacket {
    pub player_name: String,
    pub party_key: String
}

#[derive(Debug)]
pub struct InputPacket {
    pub x: Option<u16>,
    pub y: Option<u16>,
    pub mouse_yaw: Option<u16>,
    pub mouse_down: Option<bool>,
    pub space: Option<bool>,
    pub x_movement: Option<i8>,
    pub y_movement: Option<i8>
}

#[derive(Debug)]
pub enum DecodedMessageEnum {
    Input(InputPacket),
    EnterWorld(EnterWorldPacket),
    Ping,
    Rpc(decode_rpc::RpcPacket),
    Unknown
}

// impl OPCODES {
//     fn try_from_u8(value: u8) -> Option<Self> {
//         match value {
//             4 => Some(OPCODES::PacketEnterWorld),
//             7 => Some(OPCODES::PacketPing),
//             _ => None
//         }
//     }
// }

pub fn decode_message(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, Box<dyn Error + Send + Sync>> {
    let decoded_opcode = byte_buffer.read_u8()?;

    let opcode = OPCODES::try_from_u8(decoded_opcode);

    match opcode {
        Some(OPCODES::PacketEntityUpdate) => {
            Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                "Received entity update",
            )))
        },
        Some(OPCODES::PacketInput) => {
            let result = decode_input(byte_buffer);

            let result = match result {
                Ok(res) => res,
                Err(_) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::InvalidData,
                        "Error decoding input",
                    )));
                }
            };

            Ok(result)
        },
        Some(OPCODES::PacketEnterWorld) => {
            let result = decode_enter_world(byte_buffer);

            let result = match result {
                Ok(res) => res,
                Err(_) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::InvalidData,
                        "Error decoding enter world",
                    )));
                }
            };

            Ok(result)
        },
        Some(OPCODES::PacketPing) => {
            Ok(DecodedMessageEnum::Ping)
        },
        Some(OPCODES::PacketRpc) => {
            let result = decode_rpc::decode_rpc(byte_buffer);

            let result = match result {
                Ok(res) => res,
                Err(_) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::InvalidData,
                        "Error decoding rpc",
                    )));
                }
            };

            Ok(result)
        },
        None => Ok(DecodedMessageEnum::Unknown)
    }
}

fn decode_input(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, Box<dyn Error>> {
    let input_types: Vec<&str> = vec!["x", "y", "mouseMoved", "mouseDown", "space", "px", "py"];

    let input_count: u8 = byte_buffer.read_u8()?;

    let mut input_packet_decoded = InputPacket {
        x: None,
        y: None,
        mouse_yaw: None,
        mouse_down: None,
        space: None,
        x_movement: None,
        y_movement: None
    };

    for _ in 0..input_count {
        let input_type_u8: usize = byte_buffer.read_u8()? as usize;

        if input_type_u8 > input_types.len() {
            return Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                "Input value too high for indexing vector",
            )));
        }

        let input_type: &str = input_types[input_type_u8];

        match input_type {
            "x" | "y" | "mouseMoved" => {
                let value =byte_buffer.read_u16()?;

                match input_type {
                    "x" => input_packet_decoded.x = Some(value),
                    "y" => input_packet_decoded.y = Some(value),
                    "mouseMoved" => input_packet_decoded.mouse_yaw = Some(value),
                    _ => unreachable!()
                }
            },
            "mouseDown" | "space" => {
                let value: u8 = byte_buffer.read_u8()?;

                match input_type {
                    "mouseDown" => input_packet_decoded.mouse_down = Some(value != 0),
                    "space" => input_packet_decoded.space = Some(value != 0),
                    _ => unreachable!()
                }
            },
            "px" | "py" => {
                let value: i8 = byte_buffer.read_i8()?;

                match input_type {
                    "px" => input_packet_decoded.x_movement = Some(value),
                    "py" => input_packet_decoded.y_movement = Some(value),
                    _ => unreachable!()
                }
            }
            _ => unreachable!()
        };
    }

    Ok(DecodedMessageEnum::Input(input_packet_decoded))
}

const MAX_NAME_LENGTH: usize = 16;

pub fn decode_enter_world(mut byte_buffer: ByteBuffer) -> Result<DecodedMessageEnum, Box<dyn Error>> {
    let mut player_name = byte_buffer.read_string()?;

    player_name = player_name.chars().take(MAX_NAME_LENGTH).collect::<String>();

    if player_name == "" {
        player_name = "Player".to_owned();
    }

    let party_key = byte_buffer.read_string()?;

    Ok(DecodedMessageEnum::EnterWorld(EnterWorldPacket {
        player_name,
        party_key
    }))
}