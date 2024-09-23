import { Types } from "mongoose";
import {
  ProductModel,
  ClothingModel,
  ElectronicModel,
  FurnitureModel,
} from "../models/product.model";
import { ConflictError, NotFoundError } from "../core/error.response";
import { ProductInterface } from "../interface";

type ProductConstructor<T extends Product> = new (...args: any[]) => T;

class ProductFactory {
  static productRegistry: { [key: string]: ProductConstructor<Product> } = {};

  static registerProduct({
    name,
    product,
  }: {
    name: string;
    product: ProductConstructor<Product>;
  }) {
    ProductFactory.productRegistry[name] = product;
  }

  static async createProduct({
    type,
    payload,
  }: {
    type: string;
    payload: ProductInterface;
  }) {
    const ProductClass = ProductFactory.productRegistry[type];
    if (!ProductClass) {
      throw new NotFoundError("Product not found!");
    }

    const productInstance = new ProductClass(payload);
    return await productInstance.createProduct();
  }
}

class Product {
  name: string;
  price: number;
  category: string;
  quantity: number;
  shop: string;
  images: string[];
  description: string;
  attributes: object;
  constructor({
    name,
    price,
    category,
    quantity,
    shop,
    images,
    description,
    attributes,
  }: ProductInterface) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.quantity = quantity;
    this.shop = shop;
    this.images = images;
    this.description = description;
    this.attributes = attributes;
  }

  async createProduct({ id }: { id?: Types.ObjectId } = {}) {
    const newProduct = await ProductModel.create({ ...this, _id: id });
    if (!newProduct) {
      throw new ConflictError("Create Product failed!");
    }

    return newProduct;
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({ ...this.attributes });
    if (!newClothing) {
      throw new ConflictError("Create Clothing failed!");
    }

    const newProduct = await super.createProduct({ id: newClothing._id });
    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({ ...this.attributes });
    if (!newElectronic) {
      throw new ConflictError("Create Electronic failed!");
    }

    const newProduct = await super.createProduct({ id: newElectronic._id });
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({ ...this.attributes });
    if (!newFurniture) {
      throw new ConflictError("Create Furniture failed!");
    }

    const newProduct = await super.createProduct({ id: newFurniture._id });
    return newProduct;
  }
}

ProductFactory.registerProduct({ name: "clothing", product: Clothing });
ProductFactory.registerProduct({ name: "electronic", product: Electronic });
ProductFactory.registerProduct({ name: "furniture", product: Furniture });

export { ProductFactory };
