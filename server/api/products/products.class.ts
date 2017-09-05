export class Products {

  private static _instance: Products = new Products();

  private _score: number = 0;
  private productsInit = [
    {name: 'Product #1', cost: 10},
    {name: 'Product #2', cost: 20},
    {name: 'Product #3', cost: 30},
    {name: 'Product #4', cost: 40},
  ];

  private products = [...this.productsInit];

  constructor() {
    if (Products._instance) {
      throw new Error("Error: Instantiation failed: Use Products.getInstance() instead of new.");
    }
    Products._instance = this;
  }

  public static getInstance(): Products {
    if (Products._instance) {
      return Products._instance;
    } else {
      new Products();
      return Products._instance;
    }
  }

  all() {
    return this.products;
  }

  add(product) {
    this.products.push(product);
    return this.products;
  }

  remove(index) {
    this.products.splice(index, 1);
    return this.products;
  }

  reset() {
    this.products = [...this.productsInit];
    return this.products;
  }


}
