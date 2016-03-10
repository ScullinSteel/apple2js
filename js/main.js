var debugLib = require('debug');
var debug = debugLib('apple2js:main');
//var ROM = require('./roms/apple2');
var ROM = require('./roms/apple2enh');
var AppleII = require('./apple2');
var audio = require('./ui/audio');
var gamepad = require('./ui/gamepad');
var KeyBoard = require('./ui/keyboard');

window.debugLib = debugLib;

var main = new AppleII({
    e: true,
    screenCanvas: document.querySelector('#screen'),
    rom: new ROM()
});

var io = main.getIO();
var disk2 = main.getDiskII();

// Gamepad Input
gamepad.initGamepad(io);

// Audio Output
audio.initAudio(io);

// Keyboard Input
var keyboard = new KeyBoard(io);
keyboard.create(document.querySelector('#keyboard'));

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
                if (disk2.setDisk(drive, json)) {
                    label.innerHTML = json.name;
                }
            } catch (e) {
                alert('Sorry, couldn\'t read "' + url + '"');
            }
        };
    } else {
        req.responseType = 'arraybuffer';

        req.onload = function() {
            if (disk2.setBinary(drive, name, ext, req.response)) {
                label.innerHTML = name;
            }
        };
    }
    req.onerror = function() {
        alert('Sorry, couldn\'t load "' + url + '"');
    };
    req.send();
}

function reset() {
    main.getCPU().reset();
}

disk2.addDriveLightListener(function(drive, on) {
    var disk = document.getElementById('disk' + drive);
    disk.style.backgroundImage = on ? 'url(img/red-on-16.png)' : 'url(img/red-off-16.png)';
});

module.exports = {
    loadHTTP: loadHTTP,
    reset: reset 
};
