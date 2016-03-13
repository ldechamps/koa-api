var koa = require('koa');
var app = module.exports = koa();
var route = require('koa-route');
var auth = require('koa-basic-auth');

// pour debug
var logger = require('koa-logger');

// middleware
app.use(logger());


// middleware route
app.use(auth({ name: 'loic', pass: 'loic' }));

app.use(route.get('/', helloWorld));
app.use(route.get('/count', count));
app.use(pageNotFound);
app.use(authentification);

function* authentification(next){
  try {
    yield* next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.body = 'Non autorisé';
    } else {
      throw err;
    }
  }
}

function* count(){
  var n = ~~this.cookies.get('view') + 1;
  this.cookies.set('view', n);
  this.body = n + ' views';
  
  console.log(this.cookies.get('view'));
  console.log(this.body);
  
}

function* helloWorld(){
  this.body = 'Hello World';
}

function* pageNotFound(next){
  yield* next;

  if (404 != this.status) return;

  this.status = 404;

  switch (this.accepts('html', 'json')) {
    case 'html':
      this.type = 'html';
      this.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      this.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      this.type = 'text';
      this.body = 'Page Not Found';
  }
}

if (!module.parent) {
    var port = 3000;
    console.log("ecoute sur le port : "+port)
    app.listen(port);
}
