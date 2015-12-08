var omxcontrol = require('omxcontrol')
  , cp = require('child_process')
  , config = require('./config')
  , path = require('path')
  , Nedb = require('nedb')
  , movies = new Nedb({ filename: 'data/movies.nedb', autoload: true })
  ;

// Parameter movies database
movies.persistence.setAutocompactionInterval(config.autocompactionInterval);
movies.ensureIndex({ fieldname: 'path' });


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

  // Get movie data before it is overwritten by playback
  //movies.findOne({ path: self.currentlyPlaying }, function (err, movie) {
    this.currentlyPlaying = file;
    omxcontrol.start(this.currentlyPlaying);

    // Detect when player is active to actually launch remote
    var elapsedTime = 0;
    function checkIfActive () {
      var out;
      try {
        out = cp.execSync('bash lib/omxdbus.sh duration', { env: process.env });
        self.currentDuration = parseInt(out, 10);
          // If error while getting movie don't fire it, simply start playback from the beginning
          //if (movie) {
            //self.setPosition(Math.max(0, Math.floor(movie.position / 1000) - 6000));
          //}
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
  //});
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
 * Periodically update player duration and position
 * Set them to null if nothing is playing
 */
Player.prototype.updateStatus = function () {
  var out;

  try {
    //out = cp.execSync('bash lib/omxdbus.sh duration', { stdio: ['pipe', 'inherit', 'ignore'], env: process.env });
    out = cp.execSync('bash lib/omxdbus.sh duration', { env: process.env });
    out = out.toString();
    this.currentDuration = parseInt(out, 10);

    out = cp.execSync('bash lib/omxdbus.sh position', { env: process.env });
    out = out.toString();
    this.currentPosition = parseInt(out, 10);
  } catch (e) {
    this.currentDuration = null;
    this.currentPosition = null;
  }

  if (this.currentDuration && this.currentPosition && this.currentlyPlaying) {
    movies.update({ path: this.currentlyPlaying }, { $set: { duration: this.currentDuration, position: this.currentPosition } }, { upsert: true });
  }
};


Player.prototype.getStatus = function () {
  if (this.currentDuration) {
    return { duration: this.currentDuration, position: this.currentPosition, playing: this.currentlyPlaying };
  } else {
    return { playing: null };
  }
}


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
