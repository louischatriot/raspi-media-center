var omxcontrol = require('omxcontrol')
  , cp = require('child_process')
  , config = require('./config')
  ;

function Player () {
  this.currentlyPlaying = null;
  this.currentDuration = null;
}
require('util').inherits(Player, require('events'));


Player.prototype.start = function (file) {
  var self = this;

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
      self.emit('player.playing');
    } catch (e) {
      if (elapsedTime > config.maxTryTime) {
        self.emit('player.startFailed');
        return;
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


Player.prototype.smallForward = function () {
  omxcontrol.sendKey("$'\e'[C");
};

Player.prototype.smallBackward = function () {
  omxcontrol.sendKey("$'\e'[D");
};

Player.prototype.bigForward = function () {
  omxcontrol.sendKey("$'\e'[A");
};

Player.prototype.bigBackward = function () {
  omxcontrol.sendKey("$'\e'[B");
};

// Absolute position in milliseconds
Player.prototype.setPosition = function (pos) {
  //console.log("WAITING SOME TIME");

  //setTimeout(function () {
    //console.log("==================");
    //var out = cp.execSync('bash lib/omxdbus.sh setposition ' + (pos * 1000), { env: process.env });
    //console.log(out);
  //}, 10000);
}



// Interface: singleton
module.exports = new Player();
