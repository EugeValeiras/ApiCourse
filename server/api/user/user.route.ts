'use strict';

import * as express from 'express';
import {UserController} from './user.controller';
import {AuthService} from '../auth/auth.service';

import * as multipart from 'connect-multiparty';
const multipartMiddleware = multipart();

export class UserRoutes {
  static init(router: express.Router) {
    router
      .route('/api/user')
      .get(AuthService.needAuthenticate, UserController.getAll)
      .post(UserController.createNew, AuthService.setTokenCookie);

    router
      .route('/api/user/search')
      .get(UserController.search);

    router
      .route('/api/user/image/profile/:id')
      .get(UserController.getProfileImage);

    router
      .route('/api/user/image/cover/:id')
      .get(UserController.getCoverImage);

    router
      .route('/api/user/:id')
      .delete(UserController.removeById);

    router
      .route('/api/me/uploadProfileImage')
      .post(AuthService.needAuthenticate,
        multipartMiddleware,
        UserController.uploadProfileImage,
        AuthService.updateUser,
        AuthService.setTokenCookie);

    router
      .route('/api/me/uploadCoverImage')
      .post(AuthService.needAuthenticate,
        multipartMiddleware,
        UserController.uploadCoverImage,
        AuthService.updateUser,
        AuthService.setTokenCookie);
  }
}
