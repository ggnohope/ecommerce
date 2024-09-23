import { Created } from "../core/success.response";
import { Response } from "express";
import { ProductFactory } from "../services/product.service";
import { CustomRequest } from "../interface";

class ProductController {
  static createProduct = async (req: CustomRequest, res: Response) => {
    const { shopId } = req.user;

    const createProductResult = await ProductFactory.createProduct({
      type: req.body.category,
      payload: { ...req.body, shop: shopId },
    });
    new Created(201, "Create product successfully!", createProductResult).send(
      res
    );
  };
}

export default ProductController;
