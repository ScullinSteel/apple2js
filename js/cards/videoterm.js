/* Copyright 2017 Will Scullin <scullin@scullinsteel.com>
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation.  No representations are made about the suitability of this
 * software for any purpose.  It is provided "as is" without express or
 * implied warranty.
 */

 var Util = require('../util');
 var debug = require('debug')('apple2js:videoterm');
 var allocMemPages = Util.allocMemPages;

 function Videoterm(context) {
     'use strict';

     debug('Videx Videoterm');

     var LOC = {
         IOREG: 0x80,
         IOVAL: 0x81
     };

     var ROM = [
         0xad,0x7b,0x07,0x29,0xf8,0xc9,0x30,0xf0,
         0x21,0xa9,0x30,0x8d,0x7b,0x07,0x8d,0xfb,
         0x07,0xa9,0x00,0x8d,0xfb,0x06,0x20,0x61,
         0xc9,0xa2,0x00,0x8a,0x8d,0xb0,0xc0,0xbd,
         0xa1,0xc8,0x8d,0xb1,0xc0,0xe8,0xe0,0x10,
         0xd0,0xf1,0x8d,0x59,0xc0,0x60,0xad,0xfb,
         0x07,0x29,0x08,0xf0,0x09,0x20,0x93,0xfe,
         0x20,0x22,0xfc,0x20,0x89,0xfe,0x68,0xa8,
         0x68,0xaa,0x68,0x60,0x20,0xd1,0xc8,0xe6,
         0x4e,0xd0,0x02,0xe6,0x4f,0xad,0x00,0xc0,
         0x10,0xf5,0x20,0x5c,0xc8,0x90,0xf0,0x2c,
         0x10,0xc0,0x18,0x60,0xc9,0x8b,0xd0,0x02,
         0xa9,0xdb,0xc9,0x81,0xd0,0x0a,0xad,0xfb,
         0x07,0x49,0x40,0x8d,0xfb,0x07,0xb0,0xe7,
         0x48,0xad,0xfb,0x07,0x0a,0x0a,0x68,0x90,
         0x1f,0xc9,0xb0,0x90,0x1b,0x2c,0x63,0xc0,
         0x30,0x14,0xc9,0xb0,0xf0,0x0e,0xc9,0xc0,
         0xd0,0x02,0xa9,0xd0,0xc9,0xdb,0x90,0x08,
         0x29,0xcf,0xd0,0x04,0xa9,0xdd,0x09,0x20,
         0x48,0x29,0x7f,0x8d,0x7b,0x06,0x68,0x38,
         0x60,0x7b,0x50,0x5e,0x29,0x1b,0x08,0x18,
         0x19,0x00,0x08,0xe0,0x08,0x00,0x00,0x00,
         0x00,0x8d,0x7b,0x06,0xa5,0x25,0xcd,0xfb,
         0x05,0xf0,0x06,0x8d,0xfb,0x05,0x20,0x04,
         0xca,0xa5,0x24,0xcd,0x7b,0x05,0x90,0x03,
         0x8d,0x7b,0x05,0xad,0x7b,0x06,0x20,0x89,
         0xca,0xa9,0x0f,0x8d,0xb0,0xc0,0xad,0x7b,
         0x05,0xc9,0x50,0xb0,0x13,0x6d,0x7b,0x04,
         0x8d,0xb1,0xc0,0xa9,0x0e,0x8d,0xb0,0xc0,
         0xa9,0x00,0x6d,0xfb,0x04,0x8d,0xb1,0xc0,
         0x60,0x49,0xc0,0xc9,0x08,0xb0,0x1d,0xa8,
         0xa9,0xc9,0x48,0xb9,0xf2,0xcb,0x48,0x60,
         0xea,0xac,0x7b,0x05,0xa9,0xa0,0x20,0x71,
         0xca,0xc8,0xc0,0x50,0x90,0xf8,0x60,0xa9,
         0x34,0x8d,0x7b,0x07,0x60,0xa9,0x32,0xd0,
         0xf8,0xa0,0xc0,0xa2,0x80,0xca,0xd0,0xfd,
         0xad,0x30,0xc0,0x88,0xd0,0xf5,0x60,0xac,
         0x7b,0x05,0xc0,0x50,0x90,0x05,0x48,0x20,
         0xb0,0xc9,0x68,0xac,0x7b,0x05,0x20,0x71,
         0xca,0xee,0x7b,0x05,0x2c,0x78,0x04,0x10,
         0x07,0xad,0x7b,0x05,0xc9,0x50,0xb0,0x68,
         0x60,0xac,0x7b,0x05,0xad,0xfb,0x05,0x48,
         0x20,0x07,0xca,0x20,0x04,0xc9,0xa0,0x00,
         0x68,0x69,0x00,0xc9,0x18,0x90,0xf0,0xb0,
         0x23,0x20,0x67,0xc9,0x98,0xf0,0xe8,0xa9,
         0x00,0x8d,0x7b,0x05,0x8d,0xfb,0x05,0xa8,
         0xf0,0x12,0xce,0x7b,0x05,0x10,0x9d,0xa9,
         0x4f,0x8d,0x7b,0x05,0xad,0xfb,0x05,0xf0,
         0x93,0xce,0xfb,0x05,0x4c,0x04,0xca,0xa9,
         0x30,0x8d,0x7b,0x07,0x68,0x09,0x80,0xc9,
         0xb1,0xd0,0x67,0xa9,0x08,0x8d,0x58,0xc0,
         0xd0,0x5b,0xc9,0xb2,0xd0,0x51,0xa9,0xfe,
         0x2d,0xfb,0x07,0x8d,0xfb,0x07,0x60,0x8d,
         0x7b,0x06,0x4e,0x78,0x04,0x4c,0xcb,0xc8,
         0x20,0x27,0xca,0xee,0xfb,0x05,0xad,0xfb,
         0x05,0xc9,0x18,0x90,0x4a,0xce,0xfb,0x05,
         0xad,0xfb,0x06,0x69,0x04,0x29,0x7f,0x8d,
         0xfb,0x06,0x20,0x12,0xca,0xa9,0x0d,0x8d,
         0xb0,0xc0,0xad,0x7b,0x04,0x8d,0xb1,0xc0,
         0xa9,0x0c,0x8d,0xb0,0xc0,0xad,0xfb,0x04,
         0x8d,0xb1,0xc0,0xa9,0x17,0x20,0x07,0xca,
         0xa0,0x00,0x20,0x04,0xc9,0xb0,0x95,0xc9,
         0xb3,0xd0,0x0e,0xa9,0x01,0x0d,0xfb,0x07,
         0xd0,0xa9,0xc9,0xb0,0xd0,0x9c,0x4c,0x09,
         0xc8,0x4c,0x27,0xc9,0xad,0xfb,0x05,0x8d,
         0xf8,0x04,0x0a,0x0a,0x6d,0xf8,0x04,0x6d,
         0xfb,0x06,0x48,0x4a,0x4a,0x4a,0x4a,0x8d,
         0xfb,0x04,0x68,0x0a,0x0a,0x0a,0x0a,0x8d,
         0x7b,0x04,0x60,0xc9,0x0d,0xd0,0x06,0xa9,
         0x00,0x8d,0x7b,0x05,0x60,0x09,0x80,0xc9,
         0xa0,0xb0,0xce,0xc9,0x87,0x90,0x08,0xa8,
         0xa9,0xc9,0x48,0xb9,0xb9,0xc9,0x48,0x60,
         0x18,0x71,0x13,0xb2,0x48,0x60,0xaf,0x9d,
         0xf2,0x13,0x13,0x13,0x13,0x13,0x13,0x13,
         0x13,0x13,0x66,0x0e,0x13,0x38,0x00,0x14,
         0x7b,0x18,0x98,0x6d,0x7b,0x04,0x48,0xa9,
         0x00,0x6d,0xfb,0x04,0x48,0x0a,0x29,0x0c,
         0xaa,0xbd,0xb0,0xc0,0x68,0x4a,0x68,0xaa,
         0x60,0x0a,0x48,0xad,0xfb,0x07,0x4a,0x68,
         0x6a,0x48,0x20,0x59,0xca,0x68,0xb0,0x05,
         0x9d,0x00,0xcc,0x90,0x03,0x9d,0x00,0xcd,
         0x60,0x48,0xa9,0xf7,0x20,0xa0,0xc9,0x8d,
         0x59,0xc0,0xad,0x7b,0x07,0x29,0x07,0xd0,
         0x04,0x68,0x4c,0x23,0xca,0x29,0x04,0xf0,
         0x03,0x4c,0x87,0xc9,0x68,0x38,0xe9,0x20,
         0x29,0x7f,0x48,0xce,0x7b,0x07,0xad,0x7b,
         0x07,0x29,0x03,0xd0,0x15,0x68,0xc9,0x18,
         0xb0,0x03,0x8d,0xfb,0x05,0xad,0xf8,0x05,
         0xc9,0x50,0xb0,0x03,0x8d,0x7b,0x05,0x4c,
         0x04,0xca,0x68,0x8d,0xf8,0x05,0x60,0xad,
         0x00,0xc0,0xc9,0x93,0xd0,0x0f,0x2c,0x10,
         0xc0,0xad,0x00,0xc0,0x10,0xfb,0xc9,0x83,
         0xf0,0x03,0x2c,0x10,0xc0,0x60,0xa8,0xb9,
         0x31,0xcb,0x20,0xf1,0xc8,0x20,0x44,0xc8,
         0xc9,0xce,0xb0,0x08,0xc9,0xc9,0x90,0x04,
         0xc9,0xcc,0xd0,0xea,0x4c,0xf1,0xc8,0xea,
         0x2c,0xcb,0xff,0x70,0x31,0x38,0x90,0x18,
         0xb8,0x50,0x2b,0x01,0x82,0x11,0x14,0x1c,
         0x22,0x4c,0x00,0xc8,0x20,0x44,0xc8,0x29,
         0x7f,0xa2,0x00,0x60,0x20,0xa7,0xc9,0xa2,
         0x00,0x60,0xc9,0x00,0xf0,0x09,0xad,0x00,
         0xc0,0x0a,0x90,0x03,0x20,0x5c,0xc8,0xa2,
         0x00,0x60,0x91,0x28,0x38,0xb8,0x8d,0xff,
         0xcf,0x48,0x85,0x35,0x8a,0x48,0x98,0x48,
         0xa5,0x35,0x86,0x35,0xa2,0xc3,0x8e,0x78,
         0x04,0x48,0x50,0x10,0xa9,0x32,0x85,0x38,
         0x86,0x39,0xa9,0x07,0x85,0x36,0x86,0x37,
         0x20,0x00,0xc8,0x18,0x90,0x6f,0x68,0xa4,
         0x35,0xf0,0x1f,0x88,0xad,0x78,0x06,0xc9,
         0x88,0xf0,0x17,0xd9,0x00,0x02,0xf0,0x12,
         0x49,0x20,0xd9,0x00,0x02,0xd0,0x3b,0xad,
         0x78,0x06,0x99,0x00,0x02,0xb0,0x03,0x20,
         0xed,0xca,0xa9,0x80,0x20,0xf5,0xc9,0x20,
         0x44,0xc8,0xc9,0x9b,0xf0,0xf1,0xc9,0x8d,
         0xd0,0x05,0x48,0x20,0x01,0xc9,0x68,0xc9,
         0x95,0xd0,0x12,0xac,0x7b,0x05,0x20,0x59,
         0xca,0xb0,0x05,0xbd,0x00,0xcc,0x90,0x03,
         0xbd,0x00,0xcd,0x09,0x80,0x8d,0x78,0x06,
         0xd0,0x08,0x20,0x44,0xc8,0xa0,0x00,0x8c,
         0x78,0x06,0xba,0xe8,0xe8,0xe8,0x9d,0x00,
         0x01,0xa9,0x00,0x85,0x24,0xad,0xfb,0x05,
         0x85,0x25,0x4c,0x2e,0xc8,0x68,0xac,0xfb,
         0x07,0x10,0x08,0xac,0x78,0x06,0xc0,0xe0,
         0x90,0x01,0x98,0x20,0xb1,0xc8,0x20,0xcf,
         0xca,0xa9,0x7f,0x20,0xa0,0xc9,0xad,0x7b,
         0x05,0xe9,0x47,0x90,0xd4,0x69,0x1f,0x18,
         0x90,0xd1,0x60,0x38,0x71,0xb2,0x7b,0x00,
         0x48,0x66,0xc4,0xc2,0xc1,0xff,0xc3,0xea,
     ];

     var VIDEO_ROM = [
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0xff,0xff,0xff,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0xff,0xff,0xff,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0xff,0xff,0xff,0xff,0xff,0xff,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,
         0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0xff,0xff,0xff,0x00,0x00,0x00,0xff,0xff,
         0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0xff,0xff,0xff,0xff,0xff,
         0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,
         0xff,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0xe0,0x90,0xe0,0x9e,0xf0,0x0c,0x02,0x1c,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x90,0x90,0xf0,0x90,0xbe,0x08,0x08,0x08,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x80,0x80,0x80,0x9e,0xf0,0x18,0x10,0x10,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x88,0x88,0x50,0x20,0x3e,0x08,0x08,0x08,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0xf0,0x80,0xc0,0x9e,0x90,0x18,0x10,0x10,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x70,0x80,0x80,0x7c,0x12,0x1c,0x14,0x12,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x70,0x80,0x60,0x10,0xec,0x12,0x12,0x0c,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x70,0x80,0x60,0x1e,0xe4,0x04,0x04,0x0e,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x08,0x08,0x08,0x08,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x0f,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x08,0x08,0x08,0x0f,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x08,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x00,0x00,0x00,0x00,0x0f,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x0f,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x00,0x00,0x00,0x00,0xf8,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x08,0x08,0x08,0xf8,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0xff,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x08,0x08,0x08,0xff,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0xf8,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0xf8,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x00,0x00,0x00,0x00,0xff,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0xff,0x08,0x08,0x08,
         0x08,0x08,0x08,0x08,0x08,0x08,0x08,0x08,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x18,0x18,0x18,0x18,0x18,0x00,0x18,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x36,0x36,0x12,0x24,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x24,0x24,0x7e,0x24,0x7e,0x24,0x24,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x3e,0x48,0x3c,0x12,0x7c,0x10,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x62,0x94,0x68,0x10,0x2c,0x52,0x8c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x20,0x50,0x50,0x62,0x94,0x88,0x76,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x18,0x18,0x08,0x10,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x0c,0x10,0x20,0x20,0x20,0x10,0x0c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x30,0x08,0x04,0x04,0x04,0x08,0x30,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x10,0x92,0x54,0x38,0x54,0x92,0x10,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x10,0x10,0xfe,0x10,0x10,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x18,0x18,0x08,0x10,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x7e,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x38,0x44,0x8a,0x92,0xa2,0x44,0x38,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x38,0x08,0x08,0x08,0x08,0x3e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x3c,0x42,0x02,0x1c,0x20,0x40,0x7e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x7e,0x04,0x08,0x1c,0x02,0x42,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x04,0x0c,0x14,0x24,0x7e,0x04,0x04,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x7e,0x40,0x7c,0x02,0x02,0x42,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x1e,0x20,0x40,0x7c,0x42,0x42,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x7e,0x02,0x04,0x08,0x10,0x20,0x20,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x3c,0x42,0x42,0x3c,0x42,0x42,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x3c,0x42,0x42,0x3e,0x02,0x04,0x78,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x18,0x18,0x00,0x18,0x18,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x18,0x18,0x00,0x18,0x18,0x08,0x10,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x06,0x18,0x60,0x18,0x06,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x7e,0x00,0x7e,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x60,0x18,0x06,0x18,0x60,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x3c,0x42,0x02,0x0c,0x10,0x00,0x10,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x3c,0x42,0x9a,0xaa,0x94,0x40,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x18,0x24,0x42,0x42,0x7e,0x42,0x42,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x7c,0x42,0x42,0x7c,0x42,0x42,0x7c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x1c,0x22,0x40,0x40,0x40,0x22,0x1c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x78,0x44,0x42,0x42,0x42,0x44,0x78,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x7e,0x40,0x40,0x78,0x40,0x40,0x7e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x7e,0x40,0x40,0x78,0x40,0x40,0x40,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x1c,0x22,0x40,0x4e,0x42,0x22,0x1e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x42,0x42,0x42,0x7e,0x42,0x42,0x42,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x1c,0x08,0x08,0x08,0x08,0x08,0x1c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x0e,0x04,0x04,0x04,0x04,0x44,0x38,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x42,0x44,0x48,0x50,0x68,0x44,0x42,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x40,0x40,0x40,0x40,0x40,0x40,0x7e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x82,0xc6,0xaa,0x92,0x82,0x82,0x82,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x42,0x62,0x52,0x4a,0x46,0x42,0x42,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x38,0x44,0x82,0x82,0x82,0x44,0x38,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x7c,0x42,0x42,0x7c,0x40,0x40,0x40,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x38,0x44,0x82,0x82,0x8a,0x44,0x3a,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x7c,0x42,0x42,0x7c,0x48,0x44,0x42,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x3c,0x42,0x40,0x3c,0x02,0x42,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0xfe,0x10,0x10,0x10,0x10,0x10,0x10,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x42,0x42,0x42,0x42,0x42,0x42,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x82,0x82,0x44,0x44,0x28,0x28,0x10,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x82,0x82,0x82,0x82,0x92,0xaa,0x44,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x82,0x44,0x28,0x10,0x28,0x44,0x82,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x82,0x44,0x28,0x10,0x10,0x10,0x10,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0xfe,0x04,0x08,0x10,0x20,0x40,0xfe,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x3e,0x30,0x30,0x30,0x30,0x30,0x3e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x80,0x40,0x20,0x10,0x08,0x04,0x02,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x3e,0x06,0x06,0x06,0x06,0x06,0x3e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x1c,0x2a,0x08,0x08,0x08,0x08,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xfe,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x18,0x18,0x10,0x08,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0xf8,0x04,0x7c,0x84,0x7a,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x40,0x40,0x7c,0x42,0x42,0x42,0x7c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x3c,0x42,0x40,0x40,0x3e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x02,0x02,0x3e,0x42,0x42,0x42,0x3e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x3c,0x42,0x7e,0x40,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x1c,0x22,0x20,0x78,0x20,0x20,0x20,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x02,0x3c,0x42,0x42,0x3e,0x02,0x42,
         0x3c,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x40,0x40,0x5c,0x62,0x42,0x42,0x42,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x00,0x08,0x08,0x08,0x08,0x08,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x04,0x00,0x04,0x04,0x04,0x04,0x04,0x24,
         0x18,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x40,0x40,0x46,0x58,0x60,0x58,0x46,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x18,0x08,0x08,0x08,0x08,0x08,0x1c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0xec,0x92,0x92,0x92,0x92,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x5c,0x22,0x22,0x22,0x22,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x3c,0x42,0x42,0x42,0x3c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x7c,0x42,0x42,0x42,0x7c,0x40,
         0x40,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x3e,0x42,0x42,0x42,0x3e,0x02,
         0x02,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x5c,0x62,0x40,0x40,0x40,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x3e,0x40,0x3c,0x02,0x7c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x10,0x3e,0x10,0x10,0x10,0x0e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x44,0x44,0x44,0x44,0x3a,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x82,0x82,0x44,0x28,0x10,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x82,0x82,0x92,0xaa,0x44,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x42,0x24,0x18,0x24,0x42,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x82,0x82,0x44,0x28,0x10,0x20,
         0xc0,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x7e,0x04,0x18,0x20,0x7e,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x0c,0x10,0x08,0x30,0x08,0x10,0x0c,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x08,0x08,0x08,0x00,0x08,0x08,0x08,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x30,0x08,0x10,0x0c,0x10,0x08,0x30,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x60,0x92,0x0c,0x00,0x00,0x00,0x00,0x00,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
         0x24,0x48,0x92,0x24,0x48,0x92,0x24,0x48,
         0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
     ];

     var REGS = {
         CURSOR_UPPER: 0x0A,
         CURSOR_LOWER: 0x0B,
         STARTPOS_HI: 0x0C,
         STARTPOS_LO: 0x0D,
         CURSOR_HI: 0x0E,
         CURSOR_LO: 0x0F,
         LIGHTPEN_HI: 0x10,
         LIGHTPEN_LO: 0x11
     };

     var CURSOR_MODES = {
         SOLID: 0x00,
         HIDDEN: 0x01,
         BLINK: 0x10,
         FAST_BLINK: 0x11
     };

     var _regs = [
         0x7b, // 00 - Horiz. total
         0x50, // 01 - Horiz. displayed
         0x62, // 02 - Horiz. sync pos
         0x29, // 03 - Horiz. sync width
         0x1b, // 04 - Vert. total
         0x08, // 05 - Vert. adjust
         0x18, // 06 - Vert. displayed
         0x19, // 07 - Vert. sync pos
         0x00, // 08 - Interlaced
         0x08, // 09 - Max. scan line
         0xc0, // 0A - Cursor upper
         0x08, // 0B - Cursor lower
         0x00, // 0C - Startpos Hi
         0x00, // 0D - Startpos Lo
         0x00, // 0E - Cursor Hi
         0x00, // 0F - Cursor Lo
         0x00, // 10 - Lightpen Hi
         0x00  // 11 - Lightpen Lo
     ];

     var _blink = false;
     var _curReg = 0;
     var _startPos;
     var _cursorPos;
     var _shouldRefresh;

    // var _cursor = 0;
     var _bank = 0;
     var _buffer = allocMemPages(8);
     var _imageData;

     var _black = [0x00, 0x00, 0x00];
     var _white = [0xff, 0xff, 0xff];

     function _init() {
         var idx;

         _imageData = context.createImageData(560, 384);
         for (idx = 0; idx < 560 * 384 * 4; idx++) {
             _imageData.data[idx] = 0xff;
         }

         for (idx = 0; idx < 0x800; idx++) {
             _buffer[idx] = idx & 0xff;
         }

         _refresh();

         setInterval(function() {
             _blink = !_blink;
             _refreshCursor();
         }, 300);
     }

     function _updateBuffer(addr, val) {
         _buffer[addr] = val;
         val &= 0x7f; // XXX temp
         var saddr = (0x800 + addr - _startPos) & 0x7ff;
         var data = _imageData.data;
         var row = (saddr / 80) & 0xff;
         var col = saddr % 80;
         var x = col * 7;
         var y = row * 16;
         var c = val * 16;
         var color;

         if (row < 25) {
             for (var idx = 0; idx < 8; idx++) {
                 var cdata = VIDEO_ROM[c + idx];
                 for (var jdx = 0; jdx < 7; jdx++) {
                     if (cdata & 0x80) {
                         color = _white;
                     } else {
                         color = _black;
                     }
                     data[(y + idx * 2) * 560 * 4 + (x + jdx) * 4] = color[0];
                     data[(y + idx * 2) * 560 * 4 + (x + jdx) * 4 + 1] = color[1];
                     data[(y + idx * 2) * 560 * 4 + (x + jdx) * 4 + 2] = color[2];
                     data[(y + idx * 2 + 1) * 560 * 4 + (x + jdx) * 4] = color[0];
                     data[(y + idx * 2 + 1) * 560 * 4 + (x + jdx) * 4 + 1] = color[1];
                     data[(y + idx * 2 + 1) * 560 * 4 + (x + jdx) * 4 + 2] = color[2];
                     cdata <<= 1;
                 }
             }
         }
     }

     function _refreshCursor(fromRegs) {
         var addr = _regs[REGS.CURSOR_HI] << 8 | _regs[REGS.CURSOR_LO];
         var saddr = (0x800 + addr - _startPos) & 0x7ff;
         var data = _imageData.data;
         var row = (saddr / 80) & 0xff;
         var col = saddr % 80;
         var x = col * 7;
         var y = row * 16;
         var blinkmode = (_regs[REGS.CURSOR_UPPER] & 0x60) >> 5;

         if (fromRegs) {
             if (addr !== _cursorPos) {
                 var caddr = (0x800 + _cursorPos - _startPos) & 0x7ff;
                 _updateBuffer(caddr, _buffer[caddr]);
                 _cursorPos = addr;
             }
         }

         _updateBuffer(addr, _buffer[addr]);
         if (blinkmode === CURSOR_MODES.HIDDEN) {
             return;
         }
         if (_blink || (blinkmode === CURSOR_MODES.SOLID)) {
             for (var idx = 0; idx < 8; idx++) {
                 var color = _white;
                 if (idx >= (_regs[REGS.CURSOR_UPPER] & 0x1f) &&
                    idx <= (_regs[REGS.CURSOR_LOWER] & 0x1f)) {
                     for (var jdx = 0; jdx < 7; jdx++) {
                         data[(y + idx * 2) * 560 * 4 + (x + jdx) * 4] = color[0];
                         data[(y + idx * 2) * 560 * 4 + (x + jdx) * 4 + 1] = color[1];
                         data[(y + idx * 2) * 560 * 4 + (x + jdx) * 4 + 2] = color[2];
                         data[(y + idx * 2 + 1) * 560 * 4 + (x + jdx) * 4] = color[0];
                         data[(y + idx * 2 + 1) * 560 * 4 + (x + jdx) * 4 + 1] = color[1];
                         data[(y + idx * 2 + 1) * 560 * 4 + (x + jdx) * 4 + 2] = color[2];
                     }
                 }
             }
         }
     }

     function _updateStartPos() {
         var startPos =
            _regs[REGS.STARTPOS_HI] << 8 |
            _regs[REGS.STARTPOS_LO];
         if (_startPos != startPos) {
             _startPos = startPos;
             _shouldRefresh = true;
         }
     }

     function _refresh() {
         for (var idx = 0; idx < 0x800; idx++) {
             _updateBuffer(idx, _buffer[idx]);
         }
     }

     function _access(off, val) {
         var writeMode = val !== undefined;
         var result = undefined;
         switch (off & 0x81) {
         case LOC.IOREG:
             if (writeMode) {
                 _curReg = val;
             } else {
                 result = _curReg;
             }
             break;
         case LOC.IOVAL:
             if (writeMode) {
                 _regs[_curReg] = val;
                 switch (_curReg) {
                 case REGS.CURSOR_UPPER:
                 case REGS.CURSOR_LOWER:
                     _refreshCursor(true);
                     break;
                 case REGS.CURSOR_HI:
                 case REGS.CURSOR_LO:
                     _refreshCursor(true);
                     break;
                 case REGS.STARTPOS_HI:
                 case REGS.STARTPOS_LO:
                     _updateStartPos();
                     break;
                 }
             } else {
                 result = _regs[_curReg];
             }
             break;
         }
         _bank = (off & 0x0C) >> 2;
         return result;
     }

     _init();

     return {
         ioSwitch: function (off, val) {
             return _access(off, val);
         },

         read: function(page, off) {
             if (page < 0xcc) {
                 return ROM[(page & 0x03) << 8 | off];
             } else if (page < 0xce){
                 var addr = ((page & 0x01) + (_bank << 1)) << 8 | off;
                 return _buffer[addr];
             }
         },

         write: function(page, off, val) {
             if (page > 0xcb && page < 0xce) {
                 var addr = ((page & 0x01) + (_bank << 1)) << 8 | off;
                 _updateBuffer(addr, val);
             }
         },

         blit: function() {
             if (_shouldRefresh) {
                 _refresh();
                 _shouldRefresh = false;
             }
             context.putImageData(_imageData, 0, 0);
         }
     };
 }

 module.exports = Videoterm;
