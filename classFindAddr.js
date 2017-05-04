const oledChip = require('./oled-chip.js');
const finder = oledChip.Finder({bus: 2});

finder.find();