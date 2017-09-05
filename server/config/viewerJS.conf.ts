'use strict';

import * as express from 'express';
const path = require('path');

export class ViewerJSConf {
  static init(application: express.Application): void {
    const _root = process.cwd();
    application.use('/viewerjs', express.static(path.join(_root, '/node_modules/viewerjs/dist/')));
  }
}
