/* Copyright 2010-2015 Will Scullin <scullin@scullinsteel.com>
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation.  No representations are made about the suitability of this
 * software for any purpose.  It is provided "as is" without express or
 * implied warranty.
 */

var debug = require('debug')('apple2js:smartport');
var Base64 = require('./base64');
var Util = require('./util');
var toHex = Util.toHex;

var base64_decode = Base64.decode;

function SmartPort(cpu, slot) {

    var disk64 = require('json!../json/disks/basic.json');
    var disk = [];

    disk[1] = [];
    for (var idx = 0; idx < 1600; idx++) {
        disk[1][idx] = base64_decode(disk64.blocks[idx]);
    }

    /*
        $Cn01=$20
        $Cn03=$00
        $Cn05=$03
        $Cn07=$00
    */

    var ROM = [
        0x00, 0x20, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x60, 0x00, 0x00, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f, 0x10
    ];

    function dumpBlock(drive, block) {
        var result = '';
        var b;
        var jdx;
        for (idx = 0; idx < 16; idx++) {
            result += toHex(idx << 4) + ': ';
            for (jdx = 0; jdx < 16; jdx++) {
                b = disk[drive][block][idx * 16 + jdx];
                result += toHex(b) + ' ';
            }
            result += '        ';
            for (jdx = 0; jdx < 16; jdx++) {
                b = disk[drive][block][idx * 16 + jdx] & 0x7f;
                if (b >= 0x20 && b < 0x7f) {
                    result += String.fromCharCode(b);
                } else {
                    result += '.';
                }
            }
            result += '\n';
        }
        return result;
    }

    function Address() {
        var lo;
        var hi;

        if (arguments.length == 1) {
            lo = arguments[0] & 0xff;
            hi = arguments[0] >> 8;
        } else if (arguments.length == 2) {
            lo = arguments[0];
            hi = arguments[1];
        }

        return {
            loByte: function() {
                return lo;
            },

            hiByte: function() {
                return hi;
            },

            inc: function(val) {
                return new Address(((hi << 8 | lo) + val) & 0xffff);
            },

            readByte: function() {
                return cpu.read(hi, lo);
            },

            readWord: function() {
                var readLo = this.readByte();
                var readHi = this.inc(1).readByte();

                return readHi << 8 | readLo;
            },

            readAddress: function() {
                var readLo = this.readByte();
                var readHi = this.inc(1).readByte();

                return new Address(readLo, readHi);
            },

            writeByte: function(val) {
                cpu.write(hi, lo, val);
            },

            writeWord: function(val) {
                this.writeByte(val & 0xff);
                this.inc(1).writeByte(val >> 8);
            },

            writeAddress: function(val) {
                this.writeByte(val.loByte());
                this.inc(1).writeByte(val.hiByte());
            },

            toString: function() {
                return '$' + toHex(hi) + toHex(lo);
            }
        };
    }

    return {
        start: function() {
            return 0xc0 + slot;
        },

        end: function() {
            return 0xc0 + slot;
        },

        read: function(page, off) {
            var state = cpu.getState();
            var cmd;
            var unit;
            var idx;
            var buffer;
            var block;

            debug('read: ' + toHex(off) + '=' + toHex(ROM[off]));
            if (off == 0x10) { // Regular block device entry POINT
                debug('block device entry');
                cmd = cpu.read(0x00, 0x42);
                unit = cpu.read(0x00, 0x43);
                debug('cmd=' + cmd);
                debug('unit=' + unit);

                switch (cmd) {
                case 0:
                    state.x = 0x40;
                    state.y = 0x06;
                    break;
                case 1:
                    unit = 1; // CHEAT
                    var bufferAddr = new Address(0x44);
                    var blockAddr = new Address(0x46);
                    buffer = bufferAddr.readAddress();
                    block = blockAddr.readWord();
                    debug('read buffer=' + buffer);
                    debug('read block=' + toHex(block));
                    debug('read data=', '\n', dumpBlock(unit, block));

                    for (idx = 0; idx < 512; idx++) {
                        buffer.writeByte(disk[unit][block][idx]);
                        buffer = buffer.inc(1);
                    }
                    break;
                }

                state.a = 0;
                state.s &= 0xfe;
                cpu.setState(state);
            } else if (off == 0x13) {
                debug('smartport entry');
                var retVal = {};
                var stackAddr = new Address(state.sp + 1, 0x01);

                retVal = stackAddr.readAddress();

                debug('return=' + retVal);

                var cmdBlockAddr = retVal.inc(1);
                cmd = cmdBlockAddr.readByte();
                var cmdListAddr = cmdBlockAddr.inc(1).readAddress();

                debug('cmd=' + cmd);
                debug('cmdListAddr=' + cmdListAddr);

                stackAddr.writeAddress(cmdBlockAddr.inc(2));

                var parameterCount = cmdListAddr.readByte();
                unit = cmdListAddr.inc(1).readByte();
                buffer = cmdListAddr.inc(2).readAddress();
                var status;

                debug('parameterCount=' + parameterCount);
                switch (cmd) {
                case 0x00: // INFO
                    status = cmdListAddr.inc(4).readByte();
                    debug('info unit=' + unit);
                    debug('info buffer=' + buffer);
                    debug('info status=' + status);
                    switch (unit) {
                    case 0:
                        switch (status) {
                        case 0:
                            buffer.writeByte(1); // one device
                            buffer.inc(1).writeByte(0); // no interrupts
                            buffer.inc(2).writeByte(0); // reserved
                            buffer.inc(3).writeByte(0); // reserved
                            buffer.inc(4).writeByte(0); // reserved
                            buffer.inc(5).writeByte(0); // reserved
                            buffer.inc(6).writeByte(0); // reserved
                            buffer.inc(7).writeByte(0); // reserved
                            state.x = 8;
                            state.y = 0;
                            break;
                        }
                        break;
                    case 1: // Unit 1
                        switch (status) {
                        case 0:
                            buffer.writeByte(0xf0); // W/R Block device in drive
                            buffer.inc(1).writeByte(0x40); // 1600 blocks
                            buffer.inc(2).writeByte(0x06);
                            buffer.inc(3).writeByte(0x00);
                            state.x = 4;
                            state.y = 0;
                            break;
                        }
                        break;
                    }
                    state.a = 0;
                    state.s &= 0xfe;
                    cpu.setState(state);
                    break;

                case 0x01: // READ BLOCK
                    block = cmdListAddr.inc(4).readWord();
                    debug('read unit=' + unit);
                    debug('read buffer=' + buffer);
                    debug('read block=' + toHex(block));

                    for (idx = 0; idx < 512; idx++) {
                        buffer.writeByte(disk[unit][block][idx]);
                        buffer = buffer.inc(1);
                    }
                    state.a = 0;
                    state.s &= 0xfe;
                    cpu.setState(state);
                    break;

                case 0x02: // WRITE BLOCK
                    block = cmdListAddr.inc(4).readWord();
                    debug('write unit=' + unit);
                    debug('write buffer=' + buffer);
                    debug('write block=' + toHex(block));

                    for (idx = 0; idx < 512; idx++) {
                        disk[unit][block][idx] = buffer.readByte();
                        buffer = buffer.inc(1);
                    }
                    state.a = 0;
                    state.s &= 0xfe;
                    cpu.setState(state);
                    break;

                default:
                    break;
                }
            }
            return ROM[off];
        },

        write: function() {
        },

        getState: function() {
        },

        setState: function() {
        }
    };
}

module.exports = SmartPort;
