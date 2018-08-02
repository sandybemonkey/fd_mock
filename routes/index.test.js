import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /undefined-route', () => {
  it('it should return 400 when no token is provided', () => {
    chai.request(app)
      .get('/quotientfamilial')
      .end((err, res) => {
        expect(res).to.have.status(400);
      })
  });

  it('it should return 400 when invalid token is provided', () => {
    chai.request(app)
      .get('/quotientfamilial')
      .set('Authorization', 'Bearer invalid-token')
      .end((err, res) => {
        expect(res).to.have.status(403);
      })
  });
})
