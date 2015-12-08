var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , bodyParser = require('body-parser')
  , webapp = express.Router()
  , api = express.Router()
  , omxcontrol = require('omxcontrol')
  , config = require('./lib/config')
  , webRoutes = require('./lib/web')
  , apiRoutes = require('./lib/api')
  ;

app.enable('view cache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Don't try to serve a favicon
app.use(function (req, res, next) {
  if (req.url === "/favicon.ico") {
    return res.status(200).send('');
  }
  return next();
});


// API
api.get('/pause', apiRoutes.pause);
api.get('/stop', apiRoutes.stop);
api.get('/status', apiRoutes.getStatus);
api.post('/position', apiRoutes.setPosition);


// WEBAPP
webapp.get('/list/:id?', webRoutes.list);
webapp.get('/play/:id', webRoutes.play);
webapp.get('/current', webRoutes.current);
webapp.get('/shutdown', webRoutes.shutdown);
webapp.get('/shutdown/confirm', webRoutes.shutdownConfirm);




// Declare subrouters
app.use('/api', api);
app.use('/web', webapp);


// Serve static client-side js and css
app.get('/assets/*', function (req, res) {
  res.sendFile(process.cwd() + req.url);
});

// Root
app.get('/', function (req, res) { return res.redirect(302, '/web/list'); });


// Compile both templates then launch
// Because Raspberry Pi is way too slow on compiling, it's a pain to test
console.log("Express app defined");
app.render('list.jade', function () {
  console.log("Compiled list.jade");
  app.render('current.jade', function () {
    console.log("Compiled current.jade");

    server.listen(config.serverPort, function () {
      console.log("Server launched, ready to accept connections");
    });
  });
});
