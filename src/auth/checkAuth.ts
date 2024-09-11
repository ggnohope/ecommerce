import { NextFunction, Request, Response } from "express";
import { HEADER } from "../constants";
import { findById } from "../services/apiKey.service";
import { CustomRequest } from "../interface";

export const apiKey = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const objKey = await findById(key);

    if (!objKey) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.objKey = objKey;
    next();
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const permission = (permission: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { objKey } = req;
      if (!objKey.permissions.includes(permission)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };
};

export const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
