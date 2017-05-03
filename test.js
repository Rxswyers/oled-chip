const OLED = require('oled-ssd1306-i2c');
const font = require('oled-font-5x7');

const opts = 
{
  width: 128,
  height: 64,
  address: 0x3C,
  device: devPath
}

const screen = new OLED(opts);

screen.setCursor(1,1);
screen.writeString(font, 1, 'Testing from a CHIP, yey. :)');
