var gamepad = require('./gamepad');
var debug = require('debug')('apple2js:ui:joystick');

var disabled = false;

module.exports = {
    initJoystick: function(io, element) {
        function mousemove(event) {
            var rect = element.getBoundingClientRect();
            if (gamepad.gamepadActive() || disabled) {
                return;
            }

            debug('mousemove', event.clientX, event.clientY, rect);

            var x = (event.clientX - rect.left) / rect.width,
                y = (event.clientY - rect.top) / rect.height;

            io.paddle(0, x);
            io.paddle(1, y);
        }

        function mousedown(event) {
            if (!gamepad.gamepadActive() && !disabled) {
                io.buttonDown(event.which == 1 ? 0 : 1);
            }
            event.preventDefault();
        }

        function mouseup(event) {
            if (!gamepad.gamepadActive() && !disabled) {
                io.buttonUp(event.which == 1 ? 0 : 1);
            }
            event.preventDefault();
        }

        element.addEventListener('mousemove', mousemove);
        element.addEventListener('mousedown', mousedown);
        element.addEventListener('mouseup', mouseup);
    },

    disableMouseJoystick: function disableMouseJoystick(on) {
        disabled = on;
    }
};
