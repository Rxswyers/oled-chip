const oledChip = require('./oled-chip.js');
const oc = new oledChip.OC({
  width: 128,
  height: 64,
  address: 0x3d
}, {bus: 2});

oc.on('ready', () =>
{
  oc.clear();
  oc.write(1, 'OLED class on CHIP?');
});