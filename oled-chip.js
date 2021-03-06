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
    this.dim = false;
    this.invert = false;
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
      that.screen.update();
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
  clear()
  {
    let screen = this.screen;
    screen.clearDisplay();
  }
  toggleDim()
  {
    let dim = this.dim;
    let screen = this.screen;
    if(dim)
    {
      this.dim = false;
      screen.dimDisplay(false);
    }
    else
    {
      this.dim = true;
      screen.dimDisplay(true);
    }
  }
  toggleInvert()
  {
    let invert = this.invert;
    let screen = this.screen;
    if(invert)
    {
      this.invert = false
      screen.invertDisplay(false);
    }
    else
    {
      this.invert = true;
      screen.invertDisplay(true);
    }
  }
  turnOff()
  {
    this.screen.turnOffDisplay();
  }
  turnOn()
  {
    this.screen.turnOnDisplay();
  }
  /**
   * @param {Array} p - Multi-dimensional array with one or more sets of pixels. [x,y,color]
   */
  drawPixel(p)
  {
    this.screen.drawPixel(p);
  }
  /**
   * @param {Object} points - Points to start and end the line.
   * @param {Integer} points.x1 - Starting x coord.
   * @param {Integer} points.y1 - Starting y coord.
   * @param {Integer} points.x2 - Finishing x coord.
   * @param {Integer} points.y2 - Finishing y coord.
   * @param {Integer} points.color - Color of the line, 1 for white, 0 for black.
   */
  line(points)
  {
    let screen = this.screen;
    screen.drawLine(points.x1, points.y1, points.x2, points.y2, points.color);
  }
  /**
   * @param {Object} rect - Object to hold top left point and bottom right point, color is optional.
   * @param {Integer} rect.x1 - X coord for top left corner point.
   * @param {Integer} rect.y1 - Y coord for top left corner point.
   * @param {Integer} rect.x2 - X coord for bottom right corner point.
   * @param {Integer} rect.y2 - Y coord for bottom right corner point.
   * @param {Integer} rect.color - Color of the fill, 1 for white, 0 for black.
   */
  fillRect(rect)
  {
    let screen = this.screen;
    screen.fillRect(rect.x1, rect.y1, rect.x2, rect.y2, rect.color);
  }
  /**
   * @param {Object} rect - Object to hold top left point and bottom right point, color is optional.
   * @param {Integer} rect.x1 - X coord for top left corner point.
   * @param {Integer} rect.y1 - Y coord for top left corner point.
   * @param {Integer} rect.x2 - X coord for bottom right corner point.
   * @param {Integer} rect.y2 - Y coord for bottom right corner point.
   * @param {Integer} rect.color - Color of the line, 1 for white, 0 for black.
   */
  drawRect(rect)
  {
    let screen = this.screen;
    screen.drawRect(rect.x1, rect.y1, rect.x2, rect.y2, rect.color);
  }
  update()
  {
    this.screen.update();
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
