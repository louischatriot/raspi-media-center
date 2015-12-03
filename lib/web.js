var fs = require('fs')
  , path = require('path')
  , config = require('./config')
  , player = require('./player')
  , btoa = require('btoa')
  , atob = require('atob')
  , web = {}
  ;

/**
 * Show list of movie files in media folder
 * We don't really care about concurrency for this project, let's use sync fs functions
 * Also in theory it's possible to access directories outside of media but this is used only
 * on a trusted wifi network so we don't really care
 * Also I suspect bad things can happen if someone crafts a base64 strings to be reversed to a malicious binary
 * buffer but for the same reason above e don't care
 */
web.list = function (req, res) {
  var currentDir = req.params.id ? atob(req.params.id) : config.mediaRoot;

  var _files = fs.readdirSync(currentDir);
  var files = [], dirs = [];

  if (currentDir !== config.mediaRoot) { dirs.push({ name: '[Parent Dir]', id: btoa(path.join(currentDir, '..')) }); }

  _files.forEach(function (file) {
    if (fs.statSync(path.join(currentDir, file)).isDirectory()) {
      dirs.push({ name: file, id: btoa(path.join(currentDir, file)) });
    } else {
      if (config.playableExtensions.indexOf(path.extname(file)) !== -1) {
        files.push({ name: file, id: btoa(path.join(currentDir, file)) });
      }
    }
  });

  res.locals.currentDir = currentDir;
  res.locals.files = files;
  res.locals.dirs = dirs;
  return res.render('list.jade');
};


/**
 * Play given file
 * If a file is already being played, ask user first
 */
web.play = function (req, res) {
  player.start(atob(req.params.id));
  return res.redirect('/web/current');
};


/**
 * Remote control for currently playing video
 */
web.current = function (req, res) {
  res.locals.currentlyPlaying = player.getCurrentlyPlaying();
  return res.render('current.jade');
};



// Interface
module.exports = web;
