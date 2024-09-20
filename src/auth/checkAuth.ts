import JWT from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { HEADER } from "../constants";
import { findById } from "../services/apiKey.service";
import { CustomRequest } from "../interface";
import { UnauthorizedError } from "../core/error.response";
import blacklistTokenModel from "../models/backlistToken.model";

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

export const authentication = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract Authorization header and access token
  const authorizationHeader = req.headers[HEADER.AUTHORIZATION];
  const accessToken =
    typeof authorizationHeader === "string"
      ? authorizationHeader.split(" ")[1]
      : undefined;

  if (!accessToken) {
    throw new UnauthorizedError("Missing AccessToken!");
  }

  // Check if the token is blacklisted
  const blacklistedToken = await blacklistTokenModel.findOne({
    token: accessToken,
  });

  if (blacklistedToken) {
    throw new UnauthorizedError("AccessToken has been blacklisted.");
  }

  // Verify the access token and extract the payload
  JWT.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET as string,
    (err, user) => {
      if (err) throw new UnauthorizedError(err.message);

      req.user = user;
      next();
    }
  );
};
