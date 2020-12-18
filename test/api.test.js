var db = require('../models');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../server.js');


   describe('POST /favorites', function() {
    it('should redirect to favorites ', function(done) {
      request(app).post('/favorites')
      .expect('Location', '/favorites')
      .expect(302, done);
     });
   });

   describe('/GET paintings', () => {
    it('it should not display a piece of art with no image', (done) => {
     request(app).get('/paintngs').send(done)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('width');
                res.body.should.have.property('height');
            done();
          });
    });
});