var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , webapp = express.Router()
  , api = express.Router()
  , omxcontrol = require('omxcontrol')
  , config = require('./lib/config')
  , web = require('./lib/web')
  ;

// Don't try to serve a favicon
app.use(function (req, res, next) {
  if (req.url === "/favicon.ico") {
    return res.status(200).send('');
  }
  return next();
});


// API
api.get('/start', function (req, res) {
  omxcontrol.start('media/a.avi');
  return res.status(200).json({ hello: 'world' });
});



// WEBAPP
webapp.get('/list', web.list);
webapp.get('/play/:id', web.play);




// Declare subrouters
app.use('/api', api);
app.use('/web', webapp);


// Serve static client-side js and css
app.get('/assets/*', function (req, res) {
  res.sendFile(process.cwd() + req.url);
});

// Root
app.get('/', function (req, res) { return res.redirect(302, '/web/list'); });


server.listen(config.serverPort);
