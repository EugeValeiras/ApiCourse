'use strict';

import * as express from 'express';
import UserDAO from './user.dao';

import {S3Uploader} from '../../class/S3/S3.class';

export class UserController {

  static getAll(req: express.Request, res: express.Response) {
    UserDAO
      ['getAll']()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json(error));
  }

  static createNew(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _user = req.body;
    _user.provider = 'local';

    UserDAO
      ['createNew'](_user)
      .then(user => {
        req.user = user._doc;
        next();
      })
      .catch(error => res.status(400).json(error));
  }

  static removeById(req: express.Request, res: express.Response) {
    const _id = req.params.id;

    UserDAO
      ['removeById'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static uploadProfileImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userId = req.user._id;
    const file = req['files'].file;

    S3Uploader.uploadLocalFile(file.path, `profile/${userId}`, {CacheControl: 'max-age=31536000'})
      .then(result => {
        UserDAO
          ['updateOne'](userId, {'profileImageUrl': result['Location']})
          .then(() => next())
          .catch(dbError => res.status(400).json(dbError));
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  }

  static uploadCoverImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userId = req.user._id;
    const file = req['files'].file;
    S3Uploader.uploadLocalFile(file.path, `cover/${userId}`, {CacheControl: 'max-age=31536000'})
      .then(result => {
        UserDAO
          ['updateOne'](userId, {'coverImageUrl': result['Location']})
          .then((user) => next())
          .catch(dbError => res.status(400).json(dbError));
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  }

  static getProfileImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userId = req.params.id;
    S3Uploader.getImage(`profile/${userId}`, res)
      .then(() => {
        return res.end();
      })
      .catch(() => {
        S3Uploader.getImage(`profile/default`, res)
          .then(() => {
            return res.end();
          })
          .catch(defaultError => {
            next();
          });
      });
  }

  static getCoverImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userId = req.params.id;
    S3Uploader.getImage(`cover/${userId}`, res)
      .then(() => {
        return res.end();
      })
      .catch(() => {
        S3Uploader.getImage(`cover/default`, res)
          .then(() => {
            return res.end();
          })
          .catch(defaultError => {
            return res.status(500).json({
              error: defaultError
            });
          });
      });
  }

  static search(req: express.Request, res: express.Response, next: express.NextFunction) {
    const searchText = req.query.search;

    UserDAO
      ['getAll'](
      {'code': {'$regex': searchText, '$options': 'i'}},
      {'name': {'$regex': searchText, '$options': 'i'}}
    )
      .then(courses => res.status(200).json(courses))
      .catch(error => res.status(400).json(error));
  }

}
