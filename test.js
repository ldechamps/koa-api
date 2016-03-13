var app = require('./app');
var request = require('supertest').agent(app.listen());
var assert = require('assert');


describe('Hello World', function(){
  it('devrait renvoyer "Hello World"', function(done){
    request
    .get('/')
    .auth('loic', 'loic')
    .expect(200)
    .expect('Hello World', done);
  });
});

describe('404', function(){
  describe('Quand GET /toto', function(){
    it('devrait retourner une erreur 404', function(done){
      request
      .get('/toto')
      .auth('loic', 'loic')
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


describe('Cookies Views', function(){
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].forEach(function (i) {
    describe('à l\'iteration #' + i, function(){
      it('devrait mettre le nombre de vue dans le cookie et dans la vue', function(done){
        request
        .get('/count')
        .auth('loic', 'loic')
        .expect(200)
        .expect('Set-Cookie', new RegExp('view=' + i))
        .expect(i + ' views', done);
      })
    })
  })
})
