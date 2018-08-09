import { intersection, isEmpty } from 'lodash';
import { authorizedScope, filter, reconcile} from './services';

/**
 * TODO add documentation here
 * 1. we ensure the called scope is the right one
 * 2.
 *
 * @param req
 * @param res
 * @returns {*}
 */
const getDgfipData = async (req, res) => {
  // TODO The FS has tried to call this FD but
  if (isEmpty(intersection(req.fcToken.scope, authorizedScope))) {
    return res.sendStatus(403);
  }

  const matchedDatabaseEntry = await reconcile(req.fcToken.identity);

  if (isEmpty(matchedDatabaseEntry)) {
    return res.sendStatus(404);
  }

  const revenuFiscalDeReference = filter(intersection(req.fcToken.scope, authorizedScope), matchedDatabaseEntry);

  return res.json(revenuFiscalDeReference);
};

export default getDgfipData;
