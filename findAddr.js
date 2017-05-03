var i2c = require('i2c');
var address = 0x3C;
var wire = new i2c(address, {device: '/dev/i2c-1'}); 
 
wire.scan(function(err, data)
{
  if(err) throw err;
  console.log(data); 
});