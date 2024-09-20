import { Request } from "express";
import { Document } from "mongoose";
import keyTokenModel from "./models/refreshToken.model";

export interface CustomRequest extends Request {
  objKey: {
    key: string;
    status: boolean;
    permissions: string[];
  };
  user: any;
}
