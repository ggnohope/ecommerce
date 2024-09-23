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

export interface ProductInterface {
  name: string;
  price: number;
  category: string;
  quantity: number;
  shop: string;
  images: string[];
  description: string;
  attributes: object;
}
