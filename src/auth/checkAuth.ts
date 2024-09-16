import JWT from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { HEADER } from "../constants";
import { findById } from "../services/apiKey.service";
import { CustomRequest } from "../interface";
import { NotFoundError, UnauthorizedError } from "../core/error.response";
import KeyTokenService from "../services/keyToken.service";
import { Types } from "mongoose";

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
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new UnauthorizedError("Invalid request!");

  const keyStore = await KeyTokenService.findKeyTokenByUserId(
    new Types.ObjectId(userId as string)
  );
  if (!keyStore) throw new NotFoundError("Not found key!");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken || Array.isArray(accessToken))
    throw new UnauthorizedError("Invalid request!");

  const decodeUser = JWT.verify(
    accessToken,
    keyStore.publicKey
  ) as JWT.JwtPayload;
  if (userId !== decodeUser.shopID)
    throw new UnauthorizedError("Invalid userId!");

  req.keyStore = keyStore;
  return next();
};
