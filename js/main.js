/*jshint browser: true */
// var ROM = require('./roms/apple2plus.js');
var ROM = require('./roms/apple2enh.js');
var AppleII = require('./apple2.js');
var audio = require('./ui/audio.js');
var gamepad = require('./ui/gamepad.js');
var KeyBoard = require('./ui/keyboard.js');

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
