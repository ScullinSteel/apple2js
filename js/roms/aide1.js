function Aide1()
{
    var rom = [
        0xa9,0x4c,0x8d,0xf5,0x03,0x8d,0xf8,0x03,
        0xa9,0xed,0x8d,0xf6,0x03,0x8d,0xf9,0x03,
        0xa9,0x02,0x8d,0xf7,0x03,0x8d,0xfa,0x03,
        0x20,0xe3,0xdd,0x20,0x37,0xdb,0x20,0x30,
        0xde,0x20,0x21,0xde,0x20,0xa8,0xde,0xc6,
        0x24,0x20,0x0c,0xfd,0xa0,0x15,0xd9,0x87,
        0xdf,0xf0,0x09,0x88,0x10,0xf8,0x20,0x3a,
        0xff,0x4c,0x1b,0xd8,0x20,0xed,0xfd,0xa9,
        0xd8,0x48,0xa9,0x1a,0x48,0x98,0x0a,0xa8,
        0xb9,0x9e,0xdf,0x48,0xb9,0x9d,0xdf,0x48,
        0x60,0x38,0xa9,0x01,0xed,0xd7,0x02,0x8d,
        0xd7,0x02,0xad,0xea,0x02,0xc9,0xff,0xd0,
        0x0d,0x20,0xe9,0xde,0xa9,0x00,0x85,0x22,
        0x8d,0xea,0x02,0x20,0x66,0xde,0xad,0xcb,
        0x02,0x8d,0xdf,0x02,0x8d,0xe8,0x02,0xa9,
        0x00,0x85,0x24,0xa9,0x05,0x20,0x5b,0xfb,
        0xa2,0x00,0x8a,0x29,0x0f,0xd0,0x14,0xa9,
        0x8d,0x20,0xed,0xfd,0x8a,0x20,0xda,0xfd,
        0xa9,0xad,0x20,0xed,0xfd,0x20,0xa8,0xde,
        0x4c,0x9f,0xd8,0x29,0x03,0xf0,0xf6,0xad,
        0xd7,0x02,0x08,0x20,0xdd,0x02,0x28,0xd0,
        0x2e,0x48,0xad,0xc6,0x02,0xc9,0x11,0xd0,
        0x1b,0xad,0xc7,0x02,0xc9,0x00,0xf0,0x14,
        0x8a,0x38,0xc9,0x0b,0xf0,0x0b,0xc9,0x0c,
        0xf0,0x07,0xe9,0x23,0xb0,0xf4,0x4c,0xcc,
        0xd8,0x20,0x80,0xfe,0x68,0x20,0xda,0xfd,
        0x20,0x84,0xfe,0xe8,0xd0,0xac,0x60,0x20,
        0xdd,0x02,0xc9,0x80,0x30,0x04,0xc9,0xa0,
        0x30,0x09,0x20,0xb9,0xde,0x20,0xa8,0xde,
        0x4c,0xd3,0xd8,0x29,0x1f,0x4c,0xe2,0xd8,
        0xad,0xcb,0x02,0x85,0x51,0x20,0xb1,0xd9,
        0xc9,0x8d,0xf0,0x78,0xad,0xd8,0x02,0x85,
        0x50,0xa9,0xa8,0x20,0xed,0xfd,0xa2,0x00,
        0xa1,0x50,0x20,0xda,0xfd,0xa9,0xa9,0x20,
        0xed,0xfd,0xad,0xd7,0x02,0xf0,0x22,0x20,
        0x0c,0xfd,0xc9,0x8d,0xf0,0x48,0x48,0xad,
        0xdb,0x02,0xc9,0xce,0xd0,0x04,0x68,0x29,
        0x7f,0x48,0xc9,0xcc,0xd0,0x04,0x68,0x09,
        0x20,0x48,0x68,0x8d,0xd8,0x02,0x4c,0x3c,
        0xd9,0x20,0xb1,0xd9,0xc9,0xa0,0xd0,0x04,
        0xe0,0x02,0xf0,0x14,0xe0,0x02,0xf0,0x2c,
        0x48,0xad,0xd8,0x02,0xa2,0x00,0x81,0x50,
        0x68,0xc9,0x8d,0xf0,0x11,0x20,0x6e,0xd8,
        0x20,0x30,0xde,0xe6,0x50,0xa5,0x50,0x20,
        0xda,0xfd,0xa5,0x50,0xd0,0x9b,0x4c,0x6e,
        0xd8,0x8d,0xc1,0x02,0x8d,0xdb,0x02,0x68,
        0x68,0xad,0xc1,0x02,0x60,0xa2,0x00,0x8e,
        0xd8,0x02,0xe8,0x20,0x95,0xd9,0xe0,0x01,
        0xf0,0x02,0xc6,0x24,0xad,0xda,0x02,0x8d,
        0xd8,0x02,0x20,0xe3,0xfd,0xe0,0x00,0xf0,
        0xea,0xca,0x4c,0x7b,0xd9,0x8c,0xd9,0x02,
        0x20,0x0c,0xfd,0xac,0xd9,0x02,0xc9,0xce,
        0xf0,0xc7,0xc9,0xcc,0xf0,0xc3,0xc9,0x8d,
        0xf0,0xbf,0xc9,0xa0,0xf0,0xbb,0x4c,0xeb,
        0xd9,0xa9,0x00,0x8d,0xd8,0x02,0xa2,0x02,
        0x20,0x95,0xd9,0xe0,0x02,0xf0,0x18,0xe0,
        0x01,0xf0,0x0a,0xc6,0x24,0xc6,0x24,0xad,
        0xd8,0x02,0x20,0xe3,0xfd,0xad,0xd8,0x02,
        0x0a,0x0a,0x0a,0x0a,0x8d,0xd8,0x02,0xad,
        0xda,0x02,0x0d,0xd8,0x02,0x8d,0xd8,0x02,
        0x20,0xe3,0xfd,0xe0,0x00,0xf0,0xd1,0xca,
        0x4c,0xb8,0xd9,0x38,0xe9,0xb0,0x90,0x14,
        0xc9,0x0a,0x90,0x0a,0xc9,0x11,0x90,0x0c,
        0xc9,0x17,0xb0,0x08,0x69,0x09,0x29,0x0f,
        0x8d,0xda,0x02,0x60,0x20,0x3a,0xff,0xd0,
        0x8c,0xa0,0x04,0xa9,0x06,0x85,0x24,0xa9,
        0x00,0x20,0x5b,0xfb,0x20,0xa8,0xde,0x20,
        0xa8,0xde,0xc6,0x24,0xc6,0x24,0x20,0xb1,
        0xd9,0xe0,0x02,0xf0,0x2c,0xad,0xd8,0x02,
        0xc0,0x01,0xd0,0x0d,0x30,0x20,0xc9,0x08,
        0xb0,0x1c,0x0a,0x0a,0x0a,0x0a,0x8d,0xd1,
        0x02,0xc0,0x04,0xd0,0x02,0x30,0x0f,0xc0,
        0x05,0xd0,0x07,0x30,0x09,0xcd,0xe1,0x02,
        0xb0,0x04,0x99,0xc2,0x02,0x60,0x20,0x3a,
        0xff,0x4c,0x37,0xdb,0xa0,0x05,0xa9,0x11,
        0x85,0x24,0xa9,0x00,0x20,0x5b,0xfb,0x20,
        0xa8,0xde,0xc6,0x24,0x20,0x75,0xd9,0xe0,
        0x01,0xf0,0xe6,0x4c,0x25,0xda,0xa0,0x01,
        0xa9,0x1c,0xd0,0xe4,0x38,0xa9,0x03,0xed,
        0xc4,0x02,0x8d,0xc4,0x02,0x60,0xad,0xcb,
        0x02,0xf0,0x49,0xa9,0x01,0xd0,0x02,0xa9,
        0x02,0x8d,0xce,0x02,0x20,0xf0,0xde,0x20,
        0x77,0xdb,0x20,0x61,0xd8,0xad,0x27,0x04,
        0xc9,0x4c,0xd0,0x30,0xa9,0x00,0x85,0x1e,
        0xad,0xcb,0x02,0x85,0x1f,0xd0,0x04,0xe6,
        0x1e,0xf0,0x21,0xa5,0x00,0x29,0x0f,0xa8,
        0x88,0x20,0x9e,0xde,0xc8,0xd9,0x00,0x00,
        0xd0,0xed,0x88,0xd0,0xf3,0x20,0x3a,0xff,
        0xa0,0x80,0x98,0x20,0xa8,0xfc,0x88,0xd0,
        0xf9,0xad,0x10,0xc0,0x60,0x20,0x42,0xde,
        0x4c,0x7e,0xda,0x38,0xa0,0x05,0xb9,0xc2,
        0x02,0xe9,0x01,0x10,0x12,0x38,0xad,0xe2,
        0x02,0x99,0xc2,0x02,0xa0,0x04,0xb9,0xc2,
        0x02,0xe9,0x01,0x10,0x02,0xa9,0x22,0x99,
        0xc2,0x02,0x4c,0x7e,0xda,0xa9,0x11,0x85,
        0x24,0xa9,0x01,0x20,0x5b,0xfb,0x20,0xa8,
        0xde,0x20,0xa8,0xde,0xc6,0x24,0xc6,0x24,
        0x20,0xb1,0xd9,0xad,0xd8,0x02,0x8d,0xcb,
        0x02,0x4c,0x61,0xd8,0xa0,0x00,0x38,0xb9,
        0xf1,0xdf,0xf9,0xe1,0x02,0x99,0xe1,0x02,
        0xc8,0xc0,0x05,0xd0,0xf1,0xa0,0x1b,0x84,
        0x24,0xa9,0x01,0x20,0x5b,0xfb,0xad,0xe3,
        0x02,0x20,0xda,0xfd,0x4c,0x37,0xdb,0xa9,
        0x06,0x85,0x24,0xa9,0x00,0x20,0x5b,0xfb,
        0xad,0xc6,0x02,0x20,0xda,0xfd,0xa9,0x11,
        0x85,0x24,0xad,0xc7,0x02,0x20,0xe3,0xfd,
        0xa9,0x1c,0x85,0x24,0xad,0xc3,0x02,0x6a,
        0x6a,0x6a,0x6a,0x20,0xe3,0xfd,0xa9,0x25,
        0x85,0x24,0xad,0xc4,0x02,0x20,0xe3,0xfd,
        0xa9,0x11,0x85,0x24,0xa9,0x01,0x20,0x5b,
        0xfb,0xad,0xcb,0x02,0x4c,0xda,0xfd,0x08,
        0xa9,0x01,0x20,0x5b,0xfb,0xa9,0x1e,0x85,
        0x24,0x20,0x9c,0xfc,0x28,0x90,0x2a,0xad,
        0xcf,0x02,0x0a,0x90,0x04,0xa0,0x09,0xd0,
        0x13,0x0a,0x90,0x04,0xa0,0x13,0xd0,0x0c,
        0x0a,0x90,0x04,0xa0,0x1d,0xd0,0x05,0x0a,
        0x90,0x0f,0xa0,0x27,0xb9,0xc9,0xdf,0x10,
        0x09,0x29,0x7f,0x20,0xed,0xfd,0x88,0x10,
        0xf3,0x60,0x20,0xed,0xfd,0x68,0x68,0x60,
        0xa9,0xff,0x8d,0xea,0x02,0xa9,0x11,0x8d,
        0xc6,0x02,0xa9,0x00,0x8d,0xc7,0x02,0xa9,
        0x01,0x8d,0xce,0x02,0xad,0xcb,0x02,0xf0,
        0xe0,0x20,0xf0,0xde,0x20,0x77,0xdb,0xa9,
        0x03,0x85,0x24,0xa9,0x04,0x20,0x46,0xfc,
        0xa9,0x04,0x20,0x5b,0xfb,0xa2,0x00,0xa0,
        0x10,0x8a,0x20,0xe3,0xfd,0x88,0xd0,0x03,
        0xe8,0xd0,0xf4,0xa5,0x24,0xc9,0x26,0xd0,
        0xf0,0xa9,0x03,0x85,0x24,0xa9,0x05,0x20,
        0x5b,0xfb,0xa0,0x00,0x98,0x20,0xe3,0xfd,
        0xc8,0xc0,0x23,0xd0,0xf7,0xa0,0x00,0x98,
        0x85,0x24,0xa9,0x07,0x20,0x5b,0xfb,0x98,
        0x20,0xe3,0xfd,0xc8,0xcc,0xe1,0x02,0xf0,
        0x09,0xc6,0x24,0xe6,0x25,0xa5,0x25,0x4c,
        0x14,0xdc,0xa9,0x03,0x85,0x24,0xa9,0x07,
        0x85,0x25,0x20,0x22,0xfc,0xa9,0x00,0x85,
        0x18,0x85,0x19,0xa9,0x38,0x85,0x14,0xad,
        0xe4,0x02,0x85,0x16,0xa4,0x14,0xc8,0x20,
        0xe6,0x02,0xae,0xe1,0x02,0xe0,0x0d,0xd0,
        0x06,0x18,0x6a,0x18,0x6a,0x18,0x6a,0x85,
        0x15,0xae,0xe5,0x02,0x86,0x16,0x20,0x86,
        0xdc,0x88,0x20,0xe6,0x02,0x85,0x15,0x18,
        0xa2,0x08,0x86,0x16,0x20,0x86,0xdc,0xc0,
        0xc0,0xf0,0x12,0xc8,0xc8,0xc8,0xc8,0x84,
        0x14,0xe6,0x24,0xa9,0x07,0x85,0x25,0x20,
        0x22,0xfc,0x18,0x90,0xbf,0x60,0x98,0x48,
        0x66,0x15,0xa9,0xa3,0x90,0x08,0xa9,0xad,
        0xe6,0x18,0xd0,0x02,0xe6,0x19,0x20,0xed,
        0xfd,0xe6,0x25,0x20,0x22,0xfc,0xc6,0x24,
        0xc6,0x16,0xd0,0xe4,0x68,0xa8,0x60,0xee,
        0xc6,0x02,0x20,0x37,0xdb,0xa9,0x00,0x8d,
        0xce,0x02,0x20,0xf0,0xde,0xae,0xc3,0x02,
        0xbd,0x89,0xc0,0xa9,0x20,0x85,0x23,0xa0,
        0x00,0xbd,0x8c,0xc0,0x10,0xfb,0x91,0x22,
        0xc8,0xd0,0xf6,0xe6,0x23,0xa5,0x23,0xc9,
        0x40,0xd0,0xee,0xa9,0x18,0x85,0x23,0xbd,
        0x88,0xc0,0x20,0xe9,0xde,0x8d,0x50,0xc0,
        0x8d,0x57,0xc0,0x20,0xcc,0xde,0x8d,0x51,
        0xc0,0xad,0x10,0xc0,0xa9,0x20,0x4c,0x86,
        0xdd,0x8d,0xc0,0x02,0xad,0xec,0x02,0x20,
        0xa8,0xfc,0xad,0x00,0xc0,0x10,0x28,0xc9,
        0x8d,0xf0,0x16,0xc9,0xd1,0xd0,0x0b,0x38,
        0xa9,0x11,0xed,0xec,0x02,0x8d,0xec,0x02,
        0xd0,0x0b,0x20,0xcc,0xde,0xc9,0x8d,0xd0,
        0x04,0xa9,0xff,0x85,0x12,0xc9,0x9a,0xd0,
        0x03,0x20,0x00,0x03,0x8d,0x10,0xc0,0xad,
        0xc0,0x02,0x4c,0xf0,0xfd,0x20,0xe9,0xde,
        0x20,0xe0,0xde,0xa9,0xff,0x85,0x1e,0xa9,
        0xc0,0x85,0x1f,0xe6,0x1e,0xd0,0x02,0xe6,
        0x1f,0xa5,0x1f,0xc9,0xc0,0xd0,0x03,0x4c,
        0x6d,0xdd,0xa5,0x00,0x29,0x0f,0xa8,0x20,
        0x9e,0xde,0xd9,0x00,0x00,0xd0,0xe4,0x88,
        0xd0,0xf5,0xe6,0x1e,0xa6,0x1e,0xd0,0x02,
        0xe6,0x1f,0xa4,0x1f,0x20,0x40,0xf9,0x20,
        0xa8,0xde,0x4c,0x3b,0xdd,0x20,0x0c,0xfd,
        0x4c,0xc8,0xdd,0x20,0x58,0xfc,0x4c,0xd0,
        0x03,0x38,0xa9,0xec,0xed,0x27,0x04,0x8d,
        0x27,0x04,0x60,0xad,0xcb,0x02,0x85,0x3d,
        0x20,0xe9,0xde,0x20,0xe0,0xde,0xa9,0x00,
        0x85,0x12,0x85,0x3c,0xa5,0x3c,0x85,0x10,
        0xa5,0x3d,0xc9,0xc0,0xd0,0x04,0xe6,0x3d,
        0xa5,0x3d,0x85,0x11,0x20,0xa3,0xfd,0xa2,
        0x02,0x20,0x4a,0xf9,0xa0,0x00,0xb1,0x10,
        0xc9,0x80,0x30,0x06,0xc9,0xa0,0x10,0x02,
        0x29,0x1f,0x20,0xb9,0xde,0xc8,0xc0,0x08,
        0xd0,0xec,0xa5,0x12,0xc9,0xff,0xd0,0xcc,
        0xa9,0xf0,0x85,0x36,0xa9,0xfd,0x85,0x37,
        0x20,0xe9,0xde,0xa9,0x00,0x85,0x22,0x4c,
        0x61,0xd8,0x20,0x42,0xde,0xee,0xcb,0x02,
        0x4c,0x8c,0xda,0x20,0x84,0xfe,0x20,0x2f,
        0xfb,0x20,0x58,0xfc,0xa9,0x00,0x20,0x99,
        0xde,0xb9,0xf7,0xde,0x20,0xed,0xfd,0x88,
        0xd0,0xf7,0xa9,0x01,0x20,0x99,0xde,0xb9,
        0x20,0xdf,0x20,0xed,0xfd,0x88,0xd0,0xf7,
        0xa9,0x02,0x20,0x99,0xde,0xa9,0xbd,0x20,
        0xed,0xfd,0x88,0xd0,0xf8,0xb9,0x49,0xdf,
        0x99,0xc2,0x02,0xc8,0xc0,0x3e,0xd0,0xf5,
        0x60,0xa9,0xf0,0x85,0x36,0xa9,0xfd,0x85,
        0x37,0x85,0x39,0xa9,0x1b,0x85,0x38,0x60,
        0xa9,0x01,0xa0,0x01,0x84,0x24,0x20,0x5b,
        0xfb,0xa2,0x09,0x20,0x4a,0xf9,0x88,0x84,
        0x24,0x60,0x18,0xa0,0x05,0xb9,0xc2,0x02,
        0x69,0x01,0xcd,0xe1,0x02,0x30,0x13,0x18,
        0xa9,0x00,0x99,0xc2,0x02,0xa0,0x04,0xb9,
        0xc2,0x02,0x69,0x01,0xc9,0x23,0x30,0x02,
        0xa9,0x00,0x99,0xc2,0x02,0x60,0xa9,0x04,
        0x85,0x24,0xa9,0x04,0x20,0x5b,0xfb,0xa0,
        0x00,0x98,0x20,0xe3,0xfd,0x20,0xa8,0xde,
        0xc8,0x98,0x29,0x03,0xd0,0x03,0x20,0xa8,
        0xde,0xc0,0x10,0xd0,0xec,0xa9,0x02,0x85,
        0x24,0xa9,0x05,0x20,0x5b,0xfb,0xa0,0x25,
        0xa9,0xad,0x20,0xed,0xfd,0x88,0xd0,0xf8,
        0x60,0xa0,0x28,0x4c,0x5b,0xfb,0xb1,0x1e,
        0xae,0xd7,0x02,0xf0,0x02,0x09,0x80,0x60,
        0xa9,0xa0,0x4c,0xed,0xfd,0x38,0xa9,0x01,
        0xed,0xeb,0x02,0x8d,0xeb,0x02,0x4c,0x61,
        0xd8,0x48,0xad,0xeb,0x02,0xf0,0x09,0x68,
        0xc9,0xa0,0xb0,0x05,0x69,0x40,0xd0,0xf8,
        0x68,0x4c,0xed,0xfd,0x8d,0x10,0xc0,0xad,
        0x00,0xc0,0x10,0xfb,0xc9,0x88,0xd0,0x07,
        0xc6,0x3d,0xc6,0x3f,0x4c,0xcc,0xde,0x60,
        0xa9,0xf1,0x85,0x36,0xa9,0xdc,0x85,0x37,
        0x60,0xa9,0x03,0x85,0x22,0x4c,0x58,0xfc,
        0xa9,0x02,0xa0,0xc2,0x4c,0xd9,0x03,0xa0,
        0xa0,0xa0,0xb1,0xa0,0xc5,0xd6,0xc9,0xd2,
        0xc4,0xa0,0xa0,0xb6,0xa0,0xd4,0xcf,0xcc,
        0xd3,0xa0,0xa0,0xa0,0xa0,0xa0,0xb0,0xa0,
        0xd2,0xcf,0xd4,0xc3,0xc5,0xd3,0xa0,0xa0,
        0xb0,0xb0,0xa0,0xcb,0xc3,0xc1,0xd2,0xd4,
        0xa0,0xa0,0xa0,0xb0,0xae,0xb4,0xa0,0xd2,
        0xc5,0xd6,0xa0,0xa0,0xb6,0xb1,0xa0,0xd3,
        0xcf,0xc4,0xa0,0xa0,0xb0,0xb0,0xb8,0xb0,
        0xa0,0xd2,0xc5,0xc6,0xc6,0xd5,0xc2,0xa0,
        0xa0,0xa0,0xa0,0xa0,0xa0,0xa0,0xa0,0xa0,
        0xa0,0x01,0x60,0x01,0x00,0x00,0x00,0xd3,
        0x02,0x00,0x08,0x00,0x00,0x01,0x00,0x00,
        0x60,0x01,0x00,0x01,0xef,0xd8,0x00,0x00,
        0x00,0x00,0x00,0x00,0xbd,0x00,0x08,0x60,
        0x10,0x0f,0x16,0x0b,0x08,0xb9,0x00,0x08,
        0x60,0xff,0x00,0x10,0xad,0x80,0xc0,0xad,
        0x00,0xd8,0xc9,0xa9,0xd0,0x03,0x4c,0x00,
        0xd8,0xad,0x81,0xc0,0x4c,0x00,0xd8,0xc1,
        0xc4,0xc5,0xd2,0xd3,0xd4,0x97,0xd0,0xbb,
        0xad,0xc2,0xd6,0xcd,0xce,0x9a,0xc6,0xc8,
        0x89,0x83,0xcc,0xd8,0xde,0x50,0xd8,0x73,
        0xda,0xef,0xd8,0x7d,0xda,0x53,0xda,0x08,
        0xda,0x86,0xda,0x6d,0xda,0xcc,0xda,0xd2,
        0xda,0xf4,0xda,0x13,0xdb,0xb7,0xdb,0xac,
        0xdc,0xff,0x02,0x2c,0xdd,0x82,0xdd,0xd9,
        0xdd,0x72,0xdd,0x78,0xdd,0xac,0xde,0xa6,
        0xdc,0x52,0xcf,0xd2,0xd2,0xc5,0xe0,0xc4,
        0xc1,0xc5,0xd2,0x60,0xd2,0xd2,0xc5,0xe0,
        0xc5,0xd6,0xc9,0xd2,0xc4,0x48,0xc3,0xd4,
        0xc1,0xcd,0xd3,0xc9,0xcd,0xe0,0xd6,0x54,
        0xcf,0xd2,0xd0,0xe0,0xc5,0xd4,0xc9,0xd2,
        0xd7,0x1d,0x1b,0x29,0x13,0x0d,0xff,0xff,
        0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff
    ];
    
    return {
        start: function() {
            return 0xd0;
        },
        end: function() {
            return 0xff;
        },
        read: function(page, off) {
            return rom[((page - 0xD0) << 8) + off];
        },
        write: function() {
        }
    };
}

module.exports = Aide1;
