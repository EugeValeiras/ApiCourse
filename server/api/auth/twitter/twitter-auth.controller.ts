'use strict';

import * as express from 'express';
import * as passport from 'passport';

import {Strategy as TwitterStrategy} from 'passport-twitter';
import User from '../../user/user.dao';
import {AuthService} from '../auth.service';

const config = require('../../../constants/social.json');

export class TwitterAuthController {

  static setup() {
    const clientID = process.env.TWITTER_CLIENT_ID || config.twitter.clientID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET || config.twitter.clientSecret;
    const callback = (process.env.HOSTURL || 'http://localhost:4200') + config.twitter.callbackURL;

    passport.use(new TwitterStrategy({
        consumerKey: clientID,
        consumerSecret: clientSecret,
        callbackURL: callback
      },
      (token, tokenSecret, profile, done) => {
        User.findOne({
          'email': profile.emails[0].value
        }, (err, user) => {

          if (err) {
            return done(err);
          }

          if (user && !user._doc.twiter) {
            user._doc.twitter = profile._json;
            user.provider = user.provider ? user.provider + ';twitter' : 'twitter';

            User.findOneAndUpdate({'email': profile.emails[0].value}, user._doc, (error, nwUser) => {
              return done(err, user);
            });

          } else
          if (!user) {

            user = new User({
              name: profile.displayName,
              username: profile.username,
              role: 'user',
              provider: 'twitter',
              twitter: profile._json
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

  static callback(req: express.Request, res: express.Response) {
    req['redirect'] = true;
    req['redirectUrl'] = '/'
    req.user = req.user._doc;

    AuthService.setTokenCookie(req, res);
  }

}
