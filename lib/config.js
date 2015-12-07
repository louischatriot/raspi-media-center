var env = process.env.RMC_ENV || 'dev'
  , config = {}
  ;

// Common options
config.env = env;
config.serverPort = 8888;
config.playableExtensions = ['.avi', '.mp4', '.mkv'];
config.mediaRoot = 'media';
config.maxTryTime = 10000;   // In ms, time affter which we stop waiting for player if video hasn't started
config.statusUpdateInterval = 300;   // In ms, how often ask player for status
config.autocompactionInterval = 3600 * 1000;   // In ms

// Interface
module.exports = config;
