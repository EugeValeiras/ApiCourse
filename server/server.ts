'use strict';

if (process.env.NEW_RELIC_ENABLED === 'true')
  require('newrelic');

var PORT = process.env.PORT || 3333;

import * as express from 'express';
import * as os from 'os';
import * as http from 'http';
import * as cors from 'cors';

import {RoutesConfig} from './config/routes.conf';

import {Routes} from './routes/index';

const app = express();
app.options(cors());

console.log(`enviroment: ${process.env.NODE_ENV}`);

app.get('*', function (req, res, next) {
  if (process.env.ONLY_HTTPS && req.headers['x-forwarded-proto'] != 'https') {
    res.redirect((process.env.HOSTURL || 'https://localhost:4200') + req.url)
  } else {
    next();
  }
})

RoutesConfig.init(app);
Routes.init(app, express.Router());

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`up and running http @: ${os.hostname()} on port: ${PORT}`);
});

