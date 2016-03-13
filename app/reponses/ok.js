module.exports.vrai = function *() {
    this.status = 200;
    this.body = JSON.stringify({ authenticated: true });
  }
  
  module.exports.faux = function *() {
    this.status = 200;
    this.body = JSON.stringify({ authenticated: false });
  }