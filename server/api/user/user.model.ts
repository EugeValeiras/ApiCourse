'use strict';

import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

const authTypes = ['github', 'twitter', 'facebook', 'google'];


const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true },
  profileImageUrl: {
    type: String,
    default: 'https://s3-us-west-2.amazonaws.com/elasticbeanstalk-us-west-2-026017025140/Reacademico/profile.default'
  },
  coverImageUrl: {
    type: String,
    default: 'https://s3-us-west-2.amazonaws.com/elasticbeanstalk-us-west-2-026017025140/Reacademico/cover.default'
  },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  language: String,
  events: [{
    name: String
  }]
});

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }

    return email.length;
  }, { message: 'Email cannot be blank', type: 'blank' });

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }

    return hashedPassword.length;
  }, { message: 'Password cannot be blank', type: 'blank' });

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    this.constructor.findOne({email: value}, (err, user) => {

      if (err) {
        throw err;
      }

      if (user) {

        if (this.id === user.id) {
          return respond(true);
        }

        return respond(false);
      }
      respond(true);
    });
  }, { message: 'The specified email address is already in use.', type: 'used' });

const validatePresenceOf = (value) => {
  return value && value.length;
};

UserSchema.method('authenticate', function (plainText: string): boolean {
  return this.encryptPassword(plainText) === this.hashedPassword;
});

UserSchema.method('makeSalt', function(): string {
  return crypto.randomBytes(16).toString('base64');
});

UserSchema.method('encryptPassword', function (password: string): string {
  if (!password || !this.salt) {
    return '';
  }
  const salt = new Buffer(this.salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('base64');
});

/**
 * Pre-saveHandler hook
 */
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) {
      return next();
    }

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });

export default (UserSchema);

