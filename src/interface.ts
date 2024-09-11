import { Request } from "express";

export interface CustomRequest extends Request {
  objKey: {
    key: string;
    status: boolean;
    permissions: string[];
  };
}
