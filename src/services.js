import _ from 'lodash';
import database from './database';
import {
  cleanUpAccentedChars, getDay, getMonth, getTitle, getYear,
} from './utils';

const scopeToProperties = {
  dgfip_revenu_fiscal_de_reference: ['RFR'],
  dgfip_aft: ['adresseFiscaleDeTaxation'],
  dgfip_nbpac: ['nombreDePersonnesACharge', 'nombreDEnfantsACharge', 'enfantsAChargeEnGardeAlternee', 'personnesInvalidesACharge', 'enfantsMajeursCelibataires', 'enfantsMajeursMariesOuChargeDeFamille', 'nbPacP'],
  dgfip_nbpacf: ['nombreDEnfantsACharge'],
};

export const authorizedScope = Object.keys(scopeToProperties);

// TODO test this!
export const filter = (scopes, databaseEntry) => {
  const propertiesToReturn = _(scopes)
    .map(scope => scopeToProperties[scope])
    .flatten()
    .uniq()
    .value();

  return _.pick(databaseEntry, propertiesToReturn);
};

/**
 * This is the most important part of the Fournisseur de Données.
 * It associates the user returned by FranceConnect with the corresponding
 * entry in our database. We call this step the "reconciliation".
 * If the result is a miss, the final user will not be able to get his data.
 * If the checks are not strict enough we might mix returned data between users.
 * So we must be careful that this function is both strict and will match in most of the cases.
 *
 * @param userFromFranceConnect
 * @returns correspondingDgfipEntry
 */
export const reconcile = (userFromFranceConnect) => {
  /*
   * We make sure to have enough data from FranceConnect to make a reconciliation.
   * If some data are missing, we prefer to return null result instead of taking the risk to match
   * the wrong entry in our database.
   */
  if (!userFromFranceConnect
    || !userFromFranceConnect.birthdate
    || !userFromFranceConnect.gender
    || !userFromFranceConnect.birthdepartment
    || !userFromFranceConnect.birthcountry
  ) {
    return null;
  }

  return database.connection.find({
    /*
     * In this example, we have a database where names have no accents and are capitalized.
     * We have to remove accent from names and capitalised them.
     * This creates more collision between distinct people.
     * For example, "Cårløs Nunez" and "Carlós Nuñez" will match the same database entry
     * So, we have to make additional check to make sure we address the right person.
     */
    prenom: cleanUpAccentedChars(userFromFranceConnect.given_name).toUpperCase(),
    nomDeNaissance: cleanUpAccentedChars(userFromFranceConnect.family_name).toUpperCase(),
    /*
     * In this implementation, we also check the birth date, the gender and the birth department
     * and country.
     */
    AAAA: getYear(userFromFranceConnect.birthdate),
    MM: getMonth(userFromFranceConnect.birthdate),
    JJ: getDay(userFromFranceConnect.birthdate),
    titre: getTitle(userFromFranceConnect.gender),
    departementDeNaissance: userFromFranceConnect.birthdepartment,
    codePaysDeNaissance: userFromFranceConnect.birthcountry,
  }).then((results) => {
    /*
     * We must be certain that we have one match and one match only.
     * If we got 2 people who have the same accent-less capitalized name and the same birth date and
     * place, we indeed have more than one result. In this particular rare case, we are not sure
     * what to return, so we return none of the results.
     *
     * We will deal with this cases manually and if they occur often, we will add an additional test
     * to differentiate these colliding people.
     */
    if (results.length !== 1) {
      return null;
    }

    return results[0];
  });
};
