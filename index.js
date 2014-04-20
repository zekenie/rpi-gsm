var serialPort = require("serialport").SerialPort,
    colors = require('colors'),
    prompt = require('prompt'),
    sp = null,
    cmdStack = [];

var spSetup = function(path) {
  sp = new serialPort(path);
  sp.on('open',function(err) {
    if(err) return console.log('error connecting to '.red + path.red);
    console.log('connected to '.green + path.green);
  });
  sp.on('error',function(err) { console.log(err.red.bold); });
  sp.on('close',function() { console.log("connection to serial port closed".orange); });
  sp.on('data',function(data) {
    data = data.toString();
    console.log('-->' + data);
  });
  //atPrompt();
};

var setup = function() {};

var atPrompt = function() {
  prompt.get({
    name:'command',
    type:'string',
    required:true
  },function(err,result) {
    if(err) return console.log(err);
    sp.write(result.command+"\r",function(err,result) {
      atPrompt();
    });
  });
};

prompt.start();

prompt.get({
  name:'path',
  type:'string',
  default:'/dev/ttyUSB3',
  required:true
},function(err,result) {
  if(err) return console.log(err);
  spSetup(result.path);
});
