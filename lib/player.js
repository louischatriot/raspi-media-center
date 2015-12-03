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
  }
};


module.exports.pause = function () {
  omxcontrol.pause();
};
