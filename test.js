var app = require('./app');
var request = require('supertest').agent(app.listen());
var assert = require('assert');


describe('Hello World', function(){
  it('devrait renvoyer "Hello World"', function(done){
    request
    .get('/')
    .auth('tj', 'tobi')
    .expect(200)
    .expect('Hello World', done);
  });
});

describe('404', function(){
  describe('Quand GET /toto', function(){
    it('devrait retourner une erreur 404', function(done){
      request
      .get('/toto')
      .auth('tj', 'tobi')
      .expect(404)
      .expect(/Page Not Found/, done);
    })
  })
})

describe('autorisations', function(){
    describe('sans autorisation', function(){
        it('devrait renvoyer 401', function(done){
            request
            .get('/')
            .expect(401, done);
        })
    })
    
    describe('sans autorisation sur page inconnu', function(){
        it('devrait renvoyer 401 au lieu de 404', function(done){
            request
            .get('/toto')
            .expect(401, done);
        })
    })

  describe('avec autorisations érronées', function(){
    it('devrait renvoyer 401', function(done){
      request
        .get('/')
        .auth('user', 'invalid password')
        .expect(401, done);
    })
  })
})
