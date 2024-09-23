import { asyncHandler } from "./../../utils";
import express from "express";
import AccessController from "../../controllers/access.controller";
import { authentication } from "../../auth/checkAuth";

const accessRouter = express.Router();

accessRouter.post(
  "/refresh-token",
  asyncHandler(AccessController.refreshToken)
);

accessRouter.post("/signup", asyncHandler(AccessController.signUp));

accessRouter.post("/login", asyncHandler(AccessController.login));

accessRouter.use(asyncHandler(authentication));

accessRouter.post("/logout", asyncHandler(AccessController.logout));

accessRouter.get("/me", asyncHandler(AccessController.getMe));

export default accessRouter;
