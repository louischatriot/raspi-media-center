var env = process.env.RMC_ENV || 'dev'
  , config = {}
  ;

// Common options
config.env = env;
config.serverPort = 8888;
config.playableExtensions = ['avi', 'mp4', 'mkv'];
config.mediaRoot = 'media/';

// Interface
module.exports = config;
