/*jshint node:true, browser: true */

// var Util = require('./util.js');
var CPU6502 = require('./cpu6502.js');
var RAM = require('./ram.js');
var canvas2 = require('./canvas2.js');
var canvas2e = require('./canvas2e.js');
var Apple2IO = require('./apple2io.js');
var Slot3 = require('./slot3.js');
var DiskII = require('./disk2.js');
var LanguageCard = require('./langcard.js');
var MMU = require('./mmu.js');

var kHz = 1023;
var runTimer;
var _requestAnimationFrame;

if (typeof window !== 'undefined') {
    _requestAnimationFrame = 
        window.requestAnimationFrame || 
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame;
}

function AppleII(options) {
    var canvas = options.e ? canvas2e : canvas2;
    var LoresPage = canvas.LoresPage;
    var HiresPage = canvas.HiresPage;
    var VideoModes = canvas.VideoModes;

    function run() {
        if (runTimer) {
            clearInterval(runTimer);
        }
        
        var ival = 30;
        
        var now, last = Date.now();
        var runFn = function() { 
            now = Date.now();

            var step = (now - last) * kHz, stepMax = kHz * ival;
            last = now;
            if (step > stepMax) {
                step = stepMax;
            }
            
            cpu.stepCycles(step);
            vm.blit();
            io.sampleTick();
            
            if (_requestAnimationFrame) {
                _requestAnimationFrame(runFn);
            }
        };
        if (_requestAnimationFrame) {
            _requestAnimationFrame(runFn);
        } else {
            runTimer = setInterval(runFn, ival);
        }
    }

    var cpu = new CPU6502();

    var lores1 = new LoresPage(1);
    var lores2 = new LoresPage(2);
    var hires1 = new HiresPage(1);
    var hires2 = new HiresPage(2);
    
    var vm = new VideoModes(lores1, hires1, lores2, hires2);
    var io = new Apple2IO(cpu, vm);

    var disk2 = new DiskII(io, 6);

    var lc;
    var mmu;
    
    if (options.e) {
        mmu = new MMU(cpu, vm, lores1, lores2, hires1, hires2, io, options.rom);
    } else {
        lc = new LanguageCard(io, options.rom);
    }

    if (!options.e) {
        var ram1 = new RAM(0x00, 0x04);
        var ram2 = new RAM(0x0C, 0x1F);
        var ram3 = new RAM(0x60, 0xBF);
        
        cpu.addPageHandler(ram1);
        cpu.addPageHandler(lores1);
        cpu.addPageHandler(lores2);
        cpu.addPageHandler(ram2);
        cpu.addPageHandler(hires1);
        cpu.addPageHandler(hires2);
        cpu.addPageHandler(ram3);
        cpu.addPageHandler(io);
    }

    if (options.e) {
        var slot3 = new Slot3(mmu, options.rom);
        mmu.addSlot(3, slot3);
        mmu.addSlot(6, disk2);

        cpu.addPageHandler(mmu);
    } else {
        cpu.addPageHandler(lc);
        cpu.addPageHandler(disk2);
    }

    var screen = options.screenCanvas;
    var context = screen.getContext('2d');

    vm.setContext(context);

    cpu.reset();
    run();

    return {
        run: function() {
        },

        reset: function() {
            cpu.reset();
        },

        getDiskII: function getDiskII() {
            return disk2;
        },

        getIO: function getIO() {
            return io;
        }
    };
}

module.exports = AppleII;
