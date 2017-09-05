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
app.options('*', cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

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

