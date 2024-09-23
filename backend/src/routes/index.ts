"use strict";

import express from "express";
const router = express.Router();
import accessRouter from "./access";
import productRouter from "./product";
import { apiKey, permission } from "../auth/checkAuth";
import { CustomRequest } from "../interface";

// // check apiKey

// router.use((req, res, next) => apiKey(req as CustomRequest, res, next));

// // check permissions

// router.use((req, res, next) =>
//   permission("READ")(req as CustomRequest, res, next)
// );

router.use("/v1/api/auth", accessRouter);
router.use("/v1/api/products", productRouter);

export default router;
