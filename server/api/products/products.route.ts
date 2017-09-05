'use strict';

import * as express from 'express';
import {ProductsController} from './products.controller';

export class ProductsRoute {
  static init(router: express.Router) {

    router
      .route('/api/product')
      .get(ProductsController.getAll)
      .post(ProductsController.addOne)
      .delete(ProductsController.remove)

    router
      .route('/api/product/reset')
      .get(ProductsController.reset)
  }
}
