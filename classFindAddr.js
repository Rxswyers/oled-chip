const oledChip = require('./oled-chip.js');
const finder = new oledChip.Finder({bus: 2});

finder.find();