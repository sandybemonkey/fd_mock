/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /undefined-route', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('it should return 400 when no token is provided', (done) => {
    chai.request(app)
      .get('/undefined-route')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('it should return 400 when the token type is not Bearer', (done) => {
    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', 'Basic maybe-valid-token')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('it should return 502 when not able to connect to FranceConnect', (done) => {
    nock('https://fcp.dev.dev-franceconnect.fr')
      .post('/api/v1/checktoken', { token: /.+/i })
      .replyWithError({ code: 'ECONNREFUSED' });

    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', 'Bearer valid-token')
      .end((err, res) => {
        expect(res).to.have.status(502);
        done();
      });
  });

  it('it should return 401 when an invalid token is provided', (done) => {
    nock('https://fcp.dev.dev-franceconnect.fr')
      .post('/api/v1/checktoken', { token: /.+/i })
      .reply(401, { status: 'fail', message: 'Malformed access token.' });

    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', 'Bearer invalid-token')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
