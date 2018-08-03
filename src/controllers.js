import { filter, reconcile } from './services';

const authorizedScope = 'dgfip_revenu_fiscal_de_reference';

const getRevenuFiscalDeReference = (req, res) => {
  if (!req.fcToken || !req.fcToken.identity
    || !req.fcToken.identity.given_name || !req.fcToken.identity.family_name) {
    return res.sendStatus(404);
  }

  if (!req.fcToken.scope || !req.fcToken.scope.includes(authorizedScope)) {
    return res.sendStatus(403);
  }

  const matchedDatabaseEntry = reconcile(req.fcToken.identity);

  if (!matchedDatabaseEntry) {
    return res.sendStatus(404);
  }

  const revenuFiscalDeReference = filter(matchedDatabaseEntry);

  return res.json(revenuFiscalDeReference);
};

export default getRevenuFiscalDeReference;
