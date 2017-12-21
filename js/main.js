var debugLib = require('debug');
var debug = debugLib('apple2js:main');
var extend = require('lodash/extend');
var Util = require('./util');

var AppleII = require('./apple2');
var Audio = require('./ui/audio');
var uiGamepad = require('./ui/gamepad');
var uiJoystick = require('./ui/joystick');
var KeyBoard = require('./ui/keyboard');

var DiskII = require('./cards/disk2');
var Mouse = require('./cards/mouse');
var RamFactor = require('./cards/ramfactor');
var SmartPort = require('./cards/smartport');
var Thunderclock = require('./cards/thunderclock');
var Videoterm = require('./cards/videoterm');

var Apple2enhROM = require('./roms/apple2enh');
var Apple2eROM = require('./roms/apple2e');
var Apple2ROM = require('./roms/apple2');
var Apple2plusROM = require('./roms/apple2plus');

var charset2e = require('./charroms/apple2echar').charset;
var charset2enh = require('./charroms/apple2echar').charset;
var charset2 = require('./charroms/apple2char').charset;

var TYPES = {
    apple2: {
        charset: charset2,
        ROM: Apple2ROM
    },
    apple2plus: {
        charset: charset2,
        ROM: Apple2plusROM
    },
    apple2e: {
        charset: charset2e,
        e: true,
        ROM: Apple2eROM
    },
    apple2enh: {
        charset: charset2enh,
        e: true,
        c: true,
        ROM: Apple2enhROM
    }
};

window.debugLib = debugLib;

var screen = document.querySelector('#screen');

var type = Util.gup(window.location, 'type') || 'apple2enh';
var options = extend({}, TYPES[type]);

options.rom = new options.ROM();
options.screen = screen;

var apple2 = new AppleII(options);

var cpu = window.cpu = apple2.getCPU();

var io = apple2.getIO();
var ramfactor = new RamFactor(1024 * 1024);
var mouse = new Mouse(cpu);
var smartport = new SmartPort(cpu);
var disk2 = new DiskII();
var thunderclock = new Thunderclock();

var videx = null;
if (!options.e) {
    videx = new Videoterm(screen.getContext('2d'));
}

var dbg = apple2.getDebugger();

io.setSlot(2, ramfactor);
if (videx) { io.setSlot(3, videx); }
io.setSlot(4, mouse);
io.setSlot(5, smartport);
io.setSlot(6, disk2);
io.setSlot(7, thunderclock);

// Gamepad Input
uiGamepad.initGamepad(io);

// Joystick Input
uiJoystick.initJoystick(io, mouse, screen);

// Audio Output
new Audio(io);

// Keyboard Input
var keyboard = new KeyBoard(cpu, io, type.e);
keyboard.create(document.querySelector('#keyboard'));

apple2.run();

function loadMetaData(url, drive) {
    var label = document.querySelector('#disklabel' + drive);
    var req = new XMLHttpRequest();
    req.open('GET', url, true);

    req.onload = function(progressEvent) {
        var json;
        if (progressEvent.target.status === 202) {
            try {
                json = JSON.parse(req.responseText);
                if (json.name) {
                    label.innerHTML = json.name;
                }
                if (json.gamepad) {
                    uiGamepad.updateGamepadMap(json.gamepad);
                }
            } catch (e) {
                debug('Bad metadata file found', url);
            }
        }
    };

    req.onerror = function() {
        debug('No metadata file found', url);
    };

    req.send();
}

function loadHTTP(url, drive) {
    var parts = url.split(/[\/\.]/);
    var name = decodeURIComponent(parts[parts.length - 2]);
    var ext = parts[parts.length - 1].toLowerCase();
    var label = document.querySelector('#disklabel' + drive);

    debug('Loading', url, 'into drive', drive);
    var req = new XMLHttpRequest();
    req.open('GET', url, true);

    if (ext == 'json') {
        req.onload = function() {
            var json;
            try {
                json = JSON.parse(req.responseText);
                if (json.blocks) {
                    if (smartport.setDisk(drive, json)) {
                        label.innerHTML = json.name;
                        uiGamepad.updateGamepadMap(json.gamepad);
                    }
                } else {
                    if (disk2.setDisk(drive, json)) {
                        label.innerHTML = json.name;
                        uiGamepad.updateGamepadMap(json.gamepad);
                    }
                }
            } catch (e) {
                alert('Sorry, couldn\'t read "' + url + '"');
            }
        };
    } else {
        req.responseType = 'arraybuffer';

        req.onload = function() {
            if (req.response.byteLength >= 400 * 1024) { // 400K and up uses smartport
                if (smartport.setBinary(drive, req.response)) {
                    label.innerHTML = name;
                    uiGamepad.updateGamepadMap();
                }
            } else {
                if (disk2.setBinary(drive, name, ext, req.response)) {
                    label.innerHTML = name;
                    uiGamepad.updateGamepadMap();
                }
            }
        };

        var metaUrl = url.replace(/\.\w+$/, '.json');
        loadMetaData(metaUrl);
    }

    req.onerror = function() {
        alert('Sorry, couldn\'t load "' + url + '"');
    };

    req.send();
}

function reset() {
    cpu.reset();
}

disk2.addDriveLightListener(function(drive, on) {
    var disk = document.getElementById('disk' + drive);
    disk.style.backgroundImage = on ? 'url(img/red-on-16.png)' : 'url(img/red-off-16.png)';
});

window.main = {
    loadHTTP: loadHTTP,
    reset: reset,
    dbg: dbg
};
