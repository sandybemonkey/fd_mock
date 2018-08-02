import express from 'express';
import logger from 'morgan';

import indexRouter from './routes/index';
import checkAccessToken from './services/franceConnect';

const app = express();
const port = process.env.PORT || '4000';

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', checkAccessToken);
app.use('/', indexRouter);

app.set('port', port);

const server = app.listen(port);

export default server;
