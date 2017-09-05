'use strict';

if (process.env.NEW_RELIC_ENABLED === 'true')
  require('newrelic');

var PORT = process.env.PORT || 3333;

import * as express from 'express';
import * as os from 'os';
import * as http2 from 'spdy';
import * as http from 'http';
import * as fs from 'fs';

import {RoutesConfig} from './config/routes.conf';
import {DBConfig} from './config/db.conf';
import {JWTConf} from './config/jwt.conf';
import {ViewerJSConf} from './config/viewerJS.conf';

import {Routes} from './routes/index';

const app = express();

console.log(`enviroment: ${process.env.NODE_ENV}`);

app.get('*',function(req,res,next){
  if (process.env.ONLY_HTTPS && req.headers['x-forwarded-proto']!='https') {
    res.redirect((process.env.HOSTURL || 'https://localhost:4200') + req.url)
  } else {
    next() /* Continue to other routes if we're not redirecting */
  }
})

RoutesConfig.init(app);
// DBConfig.init();
Routes.init(app, express.Router());
// JWTConf.init(app);
// ViewerJSConf.init(app);

//if (process.env.HEROKU){

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`up and running http @: ${os.hostname()} on port: ${PORT}`);
  });

//} else {
//
//  const opts = {
//    key: fs.readFileSync(__dirname + '/cert/server.key'),
//    cert: fs.readFileSync(__dirname + '/cert/server.crt')
//  };
//
//  http2.createServer(opts, app)
//    .listen(PORT, () => {
//      console.log(`up and running https @: ${os.hostname()} on port: ${PORT}`);
//      console.log(`enviroment: ${process.env.NODE_ENV}`);
//    });
//
//}

