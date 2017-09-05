'use strict';

import * as express from 'express';
import UserDao from '../user/user.dao';


import * as jwt from 'jsonwebtoken';
const jwtConst = require('../../constants/jwt.json');


export class AuthService {

  static needAuthenticate(req: express.Request, res: express.Response, next: express.NextFunction) {

    const token = req.cookies.token || req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, jwtConst.secret, function (err, decodedUser) {
        if (err) {
          return res.json({
            success: false,
            noToken: true,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, saveHandler to request for use in other routes
          req.user = decodedUser;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(200).send({
        success: false,
        noToken: true,
        message: 'No token provided.'
      });

    }
  }

  static me(req: express.Request, res: express.Response, next: express.NextFunction) {
    return res.json(req.user);

  }

  static setTokenCookie(req: express.Request, res: express.Response) {
    if (!req.user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    const token = jwt.sign(req.user, jwtConst.secret, {});
    res.cookie('token', token);

    if (req['redirect']) {
      return res.status(200).redirect(req['redirectUrl'] ? req['redirectUrl'] : '/');
    }

    if (req['redirectUrl']) {
      return res.status(200).json({
        redirectPath: req['redirectUrl'],
        token
      });
    }

    return res.status(200).json({token});
  }

  static updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    UserDao
      ['getOneByQuery']({_id: req.user._id})
      .then(user => {
        req.user = user;
        next();
      });
  }

  static authActions(req: express.Request, res: express.Response, next: express.NextFunction) {
    const promises = [];

    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        switch (key) {
          case 'join': {
            console.log('Trigger Action JOIN', req.query[key], req.user._id);
            // promises.push(CourseDao.acceptRequestMembership(req.query[key], req.user._id));
          }
        }
      }
    }

    Promise.all(promises).then(() => {
      next();
    });

  }

}
