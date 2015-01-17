/*jshint node:true */

var charset = [
    0x1c,0x22,0x2a,0x2a,0x2c,0x20,0x1e,0x00,
    0x08,0x14,0x22,0x22,0x3e,0x22,0x22,0x00,
    0x3c,0x22,0x22,0x3c,0x22,0x22,0x3c,0x00,
    0x1c,0x22,0x20,0x20,0x20,0x22,0x1c,0x00,
    0x3c,0x22,0x22,0x22,0x22,0x22,0x3c,0x00,
    0x3e,0x20,0x20,0x3c,0x20,0x20,0x3e,0x00,
    0x3e,0x20,0x20,0x3c,0x20,0x20,0x20,0x00,
    0x1e,0x20,0x20,0x26,0x22,0x22,0x1e,0x00,
    0x22,0x22,0x22,0x3e,0x22,0x22,0x22,0x00,
    0x1c,0x08,0x08,0x08,0x08,0x08,0x1c,0x00,
    0x02,0x02,0x02,0x02,0x02,0x22,0x1c,0x00,
    0x22,0x24,0x28,0x30,0x28,0x24,0x22,0x00,
    0x20,0x20,0x20,0x20,0x20,0x20,0x3e,0x00,
    0x22,0x36,0x2a,0x2a,0x22,0x22,0x22,0x00,
    0x22,0x22,0x32,0x2a,0x26,0x22,0x22,0x00,
    0x1c,0x22,0x22,0x22,0x22,0x22,0x1c,0x00,
    0x3c,0x22,0x22,0x3c,0x20,0x20,0x20,0x00,
    0x1c,0x22,0x22,0x22,0x2a,0x24,0x1a,0x00,
    0x3c,0x22,0x22,0x3c,0x28,0x24,0x22,0x00,
    0x1c,0x22,0x20,0x1c,0x02,0x22,0x1c,0x00,
    0x3e,0x08,0x08,0x08,0x08,0x08,0x08,0x00,
    0x22,0x22,0x22,0x22,0x22,0x22,0x1c,0x00,
    0x22,0x22,0x22,0x22,0x22,0x14,0x08,0x00,
    0x22,0x22,0x22,0x2a,0x2a,0x36,0x22,0x00,
    0x22,0x22,0x14,0x08,0x14,0x22,0x22,0x00,
    0x22,0x22,0x14,0x08,0x08,0x08,0x08,0x00,
    0x3e,0x02,0x04,0x08,0x10,0x20,0x3e,0x00,
    0x3e,0x30,0x30,0x30,0x30,0x30,0x3e,0x00,
    0x00,0x20,0x10,0x08,0x04,0x02,0x00,0x00,
    0x3e,0x06,0x06,0x06,0x06,0x06,0x3e,0x00,
    0x08,0x14,0x22,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x3e,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
    0x08,0x08,0x08,0x08,0x08,0x00,0x08,0x00,
    0x14,0x14,0x14,0x00,0x00,0x00,0x00,0x00,
    0x14,0x14,0x3e,0x14,0x3e,0x14,0x14,0x00,
    0x08,0x1e,0x28,0x1c,0x0a,0x3c,0x08,0x00,
    0x32,0x32,0x04,0x08,0x10,0x26,0x26,0x00,
    0x18,0x24,0x28,0x10,0x2a,0x24,0x1a,0x00,
    0x08,0x08,0x08,0x00,0x00,0x00,0x00,0x00,
    0x08,0x10,0x20,0x20,0x20,0x10,0x08,0x00,
    0x08,0x04,0x02,0x02,0x02,0x04,0x08,0x00,
    0x08,0x2a,0x1c,0x08,0x1c,0x2a,0x08,0x00,
    0x00,0x08,0x08,0x3e,0x08,0x08,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x18,0x08,0x10,
    0x00,0x00,0x00,0x1c,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x00,
    0x00,0x02,0x04,0x08,0x10,0x20,0x00,0x00,
    0x1c,0x22,0x26,0x2a,0x32,0x22,0x1c,0x00,
    0x08,0x18,0x08,0x08,0x08,0x08,0x1c,0x00,
    0x1c,0x22,0x02,0x0c,0x10,0x20,0x3e,0x00,
    0x3e,0x02,0x04,0x0c,0x02,0x22,0x1c,0x00,
    0x04,0x0c,0x14,0x24,0x3e,0x04,0x04,0x00,
    0x3e,0x20,0x3c,0x02,0x02,0x22,0x1c,0x00,
    0x0e,0x10,0x20,0x3c,0x22,0x22,0x1c,0x00,
    0x3e,0x02,0x04,0x08,0x10,0x10,0x10,0x00,
    0x1c,0x22,0x22,0x1c,0x22,0x22,0x1c,0x00,
    0x1c,0x22,0x22,0x1e,0x02,0x04,0x38,0x00,
    0x00,0x00,0x18,0x18,0x00,0x18,0x18,0x00,
    0x00,0x00,0x18,0x18,0x00,0x18,0x08,0x10,
    0x04,0x08,0x10,0x20,0x10,0x08,0x04,0x00,
    0x00,0x00,0x3c,0x00,0x3c,0x00,0x00,0x00,
    0x10,0x08,0x04,0x02,0x04,0x08,0x10,0x00,
    0x1c,0x22,0x04,0x08,0x08,0x00,0x08,0x00,
    0x9c,0xa2,0xaa,0xaa,0xac,0xa0,0x9e,0x80,
    0x88,0x94,0xa2,0xa2,0xbe,0xa2,0xa2,0x80,
    0xbc,0xa2,0xa2,0xbc,0xa2,0xa2,0xbc,0x80,
    0x9c,0xa2,0xa0,0xa0,0xa0,0xa2,0x9c,0x80,
    0xbc,0xa2,0xa2,0xa2,0xa2,0xa2,0xbc,0x80,
    0xbe,0xa0,0xa0,0xbc,0xa0,0xa0,0xbe,0x80,
    0xbe,0xa0,0xa0,0xbc,0xa0,0xa0,0xa0,0x80,
    0x9e,0xa0,0xa0,0xa6,0xa2,0xa2,0x9e,0x80,
    0xa2,0xa2,0xa2,0xbe,0xa2,0xa2,0xa2,0x80,
    0x9c,0x88,0x88,0x88,0x88,0x88,0x9c,0x80,
    0x82,0x82,0x82,0x82,0x82,0xa2,0x9c,0x80,
    0xa2,0xa4,0xa8,0xb0,0xa8,0xa4,0xa2,0x80,
    0xa0,0xa0,0xa0,0xa0,0xa0,0xa0,0xbe,0x80,
    0xa2,0xb6,0xaa,0xaa,0xa2,0xa2,0xa2,0x80,
    0xa2,0xa2,0xb2,0xaa,0xa6,0xa2,0xa2,0x80,
    0x9c,0xa2,0xa2,0xa2,0xa2,0xa2,0x9c,0x80,
    0xbc,0xa2,0xa2,0xbc,0xa0,0xa0,0xa0,0x80,
    0x9c,0xa2,0xa2,0xa2,0xaa,0xa4,0x9a,0x80,
    0xbc,0xa2,0xa2,0xbc,0xa8,0xa4,0xa2,0x80,
    0x9c,0xa2,0xa0,0x9c,0x82,0xa2,0x9c,0x80,
    0xbe,0x88,0x88,0x88,0x88,0x88,0x88,0x80,
    0xa2,0xa2,0xa2,0xa2,0xa2,0xa2,0x9c,0x80,
    0xa2,0xa2,0xa2,0xa2,0xa2,0x94,0x88,0x80,
    0xa2,0xa2,0xa2,0xaa,0xaa,0xb6,0xa2,0x80,
    0xa2,0xa2,0x94,0x88,0x94,0xa2,0xa2,0x80,
    0xa2,0xa2,0x94,0x88,0x88,0x88,0x88,0x80,
    0xbe,0x82,0x84,0x88,0x90,0xa0,0xbe,0x80,
    0xbe,0xb0,0xb0,0xb0,0xb0,0xb0,0xbe,0x80,
    0x80,0xa0,0x90,0x88,0x84,0x82,0x80,0x80,
    0xbe,0x86,0x86,0x86,0x86,0x86,0xbe,0x80,
    0x88,0x94,0xa2,0x80,0x80,0x80,0x80,0x80,
    0x80,0x80,0x80,0x80,0x80,0x80,0xbe,0x80,
    0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,
    0x88,0x88,0x88,0x88,0x88,0x80,0x88,0x80,
    0x94,0x94,0x94,0x80,0x80,0x80,0x80,0x80,
    0x94,0x94,0xbe,0x94,0xbe,0x94,0x94,0x80,
    0x88,0x9e,0xa8,0x9c,0x8a,0xbc,0x88,0x80,
    0xb2,0xb2,0x84,0x88,0x90,0xa6,0xa6,0x80,
    0x98,0xa4,0xa8,0x90,0xaa,0xa4,0x9a,0x80,
    0x88,0x88,0x88,0x80,0x80,0x80,0x80,0x80,
    0x88,0x90,0xa0,0xa0,0xa0,0x90,0x88,0x80,
    0x88,0x84,0x82,0x82,0x82,0x84,0x88,0x80,
    0x88,0xaa,0x9c,0x88,0x9c,0xaa,0x88,0x80,
    0x80,0x88,0x88,0xbe,0x88,0x88,0x80,0x80,
    0x80,0x80,0x80,0x80,0x80,0x98,0x88,0x90,
    0x80,0x80,0x80,0x9c,0x80,0x80,0x80,0x80,
    0x80,0x80,0x80,0x80,0x80,0x98,0x98,0x80,
    0x80,0x82,0x84,0x88,0x90,0xa0,0x80,0x80,
    0x9c,0xa2,0xa6,0xaa,0xb2,0xa2,0x9c,0x80,
    0x88,0x98,0x88,0x88,0x88,0x88,0x9c,0x80,
    0x9c,0xa2,0x82,0x8c,0x90,0xa0,0xbe,0x80,
    0xbe,0x82,0x84,0x8c,0x82,0xa2,0x9c,0x80,
    0x84,0x8c,0x94,0xa4,0xbe,0x84,0x84,0x80,
    0xbe,0xa0,0xbc,0x82,0x82,0xa2,0x9c,0x80,
    0x8e,0x90,0xa0,0xbc,0xa2,0xa2,0x9c,0x80,
    0xbe,0x82,0x84,0x88,0x90,0x90,0x90,0x80,
    0x9c,0xa2,0xa2,0x9c,0xa2,0xa2,0x9c,0x80,
    0x9c,0xa2,0xa2,0x9e,0x82,0x84,0xb8,0x80,
    0x80,0x80,0x98,0x98,0x80,0x98,0x98,0x80,
    0x80,0x80,0x98,0x98,0x80,0x98,0x88,0x90,
    0x84,0x88,0x90,0xa0,0x90,0x88,0x84,0x80,
    0x80,0x80,0xbc,0x80,0xbc,0x80,0x80,0x80,
    0x90,0x88,0x84,0x82,0x84,0x88,0x90,0x80,
    0x9c,0xa2,0x84,0x88,0x88,0x80,0x88,0x80,
    0x1c,0x22,0x2a,0x2a,0x2c,0x20,0x1e,0x00,
    0x08,0x14,0x22,0x22,0x3e,0x22,0x22,0x00,
    0x3c,0x22,0x22,0x3c,0x22,0x22,0x3c,0x00,
    0x1c,0x22,0x20,0x20,0x20,0x22,0x1c,0x00,
    0x3c,0x22,0x22,0x22,0x22,0x22,0x3c,0x00,
    0x3e,0x20,0x20,0x3c,0x20,0x20,0x3e,0x00,
    0x3e,0x20,0x20,0x3c,0x20,0x20,0x20,0x00,
    0x1e,0x20,0x20,0x26,0x22,0x22,0x1e,0x00,
    0x22,0x22,0x22,0x3e,0x22,0x22,0x22,0x00,
    0x1c,0x08,0x08,0x08,0x08,0x08,0x1c,0x00,
    0x02,0x02,0x02,0x02,0x02,0x22,0x1c,0x00,
    0x22,0x24,0x28,0x30,0x28,0x24,0x22,0x00,
    0x20,0x20,0x20,0x20,0x20,0x20,0x3e,0x00,
    0x22,0x36,0x2a,0x2a,0x22,0x22,0x22,0x00,
    0x22,0x22,0x32,0x2a,0x26,0x22,0x22,0x00,
    0x1c,0x22,0x22,0x22,0x22,0x22,0x1c,0x00,
    0x3c,0x22,0x22,0x3c,0x20,0x20,0x20,0x00,
    0x1c,0x22,0x22,0x22,0x2a,0x24,0x1a,0x00,
    0x3c,0x22,0x22,0x3c,0x28,0x24,0x22,0x00,
    0x1c,0x22,0x20,0x1c,0x02,0x22,0x1c,0x00,
    0x3e,0x08,0x08,0x08,0x08,0x08,0x08,0x00,
    0x22,0x22,0x22,0x22,0x22,0x22,0x1c,0x00,
    0x22,0x22,0x22,0x22,0x22,0x14,0x08,0x00,
    0x22,0x22,0x22,0x2a,0x2a,0x36,0x22,0x00,
    0x22,0x22,0x14,0x08,0x14,0x22,0x22,0x00,
    0x22,0x22,0x14,0x08,0x08,0x08,0x08,0x00,
    0x3e,0x02,0x04,0x08,0x10,0x20,0x3e,0x00,
    0x3e,0x30,0x30,0x30,0x30,0x30,0x3e,0x00,
    0x00,0x20,0x10,0x08,0x04,0x02,0x00,0x00,
    0x3e,0x06,0x06,0x06,0x06,0x06,0x3e,0x00,
    0x08,0x14,0x22,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x3e,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
    0x08,0x08,0x08,0x08,0x08,0x00,0x08,0x00,
    0x14,0x14,0x14,0x00,0x00,0x00,0x00,0x00,
    0x14,0x14,0x3e,0x14,0x3e,0x14,0x14,0x00,
    0x08,0x1e,0x28,0x1c,0x0a,0x3c,0x08,0x00,
    0x32,0x32,0x04,0x08,0x10,0x26,0x26,0x00,
    0x18,0x24,0x28,0x10,0x2a,0x24,0x1a,0x00,
    0x08,0x08,0x08,0x00,0x00,0x00,0x00,0x00,
    0x08,0x10,0x20,0x20,0x20,0x10,0x08,0x00,
    0x08,0x04,0x02,0x02,0x02,0x04,0x08,0x00,
    0x08,0x2a,0x1c,0x08,0x1c,0x2a,0x08,0x00,
    0x00,0x08,0x08,0x3e,0x08,0x08,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x18,0x08,0x10,
    0x00,0x00,0x00,0x1c,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x00,
    0x00,0x02,0x04,0x08,0x10,0x20,0x00,0x00,
    0x1c,0x22,0x26,0x2a,0x32,0x22,0x1c,0x00,
    0x08,0x18,0x08,0x08,0x08,0x08,0x1c,0x00,
    0x1c,0x22,0x02,0x0c,0x10,0x20,0x3e,0x00,
    0x3e,0x02,0x04,0x0c,0x02,0x22,0x1c,0x00,
    0x04,0x0c,0x14,0x24,0x3e,0x04,0x04,0x00,
    0x3e,0x20,0x3c,0x02,0x02,0x22,0x1c,0x00,
    0x0e,0x10,0x20,0x3c,0x22,0x22,0x1c,0x00,
    0x3e,0x02,0x04,0x08,0x10,0x10,0x10,0x00,
    0x1c,0x22,0x22,0x1c,0x22,0x22,0x1c,0x00,
    0x1c,0x22,0x22,0x1e,0x02,0x04,0x38,0x00,
    0x00,0x00,0x18,0x18,0x00,0x18,0x18,0x00,
    0x00,0x00,0x18,0x18,0x00,0x18,0x08,0x10,
    0x04,0x08,0x10,0x20,0x10,0x08,0x04,0x00,
    0x00,0x00,0x3c,0x00,0x3c,0x00,0x00,0x00,
    0x10,0x08,0x04,0x02,0x04,0x08,0x10,0x00,
    0x1c,0x22,0x04,0x08,0x08,0x00,0x08,0x00,
    0x1c,0x22,0x2a,0x2a,0x2c,0x20,0x1e,0x00,
    0x08,0x14,0x22,0x22,0x3e,0x22,0x22,0x00,
    0x3c,0x22,0x22,0x3c,0x22,0x22,0x3c,0x00,
    0x1c,0x22,0x20,0x20,0x20,0x22,0x1c,0x00,
    0x3c,0x22,0x22,0x22,0x22,0x22,0x3c,0x00,
    0x3e,0x20,0x20,0x3c,0x20,0x20,0x3e,0x00,
    0x3e,0x20,0x20,0x3c,0x20,0x20,0x20,0x00,
    0x1e,0x20,0x20,0x26,0x22,0x22,0x1e,0x00,
    0x22,0x22,0x22,0x3e,0x22,0x22,0x22,0x00,
    0x1c,0x08,0x08,0x08,0x08,0x08,0x1c,0x00,
    0x02,0x02,0x02,0x02,0x02,0x22,0x1c,0x00,
    0x22,0x24,0x28,0x30,0x28,0x24,0x22,0x00,
    0x20,0x20,0x20,0x20,0x20,0x20,0x3e,0x00,
    0x22,0x36,0x2a,0x2a,0x22,0x22,0x22,0x00,
    0x22,0x22,0x32,0x2a,0x26,0x22,0x22,0x00,
    0x1c,0x22,0x22,0x22,0x22,0x22,0x1c,0x00,
    0x3c,0x22,0x22,0x3c,0x20,0x20,0x20,0x00,
    0x1c,0x22,0x22,0x22,0x2a,0x24,0x1a,0x00,
    0x3c,0x22,0x22,0x3c,0x28,0x24,0x22,0x00,
    0x1c,0x22,0x20,0x1c,0x02,0x22,0x1c,0x00,
    0x3e,0x08,0x08,0x08,0x08,0x08,0x08,0x00,
    0x22,0x22,0x22,0x22,0x22,0x22,0x1c,0x00,
    0x22,0x22,0x22,0x22,0x22,0x14,0x08,0x00,
    0x22,0x22,0x22,0x2a,0x2a,0x36,0x22,0x00,
    0x22,0x22,0x14,0x08,0x14,0x22,0x22,0x00,
    0x22,0x22,0x14,0x08,0x08,0x08,0x08,0x00,
    0x3e,0x02,0x04,0x08,0x10,0x20,0x3e,0x00,
    0x3e,0x30,0x30,0x30,0x30,0x30,0x3e,0x00,
    0x00,0x20,0x10,0x08,0x04,0x02,0x00,0x00,
    0x3e,0x06,0x06,0x06,0x06,0x06,0x3e,0x00,
    0x08,0x14,0x22,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x3e,0x00,
    0x20,0x10,0x08,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x1c,0x02,0x1e,0x22,0x1e,0x00,
    0x20,0x20,0x2c,0x32,0x22,0x32,0x2c,0x00,
    0x00,0x00,0x1e,0x20,0x20,0x20,0x1e,0x00,
    0x02,0x02,0x1a,0x26,0x22,0x26,0x1a,0x00,
    0x00,0x00,0x1c,0x22,0x3e,0x20,0x1c,0x00,
    0x0c,0x12,0x10,0x38,0x10,0x10,0x10,0x00,
    0x00,0x02,0x1c,0x22,0x22,0x1e,0x02,0x1c,
    0x20,0x20,0x2c,0x32,0x22,0x22,0x22,0x00,
    0x08,0x00,0x18,0x08,0x08,0x08,0x1c,0x00,
    0x04,0x00,0x0c,0x04,0x04,0x04,0x24,0x18,
    0x20,0x20,0x22,0x24,0x38,0x24,0x22,0x00,
    0x18,0x08,0x08,0x08,0x08,0x08,0x1c,0x00,
    0x00,0x00,0x34,0x2a,0x2a,0x2a,0x2a,0x00,
    0x00,0x00,0x2c,0x32,0x22,0x22,0x22,0x00,
    0x00,0x00,0x1c,0x22,0x22,0x22,0x1c,0x00,
    0x00,0x00,0x2c,0x32,0x32,0x2c,0x20,0x20,
    0x00,0x00,0x1a,0x26,0x26,0x1a,0x02,0x02,
    0x00,0x00,0x2c,0x30,0x20,0x20,0x20,0x00,
    0x00,0x00,0x1e,0x20,0x1c,0x02,0x3c,0x00,
    0x10,0x10,0x38,0x10,0x10,0x12,0x0c,0x00,
    0x00,0x00,0x22,0x22,0x22,0x26,0x1a,0x00,
    0x00,0x00,0x22,0x22,0x22,0x14,0x08,0x00,
    0x00,0x00,0x22,0x2a,0x2a,0x2a,0x14,0x00,
    0x00,0x00,0x22,0x14,0x08,0x14,0x22,0x00,
    0x00,0x00,0x22,0x22,0x26,0x1a,0x02,0x1c,
    0x00,0x00,0x3e,0x04,0x08,0x10,0x3e,0x00,
    0x06,0x08,0x08,0x30,0x08,0x08,0x06,0x00,
    0x08,0x08,0x08,0x00,0x08,0x08,0x08,0x00,
    0x30,0x08,0x08,0x06,0x08,0x08,0x30,0x00,
    0x00,0x00,0x10,0x2a,0x04,0x00,0x00,0x00,
    0x2a,0x14,0x2a,0x14,0x2a,0x14,0x2a,0x00
];

module.exports = {
    charset: charset
};
