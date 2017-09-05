'use strict';

import * as express from 'express';

const jwtConst = require('../constants/jwt.json');

export class JWTConf {
  static init(application: express.Application): void {
    application.set('superSecret', jwtConst.secret);
  }

};
