import express from 'express';
import logger from 'morgan';

import checkAccessToken from './middlewares';
import { mock } from '../mock/france-connect';
import getRevenuFiscalDeReference from './controllers';

if (process.env.LOCAL_LOOP === 'true') {
  mock();
}

const app = express();
const port = process.env.PORT || '4000';

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', checkAccessToken);

app.get('/revenu-fiscal-de-reference', getRevenuFiscalDeReference);

app.set('port', port);

const server = app.listen(port);

export default server;
