var User = require('../models/user.js')


module.exports = function *authenticate(next){
       
  var User = module.exports;
  try{
    if(!this.session) throw new Error('no session');
    if(!this.session.uid) throw new Error('user id not set');
    this.state.user = yield User.model.findById(this.session.uid)
    .select('-passwordhash -__v')
    .exec()
    .then(
      function(user){
        if(!user) throw new Error('user not found');
        return user;
      },
      function(err){ throw err }
    );
 
  } catch(err){
    delete this.session.uid;
    delete this.state.user;
    //this.status = 401;
    //this.app.emit('error', err, this);
  }
  
       yield next;
};

module.exports.login = function *login(next){
  try{
    if(Object.prototype.toString.call(this.request.body) !== '[object Object]' || !this.request.body.email || !this.request.body.password){
      throw new Error('bad request');
    }
    var user = yield User.model.findOne({email: this.request.body.email}).exec().then(
      function(user){
        if(!user) throw new Error('email address not found');
        return user;
      },
      function(err){ throw err; }
    );
    if(!user.validatePassword(this.request.body.password)) {
      throw new Error('invalid password');
    }
    this.session.uid = user._id;
    this.state.user = user.toObject();
  } catch(err){
    delete this.session.uid;
    delete this.state.user;
    throw err;
  }
  yield next;
};

module.exports.register = function *register(next){
  if(Object.prototype.toString.call(this.request.body) !== '[object Object]'){
    throw new Error('Bad request');
  }
  if(!this.request.body.email || !this.request.body.password){
    let err = 'Required: ';
    if(!this.request.body.email) err += " * email";
    if(!this.request.body.password) err += " * password";
    throw new Error(err);
  }
  yield User.model.findOne({ email: this.request.body.email }).exec().then(
    function(user) { if(user) { throw new Error('email already exists, try logging in or resetting your password') }},
    function(err) { throw err }
  );
  var user = yield User.model.create({
    email: this.request.body.email,
    password: this.request.body.password
  }).then(
    function(user){
      if(!user) throw new Error('failed to create user');
      return user;
    },
    function(err) {
      throw err;
    }
  );
  this.session.uid = user._id;
  this.state.user = user;
  yield next;
};

module.exports.unregister = function *unregister(next){
  if(this.state.user){
    yield User.model.findOne({ email: this.state.user.email }).remove().exec();
    delete this.session.uid;
    delete this.state.user;
  } else {
    throw new Error("You are not logged in, you must be logged in to unregister");
  }
  yield next;
};
