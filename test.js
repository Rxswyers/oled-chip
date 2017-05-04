const OLED = require('oled-ssd1306-i2c');
const font = require('oled-font-5x7');
const gpio = require('chip-gpio').Gpio;

const screen = new OLED({
  width: 128,
  height: 64,
  address: 0x3d,
  device: '/dev/i2c-2'
});

let reset = new gpio(2, 'low');
reset = new gpio(2, 'high');

screen.update();
screen.setCursor(1,1);
screen.writeString(font, 1, 'Testing from a CHIP, yey. :)', 1, true, 2);
