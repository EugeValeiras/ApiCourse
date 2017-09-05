'use strict';

import * as express from 'express';
import * as passport from 'passport';
import * as base64url from 'base64-url';

import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import {AuthService} from '../auth.service';

const config = require('../../../constants/social.json');
import User from '../../user/user.dao';

export class GoogleAuthController {

  static setup() {
    const clientID = process.env.GOOGLE_CLIENT_ID || config.google.clientID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || config.google.clientSecret;
    const callback = (process.env.HOSTURL || 'http://localhost:4200') + config.google.callbackURL;

    passport.use(new GoogleStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callback
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({
          'email': profile.emails[0].value
        }, (err, user) => {

          if (err) {
            return done(err);
          }

          if (user && !user._doc.google) {
            user._doc.google = profile._json;
            user.provider = user.provider ? user.provider + ';google' : 'google';

            User.findOneAndUpdate({'email': profile.emails[0].value}, user._doc, (error, nwUser) => {
              return done(err, user);
            });

          } else

          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              role: 'user',
              username: profile.username,
              provider: 'google',
              google: profile._json
            });

            user.save((error, savedUser) => {
              if (error) {
                return done(error);
              }
              done(error, user);
            });

          } else {
            return done(err, user);
          }
        });
      }
    ));
  }

  static callback(req: express.Request, res: express.Response, next: express.NextFunction) {
    req.query = {...req.query, ...JSON.parse(base64url['decode'](req.query.state || {}))};

    req['redirect'] = true;
    req['redirectUrl'] = req.query.redirect || '/';
    req.user = req.user._doc;
    next();
  }

}
