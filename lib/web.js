var fs = require('fs')
  , path = require('path')
  , cp = require('child_process')
  , diskspace = require('diskspace')
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
        var srt = file.substring(0, file.length - path.extname(file).length) + '.srt';
        var toPush = { name: file, id: btoa(path.join(currentDir, file)) };
        if (_files.indexOf(srt) !== -1) { toPush.srt = true; }
        files.push(toPush);
      }
    }
  });

  // Report disk space
  diskspace.check('/', function (err, total, free) {
    total = total / 1000000;
    free = free / 1000000;
    if (total < 1000) {
      total = Math.floor(total) + ' MB';
    } else {
      total = (Math.floor(total / 100) / 10) + ' GB';
    }
    if (free < 1000) {
      free = Math.floor(free) + ' MB';
    } else {
      free = (Math.floor(free / 100) / 10) + ' GB';
    }

    res.locals.diskspace = free + ' / ' + total;
    res.locals.currentDir = currentDir;
    res.locals.currentDirBase64 = btoa(currentDir);
    res.locals.files = files;
    res.locals.dirs = dirs;
    res.render('list.jade');
  });
};


/**
 * Play given file
 * If a file is already being played, ask user first
 */
web.play = function (req, res) {
  player.start(atob(req.params.id), function (err) {
    if (err) {
      return res.status(500).send("Unexpected error: omxplaer couldn't start");
    } else {
      return res.redirect('/web/current');
    }
  });
};


/**
 * Remote control for currently playing video
 */
web.current = function (req, res) {
  res.locals.currentlyPlaying = player.currentlyPlaying;
  res.locals.currentDuration = Math.floor(player.currentDuration / 1000000);
  return res.render('current.jade');
};


/**
 * Shutdown Raspberry Pi cleanly from the remote
 */
web.shutdown = function (req, res) {
  return res.render('shutdown.jade');
}

web.shutdownConfirm = function (req, res) {
  res.render('shutdownConfirm.jade');
  cp.execSync('sudo shutdown -h now');
};


// Interface
module.exports = web;
