var CPU6502 = require('cpu6502');
var RAM = require('./ram');
var charset = require('./charroms/apple2echar').charset;
var canvas2 = require('./canvas2');
var canvas2e = require('./canvas2e');
var Apple2IO = require('./apple2io');
var SmartPort = require('./smartport');
var DiskII = require('./disk2');
var LanguageCard = require('./langcard');
var RamFactor = require('./ramfactor');
var MMU = require('./mmu');
var Thunderclock = require('./thunderclock');
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
    var canvas = options.e ? canvas2e : canvas2;
    var LoresPage = canvas.LoresPage;
    var HiresPage = canvas.HiresPage;
    var VideoModes = canvas.VideoModes;

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

            cpu.stepCycles(step, cpuDebugger.callback);
            vm.blit();
            io.sampleTick();

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

    var cpu = new CPU6502({'65C02': true});

    var lores1 = new LoresPage(1, charset);
    var lores2 = new LoresPage(2, charset);
    var hires1 = new HiresPage(1);
    var hires2 = new HiresPage(2);

    var vm = new VideoModes(lores1, hires1, lores2, hires2);
    var io = new Apple2IO(cpu, vm);

    var smartport = new SmartPort(cpu, 5);
    var disk2 = new DiskII(io, 6);
    var thunderclock = new Thunderclock(io, 7);

    var mmu;

    if (options.e) {
        mmu = new MMU(cpu, vm, lores1, lores2, hires1, hires2, io, options.rom);

        cpu.addPageHandler(mmu);
    } else {
        var ram1 = new RAM(0x00, 0x04);
        var ram2 = new RAM(0x0C, 0x1F);
        var ram3 = new RAM(0x60, 0xBF);
        var lc = new LanguageCard(io, 0, options.rom);

        cpu.addPageHandler(ram1);
        cpu.addPageHandler(lores1);
        cpu.addPageHandler(lores2);
        cpu.addPageHandler(ram2);
        cpu.addPageHandler(hires1);
        cpu.addPageHandler(hires2);
        cpu.addPageHandler(ram3);
        cpu.addPageHandler(io);
        cpu.addPageHandler(lc);
    }

    io.setSlot(6, disk2);
    io.setSlot(7, thunderclock);

    var screen = options.screenCanvas;
    var context = screen.getContext('2d');

    vm.setContext(context);

    cpuDebugger = new Debugger(cpu);
    cpu.reset();
    run();

    return {
        run: function() {
        },

        getCPU: function () {
            return cpu;
        },

        getDiskII: function getDiskII() {
            return disk2;
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
