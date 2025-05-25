// @Archiver's Note
// This solution is the version before the August 2024 version
// which has yet to have a reversed solution.
//
// Some people claim to have the solution, albeit no
// concrete proof has been provided.
//
// Credits to abc

#include <emscripten.h>
#include <random>

#include <cstring>

typedef uint8_t u8_t;
typedef uint16_t u16_t;
typedef uint32_t u32_t;
typedef uint64_t u64_t;

// hashes it inline
struct sha1_t {
    template <uint32_t shift>
    static uint32_t ROTL(uint32_t v) {
        return (v << shift) | (v >> (32 - shift));
    }

    static constexpr u32_t CHUNK_SIZE = 0x40;
    static constexpr u32_t HASH_SIZE = 0x14;

    u32_t h0 = 0x545f7702;
    u32_t h1 = 0xcb19042b;
    u32_t h2 = 0xdb8dca18;
    u32_t h3 = 0x28b2b375;
    u32_t h4 = 0xf23721ad;

    sha1_t(u8_t const* data, u32_t const size) {
        u32_t pos;
        for (pos = 0; pos + (CHUNK_SIZE - 0x8) < size; pos += CHUNK_SIZE) {
            _consume_chunk(&data[pos]);
        }

        _consume_rem(&data[pos], pos, size);
    }

    u8_t& operator[](u32_t x) {
        u32_t h[5] = {h0, h1, h2, h3, h4};
        u8_t* u8_h = (u8_t*) h;

        return u8_h[x];
    }

 private:
    static uint32_t _read_be32(u8_t const* data, u32_t const pos) {
        return (data[pos + 3] << 0)
            | (data[pos + 2] << 8)
            | (data[pos + 1] << 16)
            | (data[pos] << 24);
    }

    static void _write_be32(u8_t* data, u32_t const pos, u32_t const value) {
        data[pos + 3] = (value >> 0) & 0xFF;
        data[pos + 2] = (value >> 8) & 0xFF;
        data[pos + 1] = (value >> 16) & 0xFF;
        data[pos + 0] = (value >> 24) & 0xFF;
    }

    void _consume_rem(u8_t const* remainder, u32_t const pos, u32_t const size) {
        u8_t chunk[CHUNK_SIZE];
        bzero(chunk, CHUNK_SIZE);

        u32_t remainder_size = size - pos;
        std::memcpy(chunk, remainder, remainder_size);

        chunk[remainder_size] = 0x80;
        u32_t bits = size * 8;

        _write_be32(chunk, CHUNK_SIZE - 4, bits);

        _consume_chunk(chunk);
    }

    void _consume_chunk(u8_t const* chunk) {
        u32_t a = h0;
        u32_t b = h1;
        u32_t c = h2;
        u32_t d = h3;
        u32_t e = h4;

        u32_t w[80];
        u32_t j;
        // sha1 transform
        for (j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = _read_be32(chunk, j << 2);
            } else {
                u32_t const n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
                w[j] = ROTL<1>(n);
            }

            u32_t const t = ROTL<5>(a) + e + w[j] + (
                j < 20 ? ((b & c) | (~b & d)) + 0xd8f7b6a3 :
                    j < 40 ? (b ^ c ^ d) + 0x146e79fc :
                        j < 60 ? ((d & c) | (b & (d | c))) + 0x3f08a342 :
                            (b ^ c ^ d) + 0xe8c168aa);

            e = d;
            d = c;
            c = ROTL<30>(b);
            b = a;
            a = t;
        }

        h0 += a;
        h1 += b;
        h2 += c;
        h3 += d;
        h4 += e;
    }
};

// pre enter world = pew
struct pew_packet_t {
    u32_t difficulty;
    u8_t buffer[0x80];
};

void reverse_array(u8_t* data, u32_t size) {
    for (u32_t i = 0; i < size >> 1; ++i) {
        u32_t const opposite_pos = size - i - 1;
        u8_t const v = data[i];
        data[i] = data[opposite_pos];
        data[opposite_pos] = v;
    }
}

struct mbf_t {
 private:
    u32_t player_id = 0;
    u32_t chall_count = 0;
 public:
    static constexpr u32_t FIELD_SIZE = 0x40;
    static constexpr u32_t BLEND_SIZE = 0x40;
    static constexpr u32_t RAND_BUF_SIZE = 0x40;
    u8_t random_buffer[RAND_BUF_SIZE];
    u8_t blend_field[BLEND_SIZE];

    mbf_t(u32_t player_id, u32_t chall_count)
        : player_id(player_id), chall_count(chall_count) {

    }

