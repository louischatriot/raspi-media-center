var omxcontrol = require('omxcontrol')
  , currentlyPlaying
  ;

module.exports.getCurrentlyPlaying = function () {
  return currentlyPlaying;
};


module.exports.start = function (file) {
  if (currentlyPlaying) {
    omxcontrol.quit();
  }
  currentlyPlaying = file;
  omxcontrol.start(currentlyPlaying);
};


module.exports.stop = function () {
  if (currentlyPlaying) {
    omxcontrol.quit();
    currentlyPlaying = undefined;
  }
};


module.exports.pause = function () {
  omxcontrol.pause();
};


module.exports.smallForward = function () {
  omxcontrol.sendKey("$'\e'[C");
};

module.exports.smallBackward = function () {
  omxcontrol.sendKey("$'\e'[D");
};

module.exports.bigForward = function () {
  omxcontrol.sendKey("$'\e'[A");
};

module.exports.bigBackward = function () {
  omxcontrol.sendKey("$'\e'[B");
};

