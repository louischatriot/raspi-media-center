var fs = require('fs')
  , web = {};

/**
 * Show list of movie files in media folder
 */
web.list = function (req, res) {
  return res.render('list.jade');
};



// Interface
module.exports = web;
