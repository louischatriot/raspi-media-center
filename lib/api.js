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


// Interface
module.exports = api;
