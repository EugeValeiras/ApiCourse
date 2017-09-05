import * as express from 'express';

import {UserRoutes} from '../api/user/user.route';
import {AuthRoutes} from '../api/auth/auth.route';

import {ErrorHandler} from '../config/error-handler.config';
import {ProductsRoute} from '../api/products/products.route';

export class Routes {
  static init(app: express.Application, router: express.Router) {

    // UserRoutes.init(router);
    // AuthRoutes.init(router);
    ProductsRoute.init(router);
    ErrorHandler.notFound(router);

    app.use('/', router);
  }
}
