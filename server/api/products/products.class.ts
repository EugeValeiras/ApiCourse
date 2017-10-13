export class Products {

  private static _instance: Products = new Products();

  private _score: number = 0;
  private productsInit = [
    {id: '1', name: 'Banana', description: 'Banana Loca', price: 10},
    {id: '2', name: 'Apple', description: 'Apple Inc', price: 10000},
    {id: '3', name: 'Orange', description: 'La naranja mecanica', price: 5},
    {id: '4', name: 'lemon', description: 'Acid Lemon', price: 1},
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

  get(id) {
    return this.products.find(product => product.id == id);
  }

  add(product) {
    const ids = this.products.map(prod => prod.id);
    product.id = Math.max.apply(null, ids) + 1;
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
