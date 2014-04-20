var Queue = function() {
  this.queue = [];
  this.running = false;
};

//takes n arguments to be pushed into the queue
Queue.prototype.push = function() {
  this.queue.push.apply(this.queue,arguments);
  if(this.running === false) {
    this.run();
  }
};

Queue.prototype.run = function() {
  if(this.queue.length > 0) {
    this.running = true;
  }
};
