'use strict';

import * as express from 'express';
import {AuthService} from '../auth.service';
import * as passport from 'passport';
import * as base64url from 'base64-url';
import * as _ from 'lodash';

import {GoogleAuthController} from './google-auth.controller';

export class GoogleRoute {
  static init(router: express.Router) {

    router
      .get('/api/authenticate/google/callback',
        passport.authenticate('google', {
          failureRedirect: '/register',
          session: false
        }),
        GoogleAuthController.callback,
        AuthService.authActions,
        AuthService.setTokenCookie);

    router
      .get('/api/authenticate/google',
        (req, res, next) => {
          const state = _.pickBy({
            redirect: (req.query.next || req.headers.referer),
            ...(req.query)
          }, (val) => _.identity(val) !== undefined);

          passport.authenticate('google', {
            failureRedirect: '/register',
            scope: ['profile', 'email'],
            session: false,
            state: base64url['encode'](JSON.stringify(state))
          })(req, res, next);
        });

    return router;
  }
}
