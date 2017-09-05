'use strict';

import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import userSchema from './user.model';
import * as _ from 'lodash';

let User;

userSchema.static('getAll', (query?) => {
  return new Promise((resolve, reject) => {
    const _query = query || {};

    User
      .find(_query)
      .exec((err, users) => {
        err ? reject(err)
          : resolve(_.map(users, (user) => user['toObject']()));
      });
  });
});

userSchema.static('getOneByQuery', (query) => {
  return new Promise((resolve, reject) => {
    const _query = query;

    User
      .findOne(_query)
      .exec((err, user) => {
        err ? reject(err)
          : resolve(user.toObject());
      });
  });
});

userSchema.static('updateOne', (userId, query) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(query)) {
      return reject(new TypeError('query is not a valid Object.'));
    }

    if (!_.isString(userId)) {
      return reject(new TypeError('userId is not a valid String.'));
    }

    User
      .update(
        {_id: userId},
        {$set: query},
        {upsert: true}
      ).exec((err, updated) => {
      err ? reject(err) : resolve(updated);
    });
  });
});

userSchema.static('createNew', (user) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(user)) {
      return reject(new TypeError('Is not a valid object.'));
    }

    const _something = new User(user);

    _something.save((err, saved) => {
      err ? reject(err)
        : resolve(saved);
    });
  });
});

userSchema.static('removeById', (id) => {
  return new Promise((resolve, reject) => {
    if (!_.isString(id)) {
      return reject(new TypeError('Id is not a valid string.'));
    }

    User
      .findByIdAndRemove(id)
      .exec((err, deleted) => {
        err ? reject(err)
          : resolve();
      });
  });
});

userSchema.static('addEvent', (userId, event) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(event)) {
      return reject(new TypeError('event is not a valid object.'));
    }

    User
      .update(
        {_id: userId},
        {$push: {events: event}}
      ).exec((err, deleted) => {
      err ? reject(err)
        : resolve();
    });
  });
});

User = mongoose.model('user', userSchema);

export default User;
