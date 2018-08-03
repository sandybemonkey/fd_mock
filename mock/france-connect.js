// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { checkTokenPath, fcHost } from '../config';

export const expiredToken = '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73936';
export const validToken = '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73937';
export const validTokenWithoutTheRightScope = '9af033eb295d0fe113988d29a26527f920114973b3a1ca7bdb44768fd0c73938';
export const malformedToken = 'malformed-token';

export const mock = () => {
  nock(fcHost)
    .persist()
    .post(checkTokenPath, { token: malformedToken })
    .reply(401, { status: 'fail', message: 'Malformed access token.' });

  nock(fcHost)
    .persist()
    .post(checkTokenPath, { token: expiredToken })
    .reply(401, { status: 'fail', message: 'token_not_found_or_expired' });

  nock(fcHost)
    .persist()
    .post(checkTokenPath, { token: validToken })
    .reply(200, {
      scope: ['openid', 'profile', 'birth', 'dgfip_revenu_fiscal_de_reference'],
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

  nock(fcHost)
    .persist()
    .post(checkTokenPath, { token: validTokenWithoutTheRightScope })
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
};
