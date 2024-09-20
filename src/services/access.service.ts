import bcrypt from "bcrypt";
import shopModel from "../models/shop.model";
import jwt from "jsonwebtoken";
import { createTokenPair, createAccessToken } from "../auth/authUtils";
import { ROLE_SHOP } from "../constants";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../core/error.response";
import refreshTokenModel from "../models/refreshToken.model";
import blacklistTokenModel from "../models/backlistToken.model";
import { Types } from "mongoose";

class AccessService {
  // Refresh the access token
  static refreshToken = async (refreshToken: string) => {
    // Decode the refresh token to get user ID
    const decoded = jwt.decode(refreshToken) as { shopId: string };
    const userId = decoded.shopId;

    // Find the refresh token in the database
    const storedToken = await refreshTokenModel.findOne({
      user: userId,
      refreshToken,
    });

    if (!storedToken) {
      throw new NotFoundError("Refresh token not found!");
    }

    // Verify the token is still valid
    const decodeUser = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;
    if (userId !== decodeUser.shopId) {
      throw new UnauthorizedError("Invalid userId!");
    }

    // Check if the token is expired
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError("Refresh token expired!");
    }

    // Generate new token pair
    const payload = {
      shopId: decodeUser.shopId,
      roles: decodeUser.roles,
      email: decodeUser.email,
    };

    // Generate a new access token
    const accessToken = createAccessToken({
      payload,
      accessKey: process.env.JWT_ACCESS_SECRET as string,
    });

    return accessToken;
  };

  static signUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const shopHolder = await shopModel.findOne({ email }).lean();
    if (shopHolder) {
      throw new ConflictError("Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [ROLE_SHOP.SHOP],
    });

    if (!newShop) {
      throw new ConflictError("Create shop failed!");
    }

    return {
      shop: newShop,
    };
  };

  static login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const shopHolder = await shopModel.findOne({ email }).lean();

    if (!shopHolder) {
      throw new NotFoundError("Shop not found!");
    }

    if (!bcrypt.compareSync(password, shopHolder.password)) {
      throw new UnauthorizedError("Password is incorrect!");
    }

    const tokens = createTokenPair({
      payload: { shopId: shopHolder._id, roles: shopHolder.roles, email },
      accessKey: process.env.JWT_ACCESS_SECRET as string,
      refreshKey: process.env.JWT_REFRESH_SECRET as string,
    });

    if (!tokens) {
      throw new ConflictError("Create tokens failed!");
    }

    // Save refresh token to database
    await refreshTokenModel.create({
      user: shopHolder._id,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    });

    return {
      shop: shopHolder,
      tokens,
    };
  };

  static logout = async ({
    accessToken,
    shopId,
  }: {
    accessToken: string;
    shopId: string;
  }) => {
    // Find the refresh token in the database
    const tokenDoc = await refreshTokenModel.findOne({
      user: new Types.ObjectId(shopId),
    });

    if (!tokenDoc) {
      throw new NotFoundError("Refresh token not found!");
    }

    // Add the refresh token to the blacklist
    await blacklistTokenModel.create({
      token: tokenDoc.refreshToken,
      expiresAt: tokenDoc.expiresAt, // Blacklist until the original expiration
    });

    // Decode the access token to get its expiration
    const decodedToken = jwt.decode(accessToken) as { exp?: number };

    // Set expiration for the access token in blacklist
    const expiresAt = decodedToken.exp
      ? new Date(decodedToken.exp * 1000)
      : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // Default to 2 days if no exp

    // Add the access token to the blacklist
    await blacklistTokenModel.create({
      token: accessToken,
      expiresAt,
    });

    // Remove the refresh token from the refreshToken collection
    await refreshTokenModel.deleteOne({ _id: tokenDoc._id });

    return { message: "Logged out successfully!" };
  };

  static getMe = async ({ id }: { id: string }) => {
    const shopHolder = await shopModel
      .findOne({ _id: new Types.ObjectId(id) })
      .lean();

    if (!shopHolder) {
      throw new NotFoundError("Shop not found!");
    }

    const shopHoderReduce = {
      _id: shopHolder._id,
      name: shopHolder.name,
      email: shopHolder.email,
      roles: shopHolder,
    };

    return {
      message: "Get me successfully",
      shop: shopHoderReduce,
    };
  };
}

export default AccessService;
