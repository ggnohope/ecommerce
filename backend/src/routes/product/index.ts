import { asyncHandler } from "./../../utils";
import express from "express";
import { authentication } from "../../auth/checkAuth";
import ProductController from "../../controllers/product.controller";

const productRouter = express.Router();

productRouter.use(asyncHandler(authentication));

productRouter.post("/create", asyncHandler(ProductController.createProduct));

export default productRouter;
