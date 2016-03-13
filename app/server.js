var koa = require('koa');
var app = module.exports = koa();
var route = require('koa-route');
var mount = require('koa-mount');
var session = require('koa-session');
var simple_auth = require('koa-simple-auth');

// require personnalisé
var authentification = require('./policies/authentification'); // faire une librairie
var routes = require('./routes/routes');
var notFound = require('./reponses/notFound');

// initialisation 
app.keys = [
    'des clefs secretes',
    'mot utilisé pour generer le hash de la session'
]

// pour debug
var logger = require('koa-logger');

// middleware
app.use(logger());

// middleware route
app.use(session(app));
app.use(simple_auth);
app.use(mount('/', routes.middleware()));
app.use(notFound);


app.on('error', function(err){
  if (process.env.NODE_ENV != 'test') {
    console.log('devrait renvoyer l\'erreur %s au navigateur', err.message);
    console.log(err);
  }
});


if (!module.parent) {
    var port = 3000;
    console.log("ecoute sur le port : "+port)
    app.listen(port);
}
