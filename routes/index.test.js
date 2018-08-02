/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from '../app';
import { fcHost, checkTokenPath } from '../config/config';

chai.use(chaiHttp);
const { expect } = chai;
const validToken = '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73937';
const expiredToken = '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73936';
const malformedToken = 'malformed-token';

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
      .set('Authorization', `Basic ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('it should return 502 when not able to connect to FranceConnect', (done) => {
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
    nock(fcHost)
      .post(checkTokenPath, { token: malformedToken })
      .reply(401, { status: 'fail', message: 'Malformed access token.' });

    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', `Bearer ${malformedToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('it should return 401 when an invalid token is provided', (done) => {
    nock(fcHost)
      .post(checkTokenPath, { token: expiredToken })
      .reply(401, { status: 'fail', message: 'token_not_found_or_expired' });

    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', `Bearer ${expiredToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('it should return 404 when a valid token is provided', (done) => {
    nock(fcHost)
      .post(checkTokenPath, { token: validToken })
      .reply(200, {
        scope: ['openid', 'profile', 'birth'],
        identity: {
          given_name: 'Eric',
          family_name: 'Mercier',
          birthdate: '1990-12-05',
          gender: 'male',
          birthplace: '91272',
          birthdepartment: '66',
          birthcountry: '99100',
          email: 'eric.mercier@france.fr',
          address: {
            formatted: '26 rue Desaix, 75015 Paris', street_address: '26 rue Desaix', locality: 'Paris', region: 'Ile-de-France', postal_code: '75015', country: 'France',
          },
          _claim_names: {},
          _claim_sources: { src1: {} },
        },
        client: { client_id: 'c48ff5ae96e870f507507555f7bc4dd361d2aac31df219fe6e92bbcca65f73f5', client_name: 'Ville de chilly FC test' },
        identity_provider_id: 'dgfip',
        identity_provider_host: 'fip1.integ01.dev-franceconnect.fr',
        acr: 'eidas2',
      });

    chai.request(app)
      .get('/undefined-route')
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
