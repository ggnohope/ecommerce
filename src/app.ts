import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";

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

export default app;
