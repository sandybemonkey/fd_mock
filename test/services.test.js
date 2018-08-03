/* eslint-env mocha */
import chai from 'chai';
// eslint-disable-next-line import/named
import { reconcile, __RewireAPI__ as ServiceRewireAPI } from '../src/services';


const { expect } = chai;

describe('reconcile', () => {
  it('it should match', () => {
    const userFromFranceConnect = {
      given_name: 'Eric',
      family_name: 'Mercier',
    };
    const matchingDatabaseEntry = {
      declarant1: {
        nom: 'Mercier',
        nomNaissance: 'Mercier',
        prenoms: 'Jean',
      },
      declarant2: {
        nom: 'Mercier',
        nomNaissance: 'Baude',
        prenoms: 'Eric',
      },
    };
    // eslint-disable-next-line no-underscore-dangle
    ServiceRewireAPI.__Rewire__('database', { svair: [matchingDatabaseEntry] });
    expect(reconcile(userFromFranceConnect)).to.deep.equal(matchingDatabaseEntry);
  });
  it('it should not match', () => {
    const userFromFranceConnect = {
      given_name: 'Eric',
      family_name: 'Mercier',
    };
    const matchingDatabaseEntry = {
      declarant1: {
        nom: 'Valjean',
        nomNaissance: 'Valjean',
        prenoms: 'Jean',
      },
      declarant2: {},
    };
    // eslint-disable-next-line no-underscore-dangle
    ServiceRewireAPI.__Rewire__('database', { svair: [matchingDatabaseEntry] });
    // eslint-disable-next-line no-unused-expressions
    expect(reconcile(userFromFranceConnect)).to.be.undefined;
  });
});
