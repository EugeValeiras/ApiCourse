'use strict';

import * as express from 'express';
import * as passport from 'passport';
import * as base64url from 'base64-url';
import * as _ from 'lodash';

import {FacebookAuthController} from './facebook-auth.controller';
import {AuthService} from '../auth.service';

const config = require('../../../constants/social.json');

export class FacebookRoute {

  static init(router: express.Router) {

    router
      .get('/api/authenticate/facebook/callback',
        passport.authenticate('facebook', {
          failureRedirect: '/register',
          session: false
        }),
        FacebookAuthController.callback,
        AuthService.authActions,
        AuthService.setTokenCookie);

    router
      .get('/api/authenticate/facebook',
        (req, res, next) => {
          const state = _.pickBy({
            redirect: (req.query.next || req.headers.referer),
            ...(req.query)
          }, (val) => _.identity(val) !== undefined);

          passport.authenticate('facebook', {
              scope: ['email', 'user_about_me'],
              failureRedirect: '/register',
              session: false,
              state: base64url['encode'](JSON.stringify(state))
            }
          )(req, res, next);
        });

    return router;

  }
}
