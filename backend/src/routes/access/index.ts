import { asyncHandler } from "./../../utils";
import express from "express";
import AccessController from "../../controllers/access.controller";
import { authentication } from "../../auth/checkAuth";

const accessRouter = express.Router();

accessRouter.post(
  "/auth/refresh-token",
  asyncHandler(AccessController.refreshToken)
);

accessRouter.post("/auth/signup", asyncHandler(AccessController.signUp));

accessRouter.post("/auth/login", asyncHandler(AccessController.login));

accessRouter.use(asyncHandler(authentication));

accessRouter.post("/auth/logout", asyncHandler(AccessController.logout));

accessRouter.get("/auth/me", asyncHandler(AccessController.getMe));

export default accessRouter;
