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

var debug = require('debug')('apple2js:mouse');
var Util = require('../util');

function Mouse(cpu) {

    // $Cn05 = $38
    // $Cn07 = $18
    // $Cn0B = $01
    // $Cn0C = $20
    // $CnFB = $D6

    // $Cn12 SETMOUSE Sets mouse mode
    // $Cn13 SERVEMOUSE Services mouse interrupt
    // $Cn14 READMOUSE Reads mouse position
    // $Cn15 CLEARMOUSE Clears mouse position to 0 (for delta mode)
    // $Cn16 POSMOUSE Sets mouse position to a user-defined pos
    // $Cn17 CLAMPMOUSE Sets mouse bounds in a window
    // $Cn18 HOMEMOUSE Sets mouse to upper-left corner of clamp win
    // $Cn19 INITMOUSE Resets mouse clamps to default values;

    // $0478 + slot Low byte of absolute X position
    // $04F8 + slot Low byte of absolute Y position
    // $0578 + slot High byte of absolute X position
    // $05F8 + slot High byte of absolute Y position
    // $0678 + slot Reserved and used by the firmware
    // $06F8 + slot Reserved and used by the firmware
    // $0778 + slot Button 0/1 interrupt status byte
    // $07F8 + slot Mode byte

    // The interrupt status byte is defined as follows:

    // 7 6 5 4 3 2 1 0
    // | | | | | | | |
    // | | | | | | | \--- Previously, button 1 was up (0) or down (1)
    // | | | | | | \----- Movement interrupt
    // | | | | | \------- Button 0/1 interrupt
    // | | | | \--------- VBL interrupt
    // | | | \----------- Currently, button 1 is up (0) or down (1)
    // | | \------------- X/Y moved since last READMOUSE
    // | \--------------- Previously, button 0 was up (0) or down (1)
    // \----------------- Currently, button 0 is up (0) or down (1)

    var STATUS = {
        BUTTON1_PREV: 0x01,
        MOVE_INT: 0x02,
        BUTTON_INT: 0x04,
        VBL_INT: 0x08,
        BUTTON1_DOWN: 0x10,
        MOVED: 0x20,
        BUTTON0_PREV: 0x40,
        BUTTON0_DOWN: 0x80
    };

    // The mode byte is defined as follows.
    //
    // 7 6 5 4 3 2 1 0
    // | | | | | | | |
    // | | | | | | | \--- Mouse off (0) or on (1)
    // | | | | | | \----- Interrupt if mouse is moved
    // | | | | | \------- Interrupt if button is pressed
    // | | | | \--------- Interrupt on VBL
    // | | | \----------- Reserved
    // | | \------------- Reserved
    // | \--------------- Reserved
    // \----------------- Reserved

    var MODE = {
        MOUSE_ON: 0x01,
        MOUSE_MOVE: 0x02,
        MOUSE_BUTTON: 0x04,
        VBL: 0x08,
        INVALID: 0xf0
    };

    var ROM = [
        // 0     1     2     3     4     5     6     7     8     9     A     B     C     D     E     F
        0x00, 0x00, 0x00, 0x00, 0x00, 0x38, 0x00, 0x18, 0x00, 0x00, 0x00, 0x01, 0x20, 0x00, 0x00, 0x00, // 0
        0x00, 0x00, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 1
        0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 2
        0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 3

        0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 4
        0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 5
        0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 6
        0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 7

        0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 8
        0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 9
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // A
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // B

        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // C
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // D
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // E
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xD6, 0x00, 0x00, 0x00, 0x00  // F
    ];

    var verticalBlank = false;
    var mouseMoved = false;
    var buttonPressed = false;

    var status = 0;
    var mode = 0;

    var mouseX = 0;
    var mouseY = 0;
    var mouse0 = false;
    var mouse1 = false;

    var prevX = 0;
    var prevY = 0;
    var prev0 = false;
    var prev1 = false;

    var minX = 0;
    var minY = 0;
    var maxX = 1023;
    var maxY = 1023;

    function readClampMin() {
        return cpu.read(0x04, 0x78) | cpu.read(0x05, 0x78) << 8;
    }

    function readClampMax() {
        return cpu.read(0x04, 0xF8) | cpu.read(0x05, 0xF8) << 8;
    }

    function readX(slot) {
        return cpu.read(0x04, 0x78 + slot) | cpu.read(0x05, 0x78 + slot) << 8;
    }

    function readY(slot) {
        return cpu.read(0x04, 0xF8 + slot) | cpu.read(0x05, 0xF8 + slot) << 8;
    }

    // $0478 + slot Low byte of absolute X position
    // $04F8 + slot Low byte of absolute Y position
    // $0578 + slot High byte of absolute X position
    // $05F8 + slot High byte of absolute Y position

    function writeXY(slot) {
        cpu.write(0x04, 0x78 + slot, mouseX & 0xff);
        cpu.write(0x04, 0xF8 + slot, mouseY & 0xff);
        cpu.write(0x05, 0x78 + slot, mouseX >> 8);
        cpu.write(0x05, 0xF8 + slot, mouseY >> 8);
    }

    // $0778 + slot Button 0/1 interrupt status byte
    function writeStatus(slot) {
        cpu.write(0x07, 0x78 + slot, status);
    }

    // $07F8 + slot Mode byte
    function writeMode(slot) {
        cpu.write(0x07, 0xF8 + slot, mode);
    }

    function testMode(testMode) {
        return (mode & testMode) && (mode & MODE.MOUSE_ON);
    }

    function clearCarry(state) {
        state.s &= 0xfe;
    }

    function setCarry(state) {
        state.s |= 0x01;
    }

    return {
        read: function(page, off, debugFlag) {
            var slot = page & 0x0f;
            var sync = cpu.sync();

            if (!debugFlag) {
                debug(
                    'read $' + Util.toHex(page) + Util.toHex(off) +
                    '=$' + Util.toHex(ROM[off]), cpu.sync()
                );
            }

            if (sync) {
                var state = cpu.getState();
                switch (off) {
                case 0x20: // SETMOUSE
                    mode = state.a;
                    debug('SETMOUSE', Util.toBinary(mode));
                    if (mode & MODE.INVALID) {
                        setCarry(state);
                    } else {
                        clearCarry(state);
                    }
                    break;

                case 0x30: // SERVEMOUSE
                    setCarry(state);
                    if (verticalBlank) {
                        status |= STATUS.VBL;
                        clearCarry(state);
                    } else {
                        status &= ~STATUS.VBL;
                    }
                    if (mouseMoved) {
                        status |= STATUS.MOVE_INT;
                        clearCarry(state);
                    } else {
                        status &= ~STATUS.MOVE_INT;
                    }
                    if (buttonPressed) {
                        status |= STATUS.BUTTON_INT;
                        clearCarry(state);
                    } else {
                        status &= ~STATUS.BUTTON_INT;
                    }
                    writeStatus(slot);
                    debug('SERVEMOUSE', Util.toBinary(status));

                    verticalBlank = false;
                    mouseMoved = false;
                    buttonPressed = false;

                    break;

                case 0x40: // READMOUSE
                    status = 0;
                    status |= mouse0 ? STATUS.BUTTON0_DOWN : 0x00;
                    status |= prev0 ? STATUS.BUTTON0_PREV : 0x00;
                    status |= (mouseX != prevX || mouseY != prevY) ? STATUS.MOVED : 0x00;
                    status |= mouse1 ? STATUS.BUTTON1_DOWN : 0x00;
                    status |= prev1 ? STATUS.BUTTON1_PREV : 0x00;

                    debug('READMOUSE', mouseX, mouseY, Util.toBinary(status), Util.toBinary(mode));

                    writeXY(slot);
                    writeStatus(slot);
                    writeMode(slot);

                    verticalBlank = false;
                    mouseMoved = false;
                    buttonPressed = false;

                    prevX = mouseX;
                    prevY = mouseY;
                    prev0 = mouse0;
                    prev1 = mouse1;

                    clearCarry(state);
                    break;

                case 0x50: // CLEARMOUSE
                    debug('CLEARMOUSE');
                    mouseX = minX;
                    mouseY = minY;
                    writeXY();

                    clearCarry(state);
                    break;

                case 0x60: // POSMOUSE
                    mouseX = readX(slot);
                    mouseY = readY(slot);
                    debug('POSMOUSE', mouseX, mouseY);

                    clearCarry(state);
                    break;

                case 0x70: // CLAMPMOUSE
                    if (state.a == 0) {
                        minX = readClampMin();
                        maxX = readClampMax();
                        debug('CLAMPMOUSE X', minX, maxX);
                    } else {
                        minY = readClampMin();
                        maxY = readClampMax();
                        debug('CLAMPMOUSE Y', minY, maxY);
                    }

                    clearCarry(state);
                    break;

                case 0x80: // HOMEMOUSE
                    debug('HOMEMOUSE');
                    mouseX = minX;
                    mouseY = minY;
                    writeXY(slot);

                    clearCarry(state);
                    break;

                case 0x90: // INITMOUSE
                    debug('INITMOUSE');
                    mouseX = 0;
                    mouseY = 0;
                    minX = 0;
                    minY = 0;
                    maxX = 1023;
                    maxY = 1023;
                    status = 0;
                    writeXY();
                    writeStatus();

                    clearCarry(state);
                    break;
                }
                cpu.setState(state);
            }
            return ROM[off];
        },

        write: function() {},

        mouseXY: function(x, y) {
            mouseX = Math.max(minX, Math.min(maxX, x));
            mouseY = Math.max(minY, Math.min(maxY, y));
            debug('mouseXY', mouseX, mouseY);

            if (testMode(MODE.MOUSE_MOVE) && ((mouseX != prevX) || (mouseY != prevY))) {
                cpu.irq();
            }
        },

        buttonDown: function() {
            debug('buttonDown');
            mouse0 = true;
            if (testMode(MODE.MOUSE_BUTTON)) {
                cpu.irq();
            }
        },

        buttonUp: function() {
            debug('buttonUp');
            mouse0 = false;
            if (testMode(MODE.MOUSE_BUTTON)) {
                cpu.irq();
            }
        },

        startVB: function startVB() {
            verticalBlank = true;
            if (testMode(MODE.VBL)) {
                cpu.irq();
            }
        },

        getClamps: function getClamps() {
            return {
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY
            };
        },

        enabled: function enabled() {
            return !!(mode & MODE.MOUSE_ON);
        }
    };
}

module.exports = Mouse;
