/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from '../src/app';
import {
  validToken, validTokenWithoutTheRightScope, mock,
} from '../mock/france-connect';


chai.use(chaiHttp);
const { expect } = chai;

describe('GET /revenu-fiscal-de-reference', () => {
  beforeEach(() => {
    mock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('it should return 403 when user has not the right scope', (done) => {
    chai.request(app)
      .get('/revenu-fiscal-de-reference')
      .set('Authorization', `Bearer ${validTokenWithoutTheRightScope}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('it should return 200 with the revenu fiscal de reference', (done) => {
    chai.request(app)
      .get('/revenu-fiscal-de-reference')
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ revenuFiscalReference: 32698 });
        done();
      });
  });
});
