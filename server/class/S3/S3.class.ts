import * as AWS from 'aws-sdk';

import * as fs from 'fs';
const s3Config = require('../../constants/s3.json')[process.env.NODE_ENV || 'default'];

AWS.config.update({
  accessKeyId: s3Config.accessKeyId,
  secretAccessKey: s3Config.secretAccessKey
});

const S3 = new AWS.S3();

import * as request from 'request-promise';

export class S3Uploader {

  static uploadFileFromUrl(url, key, acl?) {
    return new Promise((resolve, reject) => {
      request(url, {encoding: null})
        .then(data => {
          this.uploadFile(data, key)
            .then(result => {
              resolve(result);
            })
            .catch(err => {
              reject(err);
            });
        }).catch(requestError => {
        reject(requestError);
      });
    });
  }

  static uploadFile(data, key, options = {}, acl?) {
    return new Promise((resolve, reject) => {
      const params = {
        ...options,
        Bucket: s3Config.bucket,
        Key: key,
        Body: data,
        ACL: acl ? acl : 'public-read'
      };

      S3.upload(params, function (error, result) {
        if (error) {
          console.log('ERROR MSG: ', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  static uploadLocalFile(filePath, key, options = {}) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (readFileError, data) => {
        if (readFileError) {
          return reject(readFileError);
        }

        S3Uploader.uploadFile(data, key, options)
          .then(result => {
            return resolve(result);
          })
          .catch(uplaodError => {
            return reject(uplaodError);
          });
      });
    });
  }

  static getImage(key, res) {
    return S3Uploader.getFile(key, res, 'image/*');
  }

  static getFile(key, res, contentType?) {
    return new Promise((resolve, reject) => {
      const s3Params = {
        Bucket: s3Config.bucket,
        Key: key,
      };

      if (contentType && !res.finished) {
        res.setHeader('Content-Type', contentType );
      }

      const object = S3.getObject(s3Params);
      object.createReadStream()
        .on('error', (err) => {
          return reject(err);
        })
        .on('end', () => {
          return resolve();
        })
        .pipe(res, {end: false});
    });
  }

  static getFileUrl(key) {
    return new Promise((resolve, reject) => {
      const s3Params = {
        Bucket: s3Config.bucket,
        Key: key,
      };

      S3.getSignedUrl('getObject', s3Params, (err, url) => {
        if (url) {
          resolve(url);
        } else {
          reject();
        }
      });
    });
  }

  constructor() {
  }


}
