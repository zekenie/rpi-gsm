var Queue = require('./commandQueue');

var queue = new Queue();

var getPhoneNum = function(cb) {
  queue.push('AT+CPBS="ON"','AT+CPBR=1').then(function(msg) {
    console.log(msg);
  });
};

var setup = function() {
  queue.push('AT+CMGF=1');
};

var sms = function(to,msg) {
  queue.push(
      'AT+CMGS="' + to + '"',
      msg + '\u001A'
  );
};

getPhoneNum();

/*var i = 0;
setup();
setInterval(function() {
  sms("+15102955523","this is message " + i);
  i++;
},2000);*/
