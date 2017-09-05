'use strict';

import * as express from 'express';
import * as passport from 'passport';

import {TwitterAuthController} from './twitter-auth.controller';

export class TwitterRoute {

  static init(router: express.Router): express.Router {

    router
      .get('/api/authenticate/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/register',
        session: false
      }), TwitterAuthController.callback);

    router
      .get('/api/authenticate/twitter', passport.authenticate('twitter', {
        failureRedirect: '/register',
        session: false
      }));

    return router;

  }
}
