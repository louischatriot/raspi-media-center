var player = require('./player')
  , atob = require('atob')
  , path = require('path')
  , fs = require('fs')
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


// Interface
module.exports = api;