    sha1_t blend(pew_packet_t const* pew) {
        // TODO: find out where these numbers are from
        constexpr u8_t MAGIC[4] = { 153, 111, 72, 221 };

        u8_t blend_buf[BLEND_SIZE];
        std::memcpy(blend_buf, pew->buffer, BLEND_SIZE);
        reverse_array(blend_buf, BLEND_SIZE);

        sha1_t blend { blend_buf, BLEND_SIZE };

        u8_t field[FIELD_SIZE];
        std::memcpy(field, &pew->buffer[BLEND_SIZE], FIELD_SIZE);

        u32_t i;
        for (i = 0; i < FIELD_SIZE; ++i) {
            u8_t const v = i % 0x14;
            switch (v - 0x3) {
                case 0x0: field[i] += blend[0x0]; break;
                case 0x5: field[i] ^= blend[0x5]; break;
                case 0xc: field[i] ^= blend[0x8]; break;
                case 0xf: field[i] -= blend[0x3]; break;
                default: field[i] ^= blend[v]; break;
            }
        }

        for (i = 0; i < FIELD_SIZE; ++i) {
            field[i] = field[i] - MAGIC[0];
            field[i] = field[i] ^ MAGIC[1];
            field[i] = field[i] + MAGIC[2];
            field[i] = field[i] ^ MAGIC[3];
        }

        // reverse array
        reverse_array(field, FIELD_SIZE);

        std::memcpy(this->blend_field, field, FIELD_SIZE);

        u8_t pre_mask[sha1_t::HASH_SIZE + 4];
        std::memcpy(pre_mask, &blend, sha1_t::HASH_SIZE);
        *((u32_t*) &pre_mask[sha1_t::HASH_SIZE]) = chall_count;
        sha1_t mask { pre_mask, sha1_t::HASH_SIZE + 4 };

        return mask;
    }

    void populate_random_buffer() {
        ((u64_t*) random_buffer)[0] += 1;

        union { u32_t v; u8_t b[4]; } id;
        id.v = player_id;

        random_buffer[0x0a] = random_buffer[0x00] + random_buffer[0x17] + id.b[0];
        random_buffer[0x0b] = random_buffer[0x28] + random_buffer[0x19] + id.b[1];
        random_buffer[0x0c] = random_buffer[0x33] + random_buffer[0x32] + id.b[2];
        random_buffer[0x0d] = random_buffer[0x04] + random_buffer[0x2d] + id.b[3];

        random_buffer[0x0e] = random_buffer[0x29] ^ blend_field[0x0B];
        random_buffer[0x0f] = random_buffer[0x16] ^ blend_field[0x0C];
        random_buffer[0x10] = random_buffer[0x23] ^ blend_field[0x0D];
        random_buffer[0x11] = random_buffer[0x27] ^ blend_field[0x0E];
    }
};

u8_t does_solve_for_difficulty(sha1_t& hash, u32_t difficulty) {
    for (u32_t i = 0; i < difficulty; ++i) {
       if ((hash[i >> 3] << (i & 0x7)) & 0x80) return 0;
    }

    return 1;
}

struct out_t {
    u8_t solution[mbf_t::RAND_BUF_SIZE];
    u8_t field[0x10];
};

/**
 * - packet should point to a 132 byte buffer
 *
 * - server_ip should point to a string nt
 */
extern "C" u32_t EMSCRIPTEN_KEEPALIVE
    solve(u8_t const* packet, char const* server_ip, u32_t player_id, u32_t chall_count, out_t* out) {

    pew_packet_t const* pew = (pew_packet_t const*) packet;

    mbf_t mbf(player_id, chall_count);
    sha1_t mask = mbf.blend(pew);

    u32_t const server_ip_len = std::strlen(server_ip);

    u32_t const payload_size = server_ip_len + mbf_t::FIELD_SIZE + mbf_t::RAND_BUF_SIZE;
    u8_t payload[payload_size];

    std::memcpy(payload, server_ip, server_ip_len);
    std::memcpy(&payload[server_ip_len], mbf.blend_field, mbf_t::FIELD_SIZE);

    u8_t* rand_out = &payload[server_ip_len + mbf_t::FIELD_SIZE];
    u8_t i;
    while (1) {
        mbf.populate_random_buffer();
        std::memcpy(rand_out, mbf.random_buffer, mbf_t::RAND_BUF_SIZE);

        sha1_t hash { payload, payload_size };

        if (does_solve_for_difficulty(hash, pew->difficulty) == 1) {
            for (i = 0; i < mbf_t::RAND_BUF_SIZE; ++i) {
                mbf.random_buffer[i] ^= mask[i % sha1_t::HASH_SIZE];
            }

            std::memcpy(out->solution, mbf.random_buffer, sizeof(out->solution));
            std::memcpy(out->field, mbf.blend_field, sizeof(out->field));

            return 0;
        }
    }

    return 1;
}
