/* Copyright 2010-2016 Will Scullin <scullin@scullinsteel.com>
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation.  No representations are made about the suitability of this
 * software for any purpose.  It is provided "as is" without express or
 * implied warranty.
 */

var debug = require('debug')('apple2js:mmu');
var RAM = require('./ram');
var Util = require('./util');
var toHex = Util.toHex;

window.DEBUG_MMU = false;

function MMU(cpu, vm, lores1, lores2, hires1, hires2, io, rom)
{
    'use strict';

    var idx;

    var _readPages = new Array(0x100);
    var _writePages = new Array(0x100);
    var _pages = new Array(0x100);

    // Language Card RAM Softswitches
    var _bank1;
    var _readbsr;
    var _writebsr;
    var _prewrite;

    // Auxilliary ROM
    var _intcxrom;
    var _slot3rom;
    var _intc8rom;

    // Auxilliary RAM
    var _auxRamRead;
    var _auxRamWrite;
    var _altzp;

    // Video
    var _80store;
    var _page2;
    var _hires;

    /*
     * I/O Switch locations
     */

    var LOC = {
        // 80 Column
        _80STOREOFF: 0x00,
        _80STOREON: 0x01,

        // Aux RAM
        RAMRDOFF: 0x02,
        RAMRDON: 0x03,

        RAMWROFF: 0x04,
        RAMWRON: 0x05,

        // Bank switched ROM
        INTCXROMOFF: 0x06,
        INTCXROMON: 0x07,
        ALTZPOFF: 0x08,
        ALTZPON: 0x09,
        SLOTC3ROMOFF: 0x0A,
        SLOTC3ROMON: 0x0B,

        // Status
        BSRBANK2: 0x11,
        BSRREADRAM: 0x12,
        RAMRD: 0x13,
        RAMWRT: 0x14,
        INTCXROM: 0x15,
        ALTZP: 0x16,
        SLOTC3ROM: 0x17,
        _80STORE: 0x18,

        PAGE1: 0x54, // select text/graphics page1 main/aux
        PAGE2: 0x55, // select text/graphics page2 main/aux
        RESET_HIRES: 0x56,
        SET_HIRES: 0x57,

        // Bank 2
        READBSR2: 0x80,
        WRITEBSR2: 0x81,
        OFFBSR2: 0x82,
        READWRBSR2: 0x83,

        // Shadow Bank 2
        _READBSR2: 0x84,
        _WRITEBSR2: 0x85,
        _OFFBSR2: 0x86,
        _READWRBSR2: 0x87,

        // Bank 1
        READBSR1: 0x88,
        WRITEBSR1: 0x89,
        OFFBSR1: 0x8a,
        READWRBSR1: 0x8b,

        // Shadow Bank 1
        _READBSR1: 0x8c,
        _WRITEBSR1: 0x8d,
        _OFFBSR1: 0x8e,
        _READWRBSR1: 0x8f
    };

    var BANKS = {
        ALTZP: 0x01,
        AUXRAM: 0x02,
        _80STORE: 0x04,
        PAGE2: 0x08,
        INTCXROM: 0x10,
        BSR: 0x20,
        ALL: 0xFF
    };

    function _initSwitches() {
        _bank1 = true;
        _readbsr = false;
        _writebsr = false;
        _prewrite = false;

        _auxRamRead = false;
        _auxRamWrite = false;
        _altzp = false;

        _intcxrom = false;
        _slot3rom = false;
        _intc8rom = false;

        _80store = false;
        _page2 = false;
        _hires = false;
    }

    function _debug() {
        if (window.DEBUG_MMU) {
            debug.apply(this, arguments);
        }
    }

    function Switches() {
        var locs = {};

        for (var loc in LOC) {
            if (LOC.hasOwnProperty(loc)) {
                locs[LOC[loc]] = loc;
            }
        }

        return {
            start: function() {
                return 0xC0;
            },
            end: function() {
                return 0xC0;
            },
            read: function(page, off) {
                var result;
                if (off in locs) {
                    result = _access(off);
                } else {
                    result = io.ioSwitch(off);
                }
                return result;
            },
            write: function(page, off, val) {
                if (off in locs) {
                    _access(off, val);
                } else {
                    io.ioSwitch(off, val);
                }
            }
        };
    }

    function AuxRom() {
        return {
            read: function(page, off) {
                if (page == 0xc3) {
                    _intc8rom = true;
                    _updateBanks(BANKS.INTCXROM);
                }
                if (page == 0xcf && off == 0xff) {
                    _intc8rom = false;
                    _updateBanks(BANKS.INTCXROM);
                }
                return rom.read(page, off);
            },
            write: function() {}
        };
    }

    var switches = new Switches();
    var auxRom = new AuxRom();

    var mem00_01 = [new RAM(0x0, 0x1), new RAM(0x0, 0x1)];
    var mem02_03 = [new RAM(0x2, 0x3), new RAM(0x2, 0x3)];
    var mem04_07 = [lores1.bank0(), lores1.bank1()];
    var mem08_0B = [lores2.bank0(), lores2.bank1()];
    var mem0C_1F = [new RAM(0xC, 0x1F), new RAM(0xC, 0x1F)];
    var mem20_3F = [hires1.bank0(), hires1.bank1()];
    var mem40_5F = [hires2.bank0(), hires2.bank1()];
    var mem60_BF = [new RAM(0x60,0xBF), new RAM(0x60,0xBF)];
    var memC0_C0 = [switches];
    var memC1_CF = [io, auxRom];
    var memD0_DF = [
        rom,
        new RAM(0xD0,0xDF), new RAM(0xD0,0xDF),
        new RAM(0xD0,0xDF), new RAM(0xD0,0xDF)
    ];
    var memE0_FF = [rom, new RAM(0xE0,0xFF), new RAM(0xE0,0xFF)];

    /*
     * Initialize read/write banks
     */

    // Zero Page/Stack
    for (idx = 0x0; idx < 0x2; idx++) {
        _pages[idx] = mem00_01;
    }
    // 0x300-0x400
    for (idx = 0x2; idx < 0x4; idx++) {
        _pages[idx] = mem02_03;
    }
    // Text Page 1
    for (idx = 0x4; idx < 0x8; idx++) {
        _pages[idx] = mem04_07;
    }
    // Text Page 2
    for (idx = 0x8; idx < 0xC; idx++) {
        _pages[idx] = mem08_0B;
    }
    // 0xC00-0x2000
    for (idx = 0xC; idx < 0x20; idx++) {
        _pages[idx] = mem0C_1F;
    }
    // Hires Page 1
    for (idx = 0x20; idx < 0x40; idx++) {
        _pages[idx] = mem20_3F;
    }
    // Hires Page 2
    for (idx = 0x40; idx < 0x60; idx++) {
        _pages[idx] = mem40_5F;
    }
    // 0x6000-0xc000
    for (idx = 0x60; idx < 0xc0; idx++) {
        _pages[idx] = mem60_BF;
    }
    // I/O Switches
    _pages[0xc0] = memC0_C0;
    // Slots
    for (idx = 0xc1; idx < 0xd0; idx++) {
        _pages[idx] = memC1_CF;
    }
    // Basic ROM
    for (idx = 0xd0; idx < 0xe0; idx++) {
        _pages[idx] = memD0_DF;
    }
    // Monitor ROM
    for (idx = 0xe0; idx < 0x100; idx++) {
        _pages[idx] = memE0_FF;
    }

    function _updateBanks(banks) {
        var bank;

        if (banks & BANKS.ALTZP) {
            bank = _altzp ? 1 : 0;
            for (idx = 0x0; idx < 0x2; idx++) {
                _readPages[idx] = _pages[idx][bank];
                _writePages[idx] = _pages[idx][bank];
            }
        }

        if (banks & (BANKS._80STORE|BANKS.AUXRAM)) {
            bank = _auxRamRead ? 1 : 0;
            for (idx = 0x02; idx < 0xC0; idx++) {
                _readPages[idx] = _pages[idx][bank];
            }

            bank = _auxRamWrite ? 1 : 0;
            for (idx = 0x02; idx < 0xC0; idx++) {
                _writePages[idx] = _pages[idx][bank];
            }
        }

        if (banks & (BANKS.PAGE2|BANKS._80STORE|BANKS.AUXRAM)) {
            if (_80store) {
                bank = _page2 ? 1 : 0;
                for (idx = 0x4; idx < 0x8; idx++) {
                    _readPages[idx] = _pages[idx][bank];
                    _writePages[idx] = _pages[idx][bank];
                }
                if (_hires) {
                    for (idx = 0x20; idx < 0x40; idx++) {
                        _readPages[idx] = _pages[idx][bank];
                        _writePages[idx] = _pages[idx][bank];
                    }
                }
            }
        }

        if (banks == BANKS.ALL) {
            _readPages[0xc0] = _pages[0xc0][0];
            _writePages[0xc0] = _pages[0xc0][0];
        }


        if (banks & BANKS.INTCXROM) {
            bank = _intcxrom ? 1 : 0;
            for (idx = 0xc1; idx < 0xc8; idx++) {
                _readPages[idx] = _pages[idx][bank];
                _writePages[idx] = _pages[idx][bank];
            }

            bank = _slot3rom && !_intcxrom ? 0 : 1;
            _readPages[0xc3] = _pages[0xc3][bank];
            _writePages[0xc3] = _pages[0xc3][bank];

            bank = _intcxrom || _intc8rom ? 1 : 0;
            for (idx = 0xc8; idx < 0xd0; idx++) {
                _readPages[idx] = _pages[idx][bank];
                _writePages[idx] = _pages[idx][bank];
            }
        }

        if (banks & (BANKS.BSR|BANKS.ALTZP)) {
            if (_readbsr) {
                bank = _bank1 ? (_altzp ? 2 : 1) : (_altzp ? 4: 3);
                for (idx = 0xd0; idx < 0xe0; idx++) {
                    _readPages[idx] = _pages[idx][bank];
                }
                bank = _altzp ? 2 : 1;
                for (idx = 0xe0; idx < 0x100; idx++) {
                    _readPages[idx] = _pages[idx][bank];
                }
            } else {
                for (idx = 0xd0; idx < 0x100; idx++) {
                    _readPages[idx] = _pages[idx][0];
                }
            }

            if (_writebsr) {
                bank = _bank1 ? (_altzp ? 2 : 1) : (_altzp ? 4: 3);
                for (idx = 0xd0; idx < 0xe0; idx++) {
                    _writePages[idx] = _pages[idx][bank];
                }
                bank = _altzp ? 2 : 1;
                for (idx = 0xe0; idx < 0x100; idx++) {
                    _writePages[idx] = _pages[idx][bank];
                }
            } else {
                for (idx = 0xd0; idx < 0x100; idx++) {
                    _writePages[idx] = _pages[idx][0];
                }
            }
        }
    }

    _updateBanks(BANKS.ALL);

    /*
     * The Big Switch
     */

    function _access(off, val) {
        var result;
        var banks = 0;
        var writeMode = val !== undefined;

        switch (off) {

        // Apple //e memory management

        case LOC._80STOREOFF:
            if (writeMode) {
                _80store = false;
                banks = BANKS._80STORE;
                _debug('80 Store Off');
            } else {
                // Chain to io for keyboard
                result = io.ioSwitch(off, val);
            }
            break;
        case LOC._80STOREON:
            if (writeMode) {
                _80store = true;
                banks = BANKS._80STORE;
                _debug('80 Store On');
            } else {
                result = 0;
            }
            break;
        case LOC.RAMRDOFF:
            if (writeMode) {
                _auxRamRead = false;
                banks = BANKS.AUXRAM;
                _debug('Aux RAM Read Off');
            } else {
                result = 0;
            }
            break;
        case LOC.RAMRDON:
            if (writeMode) {
                _auxRamRead = true;
                banks = BANKS.AUXRAM;
                _debug('Aux RAM Read On');
            } else {
                result = 0;
            }
            break;
        case LOC.RAMWROFF:
            if (writeMode) {
                _auxRamWrite = false;
                banks = BANKS.AUXRAM;
                _debug('Aux RAM Write Off');
            } else {
                result = 0;
            }
            break;
        case LOC.RAMWRON:
            if (writeMode) {
                _auxRamWrite = true;
                banks = BANKS.AUXRAM;
                _debug('Aux RAM Write On');
            } else {
                result = 0;
            }
            break;

        case LOC.INTCXROMOFF:
            if (writeMode) {
                _intcxrom = false;
                _intc8rom = false;
                banks = BANKS.INTCXROM;
                _debug('Int CX ROM Off');
            }
            break;
        case LOC.INTCXROMON:
            if (writeMode) {
                _intcxrom = true;
                banks = BANKS.INTCXROM;
                _debug('Int CX ROM On');
            }
            break;
        case LOC.ALTZPOFF: // 0x08
            if (writeMode) {
                _altzp = false;
                banks = BANKS.ALTZP;
                _debug('Alt ZP Off');
            }
            break;
        case LOC.ALTZPON: // 0x09
            if (writeMode) {
                _altzp = true;
                banks = BANKS.ALTZP;
                _debug('Alt ZP On');
            }
            break;
        case LOC.SLOTC3ROMOFF:
            if (writeMode) {
                _slot3rom = false;
                _debug('Slot 3 ROM Off');
            }
            break;
        case LOC.SLOTC3ROMON:
            if (writeMode) {
                _slot3rom = true;
                _debug('Slot 3 ROM On');
            }
            break;

        // Graphics Switches

        case LOC.PAGE1:
            _page2 = false;
            if (!_80store) {
                result = io.ioSwitch(off, val);
            }
            banks = LOC.PAGE2;
            _debug('Page 2 off');
            break;
        case LOC.PAGE2:
            _page2 = true;
            if (!_80store) {
                result = io.ioSwitch(off, val);
            }
            banks = LOC.PAGE2;
            _debug('Page 2 on');
            break;
        case LOC.RESET_HIRES:
            _hires = false;
            result = io.ioSwitch(off, val);
            banks = LOC.PAGE2;
            _debug('Hires off');
            break;

        case LOC.SET_HIRES:
            _hires = true;
            result = io.ioSwitch(off, val);
            banks = LOC.PAGE2;
            _debug('Hires on');
            break;

        // Language Card Switches

        case LOC.READBSR2:  // 0xC080
        case LOC._READBSR2: // 0xC084
            _readbsr = true;
            _writebsr = false;
            _bank1 = false;
            _prewrite = false;
            banks = BANKS.BSR;
            _debug('Bank 2 Read');
            break;
        case LOC.WRITEBSR2: // 0xC081
        case LOC._WRITEBSR2: // 0xC085
            _readbsr = false;
            if (!writeMode) {
                _writebsr = _prewrite;
            }
            _bank1 = false;
            _prewrite = !writeMode;
            banks = BANKS.BSR;
            _debug('Bank 2 Write');
            break;
        case LOC.OFFBSR2: // 0xC082
        case LOC._OFFBSR2: // 0xC086
            _readbsr = false;
            _writebsr = false;
            _bank1 = false;
            _prewrite = false;
            banks = BANKS.BSR;
            _debug('Bank 2 Off');
            break;
        case LOC.READWRBSR2: // 0xC083
        case LOC._READWRBSR2: // 0xC087
            _readbsr = true;
            if (!writeMode) {
                _writebsr = _prewrite;
            }
            _bank1 = false;
            _prewrite = !writeMode;
            banks = BANKS.BSR;
            _debug('Bank 2 Read/Write');
            break;

        case LOC.READBSR1: // 0xC088
        case LOC._READBSR1: // 0xC08c
            _readbsr = true;
            _writebsr = false;
            _bank1 = true;
            _prewrite = false;
            banks = BANKS.BSR;
            _debug('Bank 1 Read');
            break;
        case LOC.WRITEBSR1: // 0xC089
        case LOC._WRITEBSR1: // 0xC08D
            _readbsr = false;
            if (!writeMode) {
                _writebsr = _prewrite;
            }
            _bank1 = true;
            _prewrite = !writeMode;
            banks = BANKS.BSR;
            _debug('Bank 1 Write');
            break;
        case LOC.OFFBSR1: // 0xC08A
        case LOC._OFFBSR1: // 0xC08E
            _readbsr = false;
            _writebsr = false;
            _bank1 = true;
            _prewrite = false;
            banks = BANKS.BSR;
            _debug('Bank 1 Off');
            break;
        case LOC.READWRBSR1: // 0xC08B
        case LOC._READWRBSR1: // 0xC08F
            _readbsr = true;
            if (!writeMode) {
                _writebsr = _prewrite;
            }
            _bank1 = true;
            _prewrite = !writeMode;
            banks = BANKS.BSR;
            _debug('Bank 1 Read/Write');
            break;

        // Status registers

        case LOC.BSRBANK2:
            _debug('Bank 2 Read ' + !_bank1);
            result = !_bank1 ? 0x80 : 0x00;
            break;
        case LOC.BSRREADRAM:
            _debug('Bank SW RAM Read ' + _readbsr);
            result = _readbsr ? 0x80 : 0x00;
            break;
        case LOC.RAMRD: // 0xC013
            _debug('Aux RAM Read ' + _auxRamRead);
            result = _auxRamRead ? 0x80 : 0x0;
            break;
        case LOC.RAMWRT: // 0xC014
            _debug('Aux RAM Write ' + _auxRamWrite);
            result = _auxRamWrite ? 0x80 : 0x0;
            break;
        case LOC.INTCXROM: // 0xC015
            _debug('Int CX ROM ' + _intcxrom);
            result = _intcxrom ? 0x80 : 0x00;
            break;
        case LOC.ALTZP: // 0xC016
            _debug('Alt ZP ' + _altzp);
            result = _altzp ? 0x80 : 0x0;
            break;
        case LOC.SLOTC3ROM: // 0xC017
            _debug('Slot C3 ROM ' + _slot3rom);
            result = _slot3rom ? 0x80 : 0x00;
            break;
        case LOC._80STORE: // 0xC018
            _debug('80 Store ' + _80store);
            result = _80store ? 0x80 : 0x00;
            break;
        default:
            debug('MMU missing register $' + toHex(off));
            break;
        }

        if (result !== undefined) {
            return result;
        }

        result = 0;

        if (banks) {
            _updateBanks(banks);
        }

        return result;
    }

    return {
        start: function mmu_start() {
            return 0x00;
        },
        end: function mmu_end() {
            return 0xff;
        },
        reset: function() {
            debug('reset');
            _initSwitches();
            _updateBanks();
            vm.reset();
            io.reset();
        },
        read: function mmu_read(page, off, debug) {
            return _readPages[page].read(page, off, debug);
        },
        write: function mmu_write(page, off, val) {
            _writePages[page].write(page, off, val);
        },
        dump: function mmu_dump() {
            var BANK =   ' |      |';
            var RWBANK = ' |XXXXXX|';
            var RBANK =  ' |RRRRRR|';
            var WBANK =  ' |WWWWWW|';
            var SPACER = '         ';

            var results = [
                '       MAIN                       AUX   ',
                '     +------+                   +------+'
            ];

            for (var idx = 0x00; idx < 0x100; idx++) {
                var showBanks = false;
                switch (idx) {
                case 0x02:
                    showBanks = true;
                    break;
                case 0x04:
                    results.push('     +------+                   +------+');
                    results.push('     | TP1  |                   | AUX1 |');
                    results.push('     +------+                   +------+');
                    showBanks = true;
                    break;
                case 0x08:
                    results.push('     +------+                   +------+');
                    results.push('     | TP2  |                   | AUX2 |');
                    results.push('     +------+                   +------+');
                    showBanks = true;
                    break;
                case 0x20:
                    results.push('     +------+                   +------+');
                    results.push('     | HR1  |                   | AUX1 |');
                    results.push('     +------+                   +------+');
                    break;
                case 0x40:
                    results.push('     +------+                   +------+');
                    results.push('     | HR2  |                   | AUX2 |');
                    results.push('     +------+                   +------+');
                    break;
                case 0x60:
                    results.push('     +------+                   +------+');
                    results.push('     |HIMEM |                   | AUX  |');
                    results.push('     +------+                   +------+');
                    break;
                case 0xC0:
                    results.push('     +------+                   +------+');
                    results.push('     | I/O  |');
                    results.push('     +------+');
                    break;
                case 0xC1:
                    results.push('     +------+                   +------+');
                    results.push('     |SLOTS |                   |CXROM |');
                    results.push('     +------+                   +------+');
                    showBanks = true;
                    break;
                case 0xD0:
                    results.push('     +------+ +------+ +------+ +------+ +------+');
                    results.push('     | ROM  | | BSR1 | | BSR2 | | AUX1 | | AUX2 |');
                    results.push('     +------+ +------+ +------+ +------+ +------+');
                    break;
                case 0xE0:
                    results.push('     +------+ +------+ +------+ +------+ +------+');
                    results.push('     | ROM  | | BSR  |          | AUX  |');
                    results.push('     +------+ +------+          +------+');
                }

                if (showBanks || (idx % 0x10 == 0)) {
                    var banks = toHex(idx << 8, 4);
                    var numBanks = _pages[idx].length;
                    for (var jdx = 0; jdx < numBanks; jdx++) {
                        var r = _pages[idx][jdx] == _readPages[idx];
                        var w = _pages[idx][jdx] == _writePages[idx];
                        if (r && w) {
                            banks += RWBANK;
                        } else if (r) {
                            banks += RBANK;
                        } else if (w) {
                            banks += WBANK;
                        } else {
                            banks += BANK;
                        }
                        if ((numBanks == 2) && (jdx == 0)) {
                            banks += SPACER + SPACER;
                        } else if ((numBanks == 3) && (jdx == 1)) {
                            banks += SPACER;
                        }
                    }
                    results.push(banks);
                }
            }
            results.push('     +------+ +------+          +------+');

            return results;
        },
        getState: function() {
            return {
                readbsr: _readbsr,
                writebsr: _writebsr,
                bank1: _bank1,
                prewrite: _prewrite,

                intcxrom: _intcxrom,
                slot3rom: _slot3rom,
                intc8rom: _intc8rom,
                auxRamRead: _auxRamRead,
                auxRamWrite: _auxRamWrite,
                altzp: _altzp,

                _80store: _80store,
                page2: _page2,

                mem00_01: [mem00_01[0].getState(), mem00_01[1].getState()],
                mem02_03: [mem02_03[0].getState(), mem02_03[1].getState()],
                lores1: lores1.getState(),
                lores2: lores2.getState(),
                mem0C_1F: [mem0C_1F[0].getState(), mem0C_1F[1].getState()],
                hires1: hires1.getState(),
                hires2: hires2.getState(),
                mem60_BF: [mem60_BF[0].getState(), mem60_BF[1].getState()],
                io: io.getState(),
                memD0_DF: [
                    memD0_DF[0].getState(),
                    memD0_DF[1].getState(), memD0_DF[2].getState(),
                    memD0_DF[3].getState(), memD0_DF[4].getState()
                ],
                memE0_FF: [memE0_FF[0].getState(), memE0_FF[1].getState()]
            };
        },
        setState: function(state) {
            _readbsr = state.readbsr;
            _writebsr = state.writebsr;
            _bank1 = state.bank1;

            _intcxrom = state.intcxrom;
            _slot3rom = state.slot3rom;
            _intc8rom = state.intc8rom;
            _auxRamRead = state.auxRamRead;
            _auxRamWrite = state.auxRamWrite;
            _altzp = state.altzp;

            _80store = state._80store;
            _page2 = state.page2;

            mem00_01[0].setState(state.mem00_01[0]);
            mem00_01[1].setState(state.mem00_01[1]);
            mem02_03[0].setState(state.mem02_03[0]);
            mem02_03[1].setState(state.mem02_03[1]);
            lores1.setState(state.lores1);
            lores2.setState(state.lores2);
            mem0C_1F[0].setState(state.mem0C_1F[0]);
            mem0C_1F[1].setState(state.mem0C_1F[1]);
            hires1.setState(state.hires1);
            hires2.setState(state.hires2);
            mem60_BF[0].setState(state.mem60_BF[0]);
            mem60_BF[1].setState(state.mem60_BF[1]);
            io.setState(state.io);
            memD0_DF[0].setState(state.memD0_DF[0]);
            memD0_DF[1].setState(state.memD0_DF[1]);
            memD0_DF[2].setState(state.memD0_DF[2]);
            memD0_DF[3].setState(state.memD0_DF[3]);
            memD0_DF[4].setState(state.memD0_DF[4]);
            memE0_FF[0].setState(state.memE0_FF[0]);
            memE0_FF[1].setState(state.memE0_FF[1]);
            memE0_FF[2].setState(state.memE0_FF[2]);

            _access(-1);
            _prewrite = state.prewrite;
        }
    };
}

module.exports = MMU;
