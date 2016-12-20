var debugLib = require('debug');
var debug = debugLib('apple2js:main');
//var ROM = require('./roms/apple2');
var ROM = require('./roms/apple2enh');
var AppleII = require('./apple2');
var audio = require('./ui/audio');
var gamepad = require('./ui/gamepad');
var joystick = require('./ui/joystick');
var KeyBoard = require('./ui/keyboard');

window.debugLib = debugLib;

var screen = document.querySelector('#screen');

var apple2 = new AppleII({
    e: true,
    screenCanvas: screen,
    rom: new ROM()
});

var cpu = window.cpu = apple2.getCPU();

var io = apple2.getIO();
var disk2 = apple2.getDiskII();
var smartport = apple2.getSmartPort();
var dbg = apple2.getDebugger();

// Gamepad Input
gamepad.initGamepad(io);

// Joystick Input
joystick.initJoystick(io, screen);

// Audio Output
audio.initAudio(io);

// Keyboard Input
var keyboard = new KeyBoard(io);
keyboard.create(document.querySelector('#keyboard'));

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
                gamepad.updateGamepadMap(json.gamepad);
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
                        gamepad.updateGamepadMap(json.gamepad);
                    }
                } else {
                    if (disk2.setDisk(drive, json)) {
                        label.innerHTML = json.name;
                        gamepad.updateGamepadMap(json.gamepad);
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
                    gamepad.updateGamepadMap();
                }
            } else {
                if (disk2.setBinary(drive, name, ext, req.response)) {
                    label.innerHTML = name;
                    gamepad.updateGamepadMap();
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
