'use strict';

import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as zlib from 'zlib';

export class RoutesConfig {
    static init(application: express.Application): void {

        const _root = process.cwd();
        const _nodeModules = '/node_modules/';
        const _jspmPackages = '/jspm_packages/';
        // const _clientFiles = (process.env.NODE_ENV === 'production') ? '/dist/' : '/client/';
        const _clientFiles = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') ?
          '/dist/' : '/client/';

        application.use(compression({
            level: zlib.Z_BEST_COMPRESSION,
            threshold: '1kb'
        }));

        application.use(express.static(_root + _nodeModules));
        application.use(express.static(_root + _jspmPackages));
        application.use(express.static(_root + _clientFiles));
        application.use(bodyParser.json());
        application.use(cookieParser());
        application.use(morgan('dev'));
        application.use(helmet());
    }
}
