import csvdb from 'csv-database';
import path from 'path';

const database = { connection: null };

const model = ['SPI', 'nomDeNaissance', 'prenom', 'titre', 'AAAA', 'MM', 'JJ', 'departementDeNaissance', 'codeCommune', 'regionDeNaissance', 'codePaysDeNaissance', 'RFR', 'nombreDeParts', 'situationDeFamille', 'nombreDePersonnesACharge', 'nombreDEnfantsACharge', 'enfantsAChargeEnGardeAlternee', 'personnesInvalidesACharge', 'enfantsMajeursCelibataires', 'enfantsMajeursMariesOuChargeDeFamille', 'nbPacP', 'nomDeNaissanceDuDeclarant1', 'nomDUsageDuDeclarant1', 'prenomsDuDeclarant1', 'nomDeNaissanceDuDeclarant2', 'nomDUsageDuDeclarant2', 'prenomsDuDeclarant2', 'parentIsole', 'adresseFiscaleDeTaxation'];
csvdb(path.join(__dirname, '../database.csv'), model, ',').then((db) => {
  // eslint-disable-next-line no-console
  console.log('Connected to database!');

  database.connection = db;
});

export default database;
