
var debug = require('debug')('apple2js:debugger');
var SYMBOLS = require('./symbols');

function Debugger(cpu) {
    var breakpoints = {};
    var skidmarks = [];
    var maxSkidmarks = 256;
    var tracing = false;
    var breakpoint = null;

    function debugCallback() {
        var state = cpu.getState();
        if (state.pc in breakpoints) {
            debug('Break!');
            breakpoint = state.pc;
            return true;
        }

        var line = [
            cpu.dumpRegisters(),
            cpu.dumpPC(undefined, SYMBOLS).substr(4)
        ].join(' ');

        if (tracing) {
            debug(line);
        } else {
            skidmarks.push(line);
            if (skidmarks.length > maxSkidmarks) {
                skidmarks.shift();
            }
        }
        return false;
    }

    return {
        breakpoint: breakpoint,

        callback: null,

        debugging: function(enable) {
            if (enable) {
                this.callback = debugCallback;
            } else {
                this.callback = null;
            }
        },

        getSkidmarks: function() {
            return skidmarks;
        },

        setMaxSkidmarks: function(max) {
            maxSkidmarks = max;
        },

        tracing: function(enable) {
            tracing = enable;
        }
    };
}

module.exports = Debugger;
