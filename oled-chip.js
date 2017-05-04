const five = require('johnny-five');
const Chip = require('chip-io');
const OLED = require('oled-js');
const font = require('oled-font-5x7');
const EventEmitter = require('events').EventEmitter;

/**
 * @class
 */
class OC extends EventEmitter
{
  /**
   * Constructor for the OLED-CHIP (OC) class.
   * @param {Object} oledOpts - Object to hold the settings for the OLED.
   * @param {Integer} oledOpts.width - Width of the OLED in pixels, decimal number.
   * @param {Integer} oledOpts.height - Height of the OLED in pixels, decimal number.
   * @param {Integer} oledOpts.address - Address of the OLED, hex number.
   * @param {Object} opts - Object to hold the settings for the OLED-CHIP (OC) class.
   * @param {Integer} opts.bus - The bus number that your OLED screen is connected to.
   */
  constructor(oledOpts, opts)
  {
    super();
    this.font = require('oled-font-5x7');
    this.oledOpts = oledOpts;
    this.opts = opts;
    this.lines = {
      1: 0,
      2: 9,
      3: 18,
      4: 27,
      5: 36,
      6: 45,
      7: 54
    };
    this.init.bind(this);
    this.init();
  }
  init()
  {
    let io = new Chip();
    let that = this;
    let oledOpts = that.oledOpts;
    let opts = that.opts;

    io.i2cConfig({
      address: oledOpts.address,
      bus: opts.bus
    });
    this.board = new five.Board({
      io: io,
      repl: false,
      debug: false
    });
    that.board.on('ready', () =>
    {
      that.screen = new OLED(that.board, five, oledOpts);
      that.emit('ready');
    });
  }
  write(line, str)
  {
    let screen = this.screen;
    let font = this.font;
    let lines = this.lines;

    screen.setCursor(1,lines[line]);
    screen.writeString(font, 1, str, 1, true, 2);
  }
}

const i2c = require('i2c');

/**
 * @class
 */
class Finder
{
  /**
   * Constructor for the Finder class.
   * @param {Object} opts - Object to hold the options for the Finder class.
   * @param {Object} opts.bus - Bus number to look for i2c devices on. (From what I've seen, should be 0-2)
   */
  constructor(opts)
  {
    this.wire = new i2c(0x3c, {device: `/dev/i2c-${opts.bus.toString()}`});
  }
  /**
   * Scans for i2c devices on the bus that was passed in opts of the constructor
   * @function
   */
  find()
  {
    let wire = this.wire;
    wire.scan((err, data) =>
    {
      if(err) throw err;
      console.log(data);
    });
  }

}

module.exports = 
{
  OC: OC,
  Finder: Finder
};
