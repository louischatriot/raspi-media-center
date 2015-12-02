var fs = require('fs')
  , config = require('./config')
  , btoa = require('btoa')
  , atob = require('atob')
  , web = {}
  ;

/**
 * Show list of movie files in media folder
 */
web.list = function (req, res) {
  fs.readdir(config.mediaRoot, function (err, _files) {
    var files = [];

    _files.forEach(function (file) {
      var extension = file.match(/.*\.([^\.]+)/);
      if (extension) { extension = extension[1]; }
      if (config.playableExtensions.indexOf(extension) !== -1) {
        files.push({ name: file, id: btoa(file) });
      }
    });

    res.locals.files = files;
    return res.render('list.jade');
  });
};


/**
 * Play given file
 * If a file is already being played, ask user first
 */
web.play = function (req, res) {
  console.log(atob(req.params.id));
  return res.status(200).send('eeeee');
};



// Interface
module.exports = web;
