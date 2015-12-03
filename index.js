var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , webapp = express.Router()
  , api = express.Router()
  , omxcontrol = require('omxcontrol')
  , config = require('./lib/config')
  , webRoutes = require('./lib/web')
  , apiRoutes = require('./lib/api')
  ;

// Don't try to serve a favicon
app.use(function (req, res, next) {
  if (req.url === "/favicon.ico") {
    return res.status(200).send('');
  }
  return next();
});


// API
api.get('/pause', apiRoutes.pause);



// WEBAPP
webapp.get('/list/:id?', webRoutes.list);
webapp.get('/play/:id', webRoutes.play);
webapp.get('/current', webRoutes.current);




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
