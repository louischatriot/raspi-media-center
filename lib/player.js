var omxcontrol = require('omxcontrol')
  , currentlyPlaying
  ;

module.exports.start = function (file) {
  currentlyPlaying = file;
  omxcontrol.start(currentlyPlaying);
};


module.exports.getCurrentlyPlaying = function () {
  return currentlyPlaying;
};


module.exports.pause = function () {
  omxcontrol.pause();
};
