
var debug = require('debug')('apple2js:debugger');

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
        var line = cpu.dumpRegisters() + ' ' + cpu.dumpPC().substr(4);
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

        setMaxSkidmarks: function(max) {
            maxSkidmarks = max;
        },

        tracing: function(enable) {
            tracing = enable;
        }
    };
}

module.exports = Debugger;
