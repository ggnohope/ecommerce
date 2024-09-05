"use strict";

import express from "express";
const router = express.Router();
import accessRouter from "./access";

router.use("/v1/api", accessRouter);

export default router;
