var omxcontrol = require('omxcontrol')
  , cp = require('child_process')
  ;

function Player () {
  this.currentlyPlaying = null;
}
require('util').inherits(Player, require('events'));


Player.prototype.getCurrentlyPlaying = function () {
  return this.currentlyPlaying;
};


Player.prototype.start = function (file) {
  if (this.currentlyPlaying) {
    omxcontrol.quit();
  }
  this.currentlyPlaying = file;
  omxcontrol.start(this.currentlyPlaying);


  var i = 0, N = 20;
  var out;

  function checkIfActive () {
    try {
      out = cp.execSync('bash lib/omxdbus.sh status', { env: process.env });
      console.log("===============================");
      console.log("SUCCESS");
      console.log(out);
    } catch (e) {
      console.log("==============================================");
      console.log("Got an error");
      console.log(e);

      setTimeout(checkIfActive, 1000);
    }
  }
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
  console.log("WAITING SOME TIME");

  setTimeout(function () {
    console.log("==================");
    var out = cp.execSync('bash lib/omxdbus.sh setposition ' + (pos * 1000), { env: process.env });
    console.log(out);
  }, 10000);
}



// Interface: singleton
module.exports = new Player();
