/*jshint browser: true */
//var ROM = require('./roms/apple2');
var ROM = require('./roms/apple2enh');
var AppleII = require('./apple2');
var audio = require('./ui/audio');
var gamepad = require('./ui/gamepad');
var KeyBoard = require('./ui/keyboard');

var main = new AppleII({
    e: true,
    screenCanvas: document.querySelector('#screen'),
    rom: new ROM()
});

var io = main.getIO();

// Gamepad Input
gamepad.initGamepad(io);

// Audio Output
audio.initAudio(io);

// Keyboard Input
var keyboard = new KeyBoard(io);
keyboard.create(document.querySelector('#keyboard'));

module.exports = main;
