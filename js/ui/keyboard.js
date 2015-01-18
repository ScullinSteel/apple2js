/* -*- mode: JavaScript; indent-tabs-mode: nil; c-basic-offset: 4 -*- */
/* Copyright 2010-2013 Will Scullin <scullin@scullinsteel.com>
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation.  No representations are made about the suitability of this
 * software for any purpose.  It is provided "as is" without express or
 * implied warranty.
 */

/*jshint browser:true */

var Util = require('../util.js');
var debug = Util.debug;
var toHex = Util.toHex;

function KeyBoard(io) {
    // keycode: [plain, cntl, shift]
    var keymap = {
        // Most of these won't happen
        0x00: [0x00, 0x00, 0x00], // 
        0x01: [0x01, 0x01, 0x01], // 
        0x02: [0x02, 0x02, 0x02], // 
        0x03: [0x03, 0x03, 0x03], // 
        0x04: [0x04, 0x04, 0x04], // 
        0x05: [0x05, 0x05, 0x05], // 
        0x06: [0x06, 0x06, 0x06], // 
        0x07: [0x07, 0x07, 0x07], // 
        0x08: [0x7F, 0x7F, 0x7F], // BS/DELETE
        0x09: [0x09, 0x09, 0x09], // TAB
        0x0A: [0x0A, 0x0A, 0x0A], // 
        0x0B: [0x0B, 0x0B, 0x0B], // 
        0x0C: [0x0C, 0x0C, 0x0C], // 
        0x0D: [0x0D, 0x0D, 0x0D], // CR
        0x0E: [0x0E, 0x0E, 0x0E], // 
        0x0F: [0x0F, 0x0F, 0x0F], // 
        
        0x10: [0xff, 0xff, 0xff], // SHIFT
        0x11: [0xff, 0xff, 0xff], // CTRL
        0x12: [0xff, 0xff, 0xff], // ALT/OPTION
        0x13: [0x13, 0x13, 0x13], // 
        0x14: [0x14, 0x14, 0x14], // 
        0x15: [0x15, 0x15, 0x15], // 
        0x16: [0x16, 0x16, 0x16], // 
        0x17: [0x17, 0x17, 0x18], // 
        0x18: [0x18, 0x18, 0x18], // 
        0x19: [0x19, 0x19, 0x19], // 
        0x1A: [0x1A, 0x1A, 0x1A], // 
        0x1B: [0x1B, 0x1B, 0x1B], // ESC
        0x1C: [0x1C, 0x1C, 0x1C], // 
        0x1D: [0x1D, 0x1D, 0x1D], // 
        0x1E: [0x1E, 0x1E, 0x1E], // 
        0x1F: [0x1F, 0x1F, 0x1F], // 
        
        // Most of these besides space won't happen
        0x20: [0x20, 0x20, 0x20], // 
        0x21: [0x21, 0x21, 0x21], // 
        0x22: [0x22, 0x22, 0x22], // 
        0x23: [0x23, 0x23, 0x23], // 
        0x24: [0x24, 0x24, 0x24], // 
        0x25: [0x08, 0x08, 0x08], // <- left
        0x26: [0x0B, 0x0B, 0x0B], // ^ up
        0x27: [0x15, 0x15, 0x15], // -> right
        0x28: [0x0A, 0x0A, 0x0A], // v down
        0x29: [0x29, 0x29, 0x29], // )
        0x2A: [0x2A, 0x2A, 0x2A], // *
        0x2B: [0x2B, 0x2B, 0x2B], // +
        0x2C: [0x2C, 0x2C, 0x3C], // , - <
        0x2D: [0x2D, 0x2D, 0x5F], // - - _
        0x2E: [0x2E, 0x2E, 0x3E], // . - >
        0x2F: [0x2F, 0x2F, 0x3F], // / - ?
        
        0x30: [0x30, 0x30, 0x29], // 0 - )
        0x31: [0x31, 0x31, 0x21], // 1 - !
        0x32: [0x32, 0x00, 0x40], // 2 - @
        0x33: [0x33, 0x33, 0x23], // 3 - #
        0x34: [0x34, 0x34, 0x24], // 4 - $
        0x35: [0x35, 0x35, 0x25], // 5 - %
        0x36: [0x36, 0x36, 0x5E], // 6 - ^
        0x37: [0x37, 0x37, 0x26], // 7 - &
        0x38: [0x38, 0x38, 0x2A], // 8 - *
        0x39: [0x39, 0x39, 0x28], // 9 - (
        0x3A: [0x3A, 0x3A, 0x3A], // :
        0x3B: [0x3B, 0x3B, 0x3A], // ; - :
        0x3C: [0x3C, 0x3C, 0x3C], // <
        0x3D: [0x3D, 0x3D, 0x2B], // = - +
        0x3E: [0x3E, 0x3E, 0x3E], // >
        0x3F: [0x3F, 0x3F, 0x3F], // ?
        
        // Alpha and control
        0x40: [0x40, 0x00, 0x40], // @
        0x41: [0x61, 0x01, 0x41], // A
        0x42: [0x62, 0x02, 0x42], // B
        0x43: [0x63, 0x03, 0x43], // C - BRK
        0x44: [0x64, 0x04, 0x44], // D
        0x45: [0x65, 0x05, 0x45], // E
        0x46: [0x66, 0x06, 0x46], // F
        0x47: [0x67, 0x07, 0x47], // G - BELL
        0x48: [0x68, 0x08, 0x48], // H
        0x49: [0x69, 0x09, 0x49], // I - TAB
        0x4A: [0x6A, 0x0A, 0x4A], // J - NL
        0x4B: [0x6B, 0x0B, 0x4B], // K - VT 
        0x4C: [0x6C, 0x0C, 0x4C], // L
        0x4D: [0x6D, 0x0D, 0x4D], // M - CR
        0x4E: [0x6E, 0x0E, 0x4E], // N
        0x4F: [0x6F, 0x0F, 0x4F], // O
        
        0x50: [0x70, 0x10, 0x50], // P
        0x51: [0x71, 0x11, 0x51], // Q
        0x52: [0x72, 0x12, 0x52], // R
        0x53: [0x73, 0x13, 0x53], // S
        0x54: [0x74, 0x14, 0x54], // T
        0x55: [0x75, 0x15, 0x55], // U
        0x56: [0x76, 0x16, 0x56], // V
        0x57: [0x77, 0x17, 0x57], // W
        0x58: [0x78, 0x18, 0x58], // X
        0x59: [0x79, 0x19, 0x59], // Y
        0x5A: [0x7A, 0x1A, 0x5A], // Z
        0x5B: [0xFF, 0xFF, 0xFF], // Left window
        0x5C: [0xFF, 0xFF, 0xFF], // Right window
        0x5D: [0xFF, 0xFF, 0xFF], // Select
        0x5E: [0x5E, 0x1E, 0x5E], //
        0x5F: [0x5F, 0x1F, 0x5F], // _

        // Numeric pad
        0x60: [0x30, 0x30, 0x30], // 0
        0x61: [0x31, 0x31, 0x31], // 1
        0x62: [0x32, 0x32, 0x32], // 2
        0x63: [0x33, 0x33, 0x33], // 3
        0x64: [0x34, 0x34, 0x34], // 4
        0x65: [0x35, 0x35, 0x35], // 5
        0x66: [0x36, 0x36, 0x36], // 6
        0x67: [0x37, 0x37, 0x37], // 7
        0x68: [0x38, 0x38, 0x38], // 8
        0x69: [0x39, 0x39, 0x39], // 9

        0x6A: [0x2A, 0x2A, 0x2A], // *
        0x6B: [0x2B, 0x2B, 0x2B], // +
        0x6D: [0x2D, 0x2D, 0x2D], // -
        0x6E: [0x2E, 0x2E, 0x2E], // .
        0x6F: [0x2F, 0x2F, 0x39], // /
        
        // Stray keys
        0xBA: [0x3B, 0x3B, 0x3A], // ; - :
        0xBB: [0x3D, 0x3D, 0x2B], // = - +
        0xBC: [0x2C, 0x2C, 0x3C], // , - <
        0xBD: [0x2D, 0x2D, 0x5F], // - - _
        0xBE: [0x2E, 0x2E, 0x3E], // . - >
        0xBF: [0x2F, 0x2F, 0x3F], // / - ?
        0xC0: [0x60, 0x60, 0x7E], // ` - ~
        0xDB: [0x5B, 0x5B, 0x7B], // [
        0xDC: [0x5C, 0x5C, 0x7C], // \
        0xDD: [0x5D, 0x5D, 0x7D], // ]
        0xDE: [0x27, 0x22, 0x22], // ' - "
        
        0xFF: [0xFF, 0xFF, 0xFF] // No comma line
    };

    var keys = 
        [[['ESC','1','2','3','4','5','6','7','8','9','0','-','=','DELETE'],
          ['TAB','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],
          ['CTRL','A','S','D','F','G','H','J','K','L',';','\'','RETURN'],
          ['SHIFT','Z','X','C','V','B','N','M',',','.','/','SHIFT'],
          ['LOCK','`','POW','OPEN_APPLE','&nbsp;','CLOSED_APPLE','&larr;','&rarr;','&darr;','&uarr;']],
         [['ESC','!','@','#','$','%','^','&','*','(',')','_','+','DELETE'],
          ['TAB','Q','W','E','R','T','Y','U','I','O','P','{','}','|'],
          ['CTRL','A','S','D','F','G','H','J','K','L',':','"','RETURN'],
          ['SHIFT','Z','X','C','V','B','N','M','<','>','?','SHIFT'],
          ['CAPS','~','POW','OPEN_APPLE','&nbsp;','CLOSED_APPLE','&larr;','&rarr;','&darr;','&uarr;']]];
    
    var shifted = false;
    var controlled = false;
    var capslocked = true;
    var optioned = false;
    var commanded = false;

    var shiftKeys;
    var controlKey;
    var commandKey;
    var optionKey;
    var lockKey;

    return {
        mapKeyEvent: function keyboard_mapKeyEvent(evt) {
            var code = evt.keyCode, key = 0xFF;
            
            if (code in keymap) {
                key = keymap[code][evt.shiftKey ? 2 : (evt.ctrlKey ? 1 : 0)];
                if (capslocked && key >= 0x61 && key <= 0x7A) {
                    key -= 0x20;
                }
            } else {
                debug('Unhandled key = ' + toHex(code));
            }
            
            return key;
        },

        shiftKey: function keyboard_shiftKey(down) {
            shifted = down;
            if (down) {
                io.buttonDown(2);
                shiftKeys[0].classList.add('active');
                shiftKeys[1].classList.add('active');
            } else {
                io.buttonUp(2);
                shiftKeys[0].classList.remove('active');
                shiftKeys[1].classList.remove('active');
            }
        },

        controlKey: function keyboard_controlKey(down) {
            controlled = down;
            if (down) {
                controlKey.classList.add('active');
            } else {
                controlKey.classList.remove('active');
            }
        },

        commandKey: function keyboard_commandKey(down) {
            commanded = down;
            if (down) {
                io.buttonDown(0);
                commandKey.classList.add('active');
            } else {
                io.buttonUp(0);
                commandKey.classList.remove('active');
            }
        },

        optionKey: function keyboard_optionKey(down) {
            optioned = down;
            if (down) {
                io.buttonDown(1);
                optionKey.classList.add('active');
            } else {
                io.buttonUp(1);
                optionKey.classList.remove('active');
            }
        },

        capslockKey: function keyboard_caplockKey(down) {
            capslocked = down;
            if (down) {
                lockKey.classList.add('active');
            } else {
                lockKey.classList.remove('active');
            }
        },

        create: function keyboard_create(keyboard) {
            var x, y, row, key, key1, key2, label, label1, label2, self = this;
            
            keyboard.classList.add('noselect');

            function buildLabel(k) {
                var span = document.createElement('span');
                span.innerHTML = k;
                if (k.length > 1 && k.substr(0,1) != '&') {
                    span.classList.add('small');
                }
                return span;
            }

            function _mouseup(evt) {
                evt.currentTarget.classList.remove('pressed');
            }

            function _mousedown(evt) {
                this.classList.add('pressed');
                var key = evt.currentTarget.dataset[shifted ? 'key2' : 'key1'];
                switch (key) {
                case 'BELL':
                    key = 'G';
                    break;
                case 'RETURN':
                    key = '\r';
                    break;
                case 'TAB':
                    key = '\t';
                    break;
                case 'DELETE':
                    key = '\0177';
                    break;
                case '&larr;':
                    key = '\010';
                    break;
                case '&rarr;':
                    key = '\025';
                    break;
                case '&darr;':
                    key = '\012';
                    break;
                case '&uarr;':
                    key = '\013';
                    break;
                case '&nbsp;':
                    key = ' ';
                    break;
                case 'ESC':
                    key = '\033';
                    break;
                default:
                    break;
                }
                
                if (key.length > 1) {
                    switch (key) {
                    case 'SHIFT':
                        self.shiftKey(!shifted);
                        break;
                    case 'CTRL':
                        self.controlKey(!controlled);
                        break;
                    case 'CAPS':
                    case 'LOCK':
                        self.capslockKey(!capslocked);
                        break;
                    case 'POW':
                        if (window.confirm('Power Cycle?'))
                            window.location.reload();
                        break;
                    case 'OPEN_APPLE':
                        self.commandKey(!commanded);
                        break;
                    case 'CLOSED_APPLE':
                        self.optionKey(!optioned);
                        break;
                    default:
                        break;
                    }
                } else {
                    if (controlled && key >= '@' && key <= '_') {
                        io.keyDown(key.charCodeAt(0) - 0x40);
                    } else if (!shifted && !capslocked && 
                               key >= 'A' && key <= 'Z') {
                        io.keyDown(key.charCodeAt(0) + 0x20);
                    } else {
                        io.keyDown(key.charCodeAt(0));
                    }
                }
            }

            for (y = 0; y < 5; y++) {
                row = document.createElement('div');
                row.classList.add('row');
                row.classList.add('row' + y);
                keyboard.appendChild(row);

                for (x = 0; x < keys[0][y].length; x++) {
                    key1 = keys[0][y][x];
                    key2 = keys[1][y][x];

                    label = document.createElement('div');
                    label1 = buildLabel(key1);
                    label2 = buildLabel(key2);

                    key = document.createElement('div');
                    key.classList.add('key');
                    key.classList.add('key-' + key1.replace(/[&#;]/g,''));

                    if (key1.length > 1) {
                        if (key1 == 'LOCK')
                            key.classList.add('vcenter2');
                        else
                            key.classList.add('vcenter');
                    }
                    if (key1 != key2) {
                        key.classList.add('key-' + key2.replace(/[&;]/g,''));
                        label.appendChild(label2);
                        label.appendChild(document.createElement('br'));
                    }
                    if (key1 == 'LOCK') {
                        key.classList.add('active');
                    }

                    label.appendChild(label1);
                    key.appendChild(label);
                    key.dataset.key1 = key1;
                    key.dataset.key2 = key2;

                    if (window.ontouchstart === undefined) {
                        key.addEventListener('mousedown', _mousedown);
                        key.addEventListener('mouseup', _mouseup);
                        key.addEventListener('mouseout', _mouseup);
                    } else {
                        key.addEventListener('touchstart', _mousedown);
                        key.addEventListener('touchend', _mouseup);
                        key.addEventListener('touchleave', _mouseup);
                    }
                    row.appendChild(key);
                }
            }
            shiftKeys = keyboard.querySelectorAll('.key-SHIFT');
            controlKey = keyboard.querySelector('.key-CTRL');
            commandKey = keyboard.querySelector('.key-OPEN_APPLE');
            optionKey = keyboard.querySelector('.key-CLOSED_APPLE');
            lockKey = keyboard.querySelector('.key-CAPS');

            window.addEventListener('keydown', function(evt) {
                if (evt.keyCode == 16) { // Shift
                    self.shiftKey(true);
                } else if (evt.keyCode == 17) { // Control
                    self.controlKey(true);
                } else if (evt.keyCode == 91 || evt.keyCode == 93) { // Command
                    self.commandKey(true);
                } else if (evt.keyCode == 18) { // Alt
                    self.optionKey(true);
                } else {
                    // Keyboard Input
                    var mapped = self.mapKeyEvent(evt);
                    if (mapped != 0xff) {
                        io.keyDown(mapped);
                    }
                }
                evt.preventDefault();
                return false;
            });
            window.addEventListener('keyup', function(evt) {
                if (evt.keyCode == 16) { // Shift
                    self.shiftKey(false);
                } else if (evt.keyCode == 17) { // Control
                    self.controlKey(false);
                } else if (evt.keyCode == 91 || evt.keyCode == 93) { // Command
                    self.commandKey(false);
                } else if (evt.keyCode == 18) { // Alt
                    self.optionKey(false);
                }
                evt.preventDefault();
                return false;
            });
        }
    };
}

module.exports = KeyBoard;
