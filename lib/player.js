var omxcontrol = require('omxcontrol')
  , cp = require('child_process')
  , config = require('./config')
  ;

function Player () {
  var self = this;

  this.currentlyPlaying = null;
  this.currentDuration = null;
  this.currentPosition = null;

  setInterval(function () { self.updateStatus(); }, config.statusUpdateInterval);
}
require('util').inherits(Player, require('events'));


Player.prototype.start = function (file, _callback) {
  var self = this
    , callback = _callback || function () {};

  if (this.currentlyPlaying) {
    omxcontrol.quit();
  }
  this.currentlyPlaying = file;
  omxcontrol.start(this.currentlyPlaying);

  // Detect when player is active to actually launch remote
  var elapsedTime = 0;
  function checkIfActive () {
    var out;
    try {
      out = cp.execSync('bash lib/omxdbus.sh duration', { env: process.env });
      self.currentDuration = parseInt(out, 10);
      return callback();
    } catch (e) {
      if (elapsedTime > config.maxTryTime) {
        return callback("Could not start omxplayer");
      }
      elapsedTime += 200;
      setTimeout(checkIfActive, 200);
    }
  }
  checkIfActive();
};


Player.prototype.stop = function () {
  if (this.currentlyPlaying) {
    omxcontrol.quit();
    this.currentlyPlaying = undefined;
  }
};


Player.prototype.pause = function () {
  omxcontrol.pause();
};


/**
 * Periodically update player status
 */
Player.prototype.updateStatus = function () {
  var out;

  try {
    out = cp.execSync('bash lib/omxdbus.sh duration', { stdio: ['pipe', 'ignore', 'inherit'], env: process.env });
    //out = cp.execSync('bash lib/omxdbus.sh duration', { env: process.env });
    this.currentDuration = parseInt(out, 10);
    out = cp.execSync('bash lib/omxdbus.sh position', { env: process.env });
    this.currentposition = parseInt(out, 10);
    this.currentlyPlaying = true
  } catch (e) {
    this.currentDuration = null;
    this.currentPosition = null;
    this.currentlyPlaying = false;
  }

  console.log(this.currentlyPlaying);
};


// Absolute position in milliseconds
Player.prototype.setPosition = function (pos) {
  try {
    cp.execSync('bash lib/omxdbus.sh setposition ' + (pos * 1000), { env: process.env });
  } catch (e) {
    // Do nothing
  }
}



// Interface: singleton
module.exports = new Player();
