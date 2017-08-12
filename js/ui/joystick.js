var gamepad = require('./gamepad');
var debug = require('debug')('apple2js:ui:joystick');

var disabled = false;

module.exports = {
    initJoystick: function(io, mouse, element) {
        function mousemove(event) {
            var rect = element.getBoundingClientRect();
            if (gamepad.gamepadActive() || disabled) {
                return;
            }

            debug('mousemove', event.clientX, event.clientY, rect);

            var x = (event.clientX - rect.left) / rect.width;
            var y = (event.clientY - rect.top) / rect.height;

            if (mouse.enabled()) {
                var clamp = mouse.getClamps();

                x = parseInt(clamp.minX + (clamp.maxX - clamp.minX) * x, 10);
                y = parseInt(clamp.minY + (clamp.maxY - clamp.minY) * y, 10);

                mouse.mouseXY(x, y);

                element.classList.add('mouse');
            } else {
                io.paddle(0, x);
                io.paddle(1, y);

                element.classList.remove('mouse');
            }
        }

        function mousedown(event) {
            if (mouse.enabled()) {
                mouse.buttonDown(event.which == 1 ? 0 : 1);
            } else {
                if (!gamepad.gamepadActive() && !disabled) {
                    io.buttonDown(event.which == 1 ? 0 : 1);
                }
            }
            event.preventDefault();
        }

        function mouseup(event) {
            if (mouse.enabled()) {
                mouse.buttonUp(event.which == 1 ? 0 : 1);
            } else {
                if (!gamepad.gamepadActive() && !disabled) {
                    io.buttonUp(event.which == 1 ? 0 : 1);
                }
            }
            event.preventDefault();
        }

        element.addEventListener('mousemove', mousemove);
        element.addEventListener('mousedown', mousedown);
        element.addEventListener('mouseup', mouseup);

        io.addTickListener(function() {
            if (mouse.enabled()) {
                mouse.startVB();
            }
        });
    },

    disableMouseJoystick: function disableMouseJoystick(on) {
        disabled = on;
    }
};
