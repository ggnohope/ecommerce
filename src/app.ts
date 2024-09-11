import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import { ErrorResponse } from "./core/error.response";

dotenv.config();
const app = express();

// init middleware

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// init db

require("./dbs/init.mongodb");

// init routes

app.use("/", router);

// handle errors

app.use(
  (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      code: err.statusCode || 500,
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;
