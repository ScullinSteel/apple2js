var CPU6502 = require('cpu6502');
var RAM = require('./ram');
var charset2e = require('./charroms/apple2echar').charset;
var charset2 = require('./charroms/apple2char').charset;
var canvas2 = require('./canvas2');
var canvas2e = require('./canvas2e');
var Apple2IO = require('./apple2io');
// var LanguageCard = require('./langcard');
var MMU = require('./mmu');
var Apple2enhROM = require('./roms/apple2enh');
var Apple2eROM = require('./roms/apple2e');
var Apple2ROM = require('./roms/apple2');
var Apple2plusROM = require('./roms/apple2plus');
var Debugger = require('./debugger');

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
    var cpuDebugger;
    var mmu;

    function run() {
        if (runTimer) {
            clearInterval(runTimer);
        }

        var ival = 30;
        var stepMax = kHz * ival * 1.25;

        var now, last = Date.now();
        var runFn = function() {
            now = Date.now();

            var step = (now - last) * kHz;
            last = now;
            if (step > stepMax) {
                step = stepMax;
            }

            if (cpuDebugger.callback) {
                cpu.stepCyclesDebug(step, cpuDebugger.callback);
            } else {
                cpu.stepCycles(step);
            }
            vm.blit();
            io.tick();

            if (cpuDebugger.breakpoint) {
                if (runTimer) {
                    clearInterval(runTimer);
                }
                return;
            }

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

    var cpu = new CPU6502({'65C02': options.type == 'apple2enh'});

    var canvas;
    var charset;
    if (options.type == 'apple2enh' || options.type == 'apple2e') {
        charset = charset2e;
        canvas = canvas2e;
    } else {
        charset = charset2;
        canvas = canvas2;
    }

    var LoresPage = canvas.LoresPage;
    var HiresPage = canvas.HiresPage;
    var VideoModes = canvas.VideoModes;

    var lores1 = new LoresPage(1, charset);
    var lores2 = new LoresPage(2, charset);
    var hires1 = new HiresPage(1);
    var hires2 = new HiresPage(2);

    var vm = new VideoModes(lores1, hires1, lores2, hires2);
    var io = new Apple2IO(cpu, vm);

    var rom;

    if (options.type == 'apple2enh' || options.type == 'apple2e') {
        if (options.type == 'apple2enh') {
            rom = new Apple2enhROM();
        } else {
            rom = new Apple2eROM();
        }
        mmu = new MMU(cpu, vm, lores1, lores2, hires1, hires2, io, rom);

        cpu.addPageHandler(mmu);
    } else {
        if (options.type == 'apple2plus') {
            rom = new Apple2plusROM();
        } else {
            rom = new Apple2ROM();
        }
        var ram1 = new RAM(0x00, 0x04);
        var ram2 = new RAM(0x0C, 0x1F);
        var ram3 = new RAM(0x60, 0xBF);
        //var lc = new LanguageCard(io, rom);

        cpu.addPageHandler(ram1);
        cpu.addPageHandler(lores1);
        cpu.addPageHandler(lores2);
        cpu.addPageHandler(ram2);
        cpu.addPageHandler(hires1);
        cpu.addPageHandler(hires2);
        cpu.addPageHandler(ram3);
        cpu.addPageHandler(io);
        cpu.addPageHandler(rom);
    }

    var screen = options.screenCanvas;
    var context = screen.getContext('2d');

    vm.setContext(context);

    cpuDebugger = new Debugger(cpu);

    if (options.type != 'apple2') {
        cpu.reset();
    }

    return {
        run: function() {
            run();
        },

        getCPU: function () {
            return cpu;
        },

        getIO: function getIO() {
            return io;
        },

        getDebugger: function getDebugger() {
            return cpuDebugger;
        }
    };
}

module.exports = AppleII;
