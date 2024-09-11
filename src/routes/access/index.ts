import { asyncHandler } from "./../../auth/checkAuth";
import express from "express";
import AccessController from "../../controllers/access.controller";

const accessRouter = express.Router();

accessRouter.post("/shop/signUp", asyncHandler(AccessController.signUp));

export default accessRouter;
