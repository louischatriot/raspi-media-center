var player = require('./player')
  , atob = require('atob')
  , path = require('path')
  , fs = require('fs')
  , config = require('./config')
  , api = {}
  ;

api.pause = function (req, res) {
  player.pause();
  return res.status(200).json({});
};

api.stop = function (req, res) {
  player.stop();
  return res.status(200).json({});
};

api.getStatus = function (req, res) {
  return res.status(200).json(player.getStatus());
};

// body.position in seconds
api.setPosition = function (req, res) {
  player.setPosition(req.body.position * 1000);
  return res.status(200).json({});
};


/**
 * Upload new movie
 */
api.upload = function (req, res) {
  if (!req.file) { return res.status(200).json({}); }   // No need to raise an error

  var currentPath = req.file.path
    , newPath = path.join(atob(req.params.id), req.file.originalname);

  fs.renameSync(currentPath, newPath);

  return res.status(200).json({});
};


/**
 * Refuse to delete anything outside the media root
 */
api.deleteMovie = function (req, res) {
  var file = atob(req.params.id);;

  // Cautiously refuse to delete any file outside the media directory
  if (path.isAbsolute(file) || path.relative(config.mediaRoot, file).indexOf('..') !== -1) {
    return res.status(200).json({});   // No need to raise an error
  }

  fs.unlinkSync(file);

  var srt = file.substring(0, file.length - path.extname(file).length) + '.srt';
  if (fs.existsSync(srt)) { fs.unlinkSync(srt); }

  return res.status(200).json({});
};



// Interface
module.exports = api;
