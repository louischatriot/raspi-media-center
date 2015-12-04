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

api.getStatus = function (req, res) {
  return res.status(200).json(player.getStatus());
};

// body.position in seconds
api.setPosition = function (req, res) {
  player.setPosition(req.body.position * 1000);
  return res.status(200).json({});
};


// Interface
module.exports = api;
