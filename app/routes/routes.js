var Router = require('koa-router');
var auth = require('koa-simple-auth');
var koaBody = require('koa-body')();
var reponse = require('../reponses/ok');
var router = new Router();
 
var catch_api_error = function *(next){
  try{
    yield* next;
  } catch(err){
    this.body = JSON.stringify({ "error": err.message });
  }
};

var count = function* (){
  var n = ~~this.cookies.get('view') + 1;
  this.cookies.set('view', n);
  this.body = n + ' views';
  
  console.log(this.cookies.get('view'));
  console.log(this.body);
  
}

var helloWorld = function* (){
  this.status = 200;
  this.body = 'Hello World';
}


var error500 = function *(next){
  try {
    yield* next;
  } catch (err) {
    // some errors will have .status
    // however this is not a guarantee
    this.status = err.status || 500;
    this.type = 'html';
    this.body = '<p>Something <em>exploded</em>, please contact Maru.</p>';

    console.log('500');
    // since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    this.app.emit('error', err, this);
  }
};

// response

var boomboom = function *(){
  throw new Error('boom boom');
};

router.get('/boomboom',
    error500,
    boomboom
)
 
router.post('/login',
  catch_api_error,
  koaBody,
  auth.login,
  reponse.vrai
);
 
router.post('/register',
  catch_api_error,
  koaBody,
  auth.register,
  reponse.vrai
);
 
router.get('/unregister',
  catch_api_error,
  koaBody,
  auth.unregister,
  reponse.faux
);
 
router.get('/logout',
  auth.logout,
  reponse.faux
);

router.get('/helloWorld', helloWorld);

router.get('/count', count);

module.exports = router;