var SerialPort = require('serialport').SerialPort,
    winston = require('winston');


var Queue = function(bus) {
  this.queue = [];
  this.running = false;
  this.open = false;
  this.bus = bus || '/dev/ttyUSB3';
  this.sp = new SerialPort(this.bus);
  this.addEventListeners();
  this.logger = new (winston.Logger)({
    transports:[
      new (winston.transports.File)({ filename: './log/' + this.bus.split('/').join('-') + '.log' } )
    ]
  });
};

['log','warn','info','error'].forEach(function(logMethod) {
  Queue.prototype[logMethod] = function() {
    return this.logger[logMethod].apply(this.logger,arguments);
  }
});

//takes n arguments to be pushed into the queue
Queue.prototype.push = function() {
  //remove carrage returns and append one at 
  for(var i = 0, ii = arguments.length; i < ii; i++) {
    arguments[i] = arguments[i].replace("\r",'') + "\r";
  }
  this.queue.push.apply(this.queue,arguments);
  if(!this.running && this.open) {
    this.run();
  }
  return this.queue.length;
};

Queue.prototype.run = function() {
  if(this.queue.length > 0) {
    var self = this;
    this.running = true;
    var cmd = this.queue.shift();
    this.sp.write(cmd,function(err,result) {
      if(err) self.error('err on write');
      self.log('sent ' + cmd);
    });
  } else {
    this.running = false;
  }
};

Queue.prototype.addEventListeners = function() {
  var self = this;
  this.sp.on('error',function(err) {
    self.error('err on serial port',err);
  });
  this.sp.on('data',function(data) {
    data = data.toString();
    self.info('serial data',data);
    self.run();
  });
  this.sp.on('open',function() {
    self.open = true;
    self.run();
  });
};

module.exports = Queue;
/*
var queue = new Queue();
queue.push(
  "AT+CMGL=\"REC UNREAD\"\r"
  "at+cmgf=1\r",
  "at+cmgs=\"+15102955523\"\r",
  "this is the test of a text" + '\u001A' + "\r"
);*/
