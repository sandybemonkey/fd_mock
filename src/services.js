import database from '../database';

export const filter = ({ revenuFiscalReference }) => ({ revenuFiscalReference });

// Reconciliate identity from FranceConnect with the data we have in our database
export const reconcile = (userFromFranceConnect) => {
  const { family_name: nomUser, given_name: prenomUser } = userFromFranceConnect;
  return database.svair.find(({
    declarant1: {
      nom: nomDeclarant1, prenoms: prenomDeclarant1, nomNaissance: nomNaissanceDeclarant1,
    },
    declarant2: {
      nom: nomDeclarant2, prenoms: prenomDeclarant2, nomNaissance: nomNaissanceDeclarant2,
    },
  }) => {
    const doDeclarant1Matche = (nomUser === nomNaissanceDeclarant1 || nomUser === nomDeclarant1)
      && prenomUser === prenomDeclarant1;
    const doDeclarant2Matche = (nomUser === nomNaissanceDeclarant2 || nomUser === nomDeclarant2)
      && prenomUser === prenomDeclarant2;

    return doDeclarant1Matche || doDeclarant2Matche;
  });
};
