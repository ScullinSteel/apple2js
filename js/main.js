/*jshint browser: true */
// var ROM = require('./roms/apple2plus.js');
var ROM = require('./roms/apple2e.js');
var AppleII = require('./apple2.js');
var mapKeyEvent = require('./keyboard2.js').mapKeyEvent;

var main = new AppleII({
    e: true,
    screenCanvas: document.querySelector('#screen'),
    rom: new ROM()
});

window.onkeydown = function(evt) {
    var mapped = mapKeyEvent(evt);
    if (mapped != 0xff) {
        main.getIO().keyDown(mapped);
    }
};


module.exports = main;
