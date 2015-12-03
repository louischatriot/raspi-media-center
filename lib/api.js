var player = require('./player')
  , api = {}
  ;

api.pause = function (req, res) {
  player.pause();
  return res.status(200).json({});
};


// Interface
module.exports = api;
