var SerialPort = require('serialport').SerialPort,
    colors = require('colors');

var Queue = function(bus) {
  this.queue = [];
  this.running = false;
  this.open = false;
  this.sp = new SerialPort(bus || '/dev/ttyUSB3');
  this.addEventListeners();
};

//takes n arguments to be pushed into the queue
Queue.prototype.push = function() {
  this.queue.push.apply(this.queue,arguments);
  if(!this.running && this.open) {
    this.run();
  }
};

Queue.prototype.run = function() {
  if(this.queue.length > 0) {
    this.running = true;
    var cmd = this.queue.shift();
    this.sp.write(cmd,function(err,result) {
      if(err) console.log('err on write'.red);
      console.log('sent ' + cmd);
    });
  } else {
    this.running = false;
  }
};

Queue.prototype.addEventListeners = function() {
  var self = this;
  this.sp.on('error',function(err) {
    console.log('error on serial port'.red.bold);
    console.log(err);
  });
  this.sp.on('data',function(data) {
    data = data.toString();
    console.log('\n\t--> ' + data.green);
    self.run();
  });
  this.sp.on('open',function() {
    self.open = true;
    self.run();
  });
};

var queue = new Queue();
queue.push(
    "AT+CMGL=\"REC UNREAD\"\r"
//  "at+cmgf=1\r",
//  "at+cmgs=\"+5102955523\"\r",
//  "this is the test of a text" + '\u001A' + "\r"
);
