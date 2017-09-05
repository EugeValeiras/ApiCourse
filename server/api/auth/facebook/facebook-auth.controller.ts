'use strict';

import * as express from 'express';
import * as passport from 'passport';
import * as base64url from 'base64-url';

import {S3Uploader} from '../../../class/S3/S3.class';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import User from '../../user/user.dao';
import {FBClass} from './fb.class';

const config = require('../../../constants/social.json');
const ObjectId = require('mongoose').Types.ObjectId;

export class FacebookAuthController {

  static setup() {
    const clientID = process.env.FACEBOOK_CLIENT_ID || config.facebook.clientID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET || config.facebook.clientSecret;
    const callback = (process.env.HOSTURL || 'http://localhost:4200') + config.facebook.callbackURL;

    passport.use(new FacebookStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callback,
        profileFields: ['email', 'displayName', 'photos']
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({
            'email': profile.emails[0].value
          },

          (err, userModel) => {
            if (err) {
              return done(err);
            }

            let user = userModel ? userModel.toObject() : userModel;
            profile._json.accessToken = accessToken;

            if (user && !user.facebook) {
              user.facebook = profile._json;
              user.provider = user.provider ? user.provider + ';facebook' : 'facebook';

              User.findOneAndUpdate({'email': profile.emails[0].value}, user, (error, nwUser) => {
                return done(err, user);
              });

            } else if (!user) {
              const userId = ObjectId();

              let profileImage;
              let promise;

              if (profile.photos && profile.photos.length > 0) {
                promise = new Promise((resolve, reject) => {
                  FBClass.getProfileImageUrl(profile._json.id)
                    .then(facebookProfileImageUrl => {
                      S3Uploader.uploadFileFromUrl(facebookProfileImageUrl, `profile.${userId}`)
                        .then((result) => {
                          profileImage = result['Location'];
                          resolve();
                        });
                    })
                    .catch(errorS3 => {
                      console.error(errorS3);
                      reject();
                    });
                });
              }

              Promise.all([promise])
                .then(() => {
                  user = new User({
                    _id: userId,
                    name: profile.displayName,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
                    role: 'user',
                    provider: 'facebook',
                    profileImageUrl: profileImage,
                    facebook: profile._json
                  });
                  user.save((error, savedUserModel) => {
                    if (error) {
                      return done(error);
                    }
                    done(error, savedUserModel);
                  })
                    .catch(facebookError => {
                      console.error(facebookError);
                    });
                });
            } else {
              return done(err, userModel);
            }
          });
      }
    ));
  }

  static callback(req: express.Request, res: express.Response, next: express.NextFunction) {
    //decode State
    req.query = {...req.query, ...JSON.parse(base64url['decode'](req.query.state || {}))};

    req['redirect'] = true;
    req['redirectUrl'] = req.query.redirect || '/';
    req.user = req.user._doc;
    next();
  }

}
