var CPU6502 = require('cpu6502');
var RAM = require('./ram');
var canvas2 = require('./canvas2');
var canvas2e = require('./canvas2e');
var Apple2IO = require('./apple2io');

var LanguageCard = require('./cards/langcard');
var MMU = require('./mmu');
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

    function run() {
        if (runTimer) {
            clearInterval(runTimer);
        }

        var slot3 = io.getSlot(3);
        var auxVideo = (slot3 && slot3.blit) ? slot3 : null;

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

            var an0 = io.annunciator(0);
            if (auxVideo && an0) {
                auxVideo.blit();
            } else {
                vm.blit();
            }
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

    var context = options.screen.getContext('2d');

    var cpu = new CPU6502({'65C02': options.c});

    var canvas;
    if (options.e) {
        canvas = canvas2e;
    } else {
        canvas = canvas2;
    }

    var LoresPage = canvas.LoresPage;
    var HiresPage = canvas.HiresPage;
    var VideoModes = canvas.VideoModes;

    var lores1 = new LoresPage(1, options.charset, context);
    var lores2 = new LoresPage(2, options.charset, context);
    var hires1 = new HiresPage(1, context);
    var hires2 = new HiresPage(2, context);

    var vm = new VideoModes(lores1, hires1, lores2, hires2);
    var io = new Apple2IO(cpu, vm);

    if (options.e) {
        var mmu = new MMU(cpu, vm, lores1, lores2, hires1, hires2, io, options.rom);

        cpu.addPageHandler(mmu);
    } else {
        var ram1 = new RAM(0x00, 0x04);
        var ram2 = new RAM(0x0C, 0x1F);
        var ram3 = new RAM(0x60, 0xBF);
        var langcard = new LanguageCard(options.rom);

        cpu.addPageHandler(ram1);
        cpu.addPageHandler(lores1);
        cpu.addPageHandler(lores2);
        cpu.addPageHandler(ram2);
        cpu.addPageHandler(hires1);
        cpu.addPageHandler(hires2);
        cpu.addPageHandler(ram3);
        cpu.addPageHandler(io);
        cpu.addPageHandler(langcard);

        io.setSlot(0, langcard);
    }

    cpuDebugger = new Debugger(cpu);

    cpu.reset();

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
