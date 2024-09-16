import { Request } from "express";
import { Document } from "mongoose";
import keyTokenModel from "./models/keyToken.model";

export interface CustomRequest extends Request {
  objKey: {
    key: string;
    status: boolean;
    permissions: string[];
  };
  keyStore: any;
}
