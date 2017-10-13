'use strict';

import * as express from 'express';
import {Products} from './products.class';

export class ProductsController {

  static getAll(req: express.Request, res: express.Response) {
    const products = Products.getInstance();
    res.status(200).json(products.all());
  }

  static getOne(req: express.Request, res: express.Response) {
    const products = Products.getInstance();
    res.status(200).json(products.get(req.params.id));
  }

  static addOne(req: express.Request, res: express.Response) {
    const products = Products.getInstance();
    const product = req.body;
    console.log(product);
    res.status(200).json(products.add(product));
  }

  static remove(req: express.Request, res: express.Response) {
    const index = req.body;
    const products = Products.getInstance()
    res.status(200).json(products.remove(index));
  }

  static reset(req: express.Request, res: express.Response) {
    const products = Products.getInstance();
    res.status(200).json(products.reset());
  }
}
