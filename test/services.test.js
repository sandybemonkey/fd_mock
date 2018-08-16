/* eslint-disable no-unused-expressions */
/* eslint-env mocha */
import { expect } from 'chai';
import { filter, isAuthorized, reconcile } from '../src/services';

describe('isAuthorized', () => {
  it('should return not authorized for insufficient scope', () => {
    const notAuthorizedToken = { scope: ['scope_1', 'scope_2'] };

    expect(isAuthorized(notAuthorizedToken)).to.be.false;
  });

  it('should return authorized', () => {
    const notAuthorizedToken = { scope: ['scope_1', 'scope_2', 'dgfip_nbpac'] };

    expect(isAuthorized(notAuthorizedToken)).to.be.true;
  });
});

describe('filter', () => {
  it('should filter data according to user scopes', () => {
    const databaseEntry = {
      dataNotToBeReturn: 0,
      nombreDePersonnesACharge: 0,
      nombreDEnfantsACharge: 0,
    };

    const userScopes = ['scope_1', 'scope_2', 'dgfip_nbpac'];

    expect(filter(userScopes, databaseEntry).dataNotToBeReturn).to.be.undefined;
  });

  it('should return data when different scopes refer to the same properties', () => {
    const databaseEntry = {
      dataNotToBeReturn: 0,
      nombreDePersonnesACharge: 0,
      nombreDEnfantsACharge: 0,
    };

    const userScopes = ['dgfip_nbpac', 'dgfip_nbpacf'];

    expect(filter(userScopes, databaseEntry)).to.deep.equal({
      nombreDePersonnesACharge: 0,
      nombreDEnfantsACharge: 0,
    });
  });
});

describe('reconcile', () => {
  it('should not match when FC user does not have birthcountry', (done) => {
    const userFromFranceConnect = {
      given_name: 'Carlós',
      family_name: 'Nuñez',
      birthdate: '1970-08-16',
      gender: 'male',
      birthdepartment: '25',
    };
    reconcile(userFromFranceConnect).then((record) => {
      expect(record).to.be.null;
      done();
    }).catch(err => done(err));
  });

  it('should match one user with accented names', (done) => {
    const userFromFranceConnect = {
      given_name: 'Carlós',
      family_name: 'Nuñez',
      birthdate: '1970-08-16',
      gender: 'male',
      birthdepartment: '25',
      birthcountry: '99100',
    };
    reconcile(userFromFranceConnect).then(({ SPI }) => {
      expect(SPI).to.equal('3999999901234');
      done();
    }).catch(err => done(err));
  });

  it('should match the same user with other accent in his name', (done) => {
    const userFromFranceConnect = {
      given_name: 'Cårløs',
      family_name: 'Nunez',
      birthdate: '1970-08-16',
      gender: 'male',
      birthdepartment: '25',
      birthcountry: '99100',
    };
    reconcile(userFromFranceConnect).then(({ SPI }) => {
      expect(SPI).to.equal('3999999901234');
      done();
    }).catch(err => done(err));
  });

  it('should return null for namesakes', (done) => {
    const userFromFranceConnect = {
      given_name: 'Dupont',
      family_name: 'Martine',
      birthdate: '1970-08-16',
      gender: 'male',
      birthdepartment: '25',
      birthcountry: '99100',
    };
    reconcile(userFromFranceConnect).then((record) => {
      expect(record).to.be.null;
      done();
    }).catch(err => done(err));
  });
});
