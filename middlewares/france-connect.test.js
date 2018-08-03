/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from '../app';
import { fcHost, checkTokenPath } from '../config/config';
import {
  validToken, malformedToken, expiredToken, mock,
} from '../mock/france-connect';

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /undefined-route', () => {
  beforeEach(() => {
    mock();
  });
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
      .set('Authorization', `Basic ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('it should return 502 when not able to connect to FranceConnect', (done) => {
    nock.cleanAll();
    nock(fcHost)
      .post(checkTokenPath, { token: validToken })
      .replyWithError({ code: 'ECONNREFUSED' });

    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(502);
        done();
      });
  });

  it('it should return 401 when an invalid token is provided', (done) => {
    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', `Bearer ${malformedToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('it should return 401 when an invalid token is provided', (done) => {
    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', `Bearer ${expiredToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('it should return 404 when a valid token is provided', (done) => {
    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
