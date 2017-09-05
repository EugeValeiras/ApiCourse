'use strict';

import * as express from 'express';

import {AuthService} from './auth.service';
import {FacebookRoute} from './facebook/facebook-auth.route';
import {FacebookAuthController} from './facebook/facebook-auth.controller';
import {LocalAuthController} from './local/local-auth.controller';
import {LocalRoute} from './local/local-auth.route';
import {TwitterAuthController} from './twitter/twitter-auth.controller';
import {TwitterRoute} from './twitter/twitter-auth.route';
import {GoogleRoute} from './google/google-auth.route';
import {GoogleAuthController} from './google/google-auth.controller';

export class AuthRoutes {
  static init(router: express.Router) {

    FacebookAuthController.setup();
    TwitterAuthController.setup();
    GoogleAuthController.setup();
    LocalAuthController.setup();

    FacebookRoute.init(router);
    TwitterRoute.init(router);
    GoogleRoute.init(router);
    LocalRoute.init(router);

    router
      .route('/api/user/me')
      .get(AuthService.needAuthenticate, AuthService.me);

  }
}
