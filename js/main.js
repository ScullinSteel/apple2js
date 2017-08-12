var debugLib = require('debug');
var debug = debugLib('apple2js:main');

var AppleII = require('./apple2');
var uiAudio = require('./ui/audio');
var uiGamepad = require('./ui/gamepad');
var uiJoystick = require('./ui/joystick');
var KeyBoard = require('./ui/keyboard');

var DiskII = require('./cards/disk2');
var Mouse = require('./cards/mouse');
var RamFactor = require('./cards/ramfactor');
var SmartPort = require('./cards/smartport');
var Thunderclock = require('./cards/thunderclock');

window.debugLib = debugLib;

var screen = document.querySelector('#screen');

var apple2 = new AppleII({
    type: 'apple2enh',
    screenCanvas: screen
});

var cpu = window.cpu = apple2.getCPU();

var io = apple2.getIO();
var ramfactor = new RamFactor(1024 * 1024);
var mouse = new Mouse(cpu);
var smartport = new SmartPort(cpu);
var disk2 = new DiskII();
var thunderclock = new Thunderclock();
var dbg = apple2.getDebugger();

io.setSlot(2, ramfactor);
io.setSlot(4, mouse);
io.setSlot(5, smartport);
io.setSlot(6, disk2);
io.setSlot(7, thunderclock);

// Gamepad Input
uiGamepad.initGamepad(io);

// Joystick Input
uiJoystick.initJoystick(io, mouse, screen);

// Audio Output
uiAudio.initAudio(io);

// Keyboard Input
var keyboard = new KeyBoard(io);
keyboard.create(document.querySelector('#keyboard'));

apple2.run();

function loadMetaData(url, drive) {
    var label = document.querySelector('#disklabel' + drive);
    var req = new XMLHttpRequest();
    req.open('GET', url, true);

    req.onload = function() {
        var json;
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

    debug('Loading' + url + 'into drive' + drive);
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
