import { asyncHandler } from "./../../utils";
import express from "express";
import AccessController from "../../controllers/access.controller";
import { authentication } from "../../auth/checkAuth";

const accessRouter = express.Router();

accessRouter.post("/shop/signUp", asyncHandler(AccessController.signUp));

accessRouter.post("/shop/login", asyncHandler(AccessController.login));

accessRouter.use(asyncHandler(authentication));

accessRouter.post("/shop/logout", asyncHandler(AccessController.logout));

export default accessRouter;
