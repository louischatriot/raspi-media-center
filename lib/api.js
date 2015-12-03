var player = require('./player')
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

api.smallForward = function (req, res) {
  player.smallForward();
  return res.status(200).json({});
};

api.smallBackward = function (req, res) {
  player.smallBackward();
  return res.status(200).json({});
};

api.bigForward = function (req, res) {
  player.bigForward();
  return res.status(200).json({});
};

api.bigBackward = function (req, res) {
  player.bigBackward();
  return res.status(200).json({});
};


// Interface
module.exports = api;
