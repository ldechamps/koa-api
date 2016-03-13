var Router = require('koa-router');
var auth = require('koa-simple-auth');
var koaBody = require('koa-body')();
var reponse = require('../reponses/ok');
var router = new Router();
 
var catch_api_error = function *(next){
  try{
    yield next;
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