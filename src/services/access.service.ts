import bcrypt from "bcrypt";
import shopModel from "../models/shop.model";
import KeyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
import { ROLE_SHOP } from "../constants";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../core/error.response";
import { generatePairKey } from "../utils";

class AccessService {
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

    const { privateKey, publicKey } = generatePairKey({
      modulusLength: 4096,
      algo: "rsa",
    });

    const tokens = createTokenPair({
      payload: { shopID: newShop._id, roles: newShop.roles, email },
      privateKey,
    });

    if (!tokens) {
      throw new ConflictError("Create tokens failed!");
    }

    const keyToken = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyToken) {
      throw new ConflictError("Create key token failed!");
    }

    return {
      shop: newShop,
      tokens,
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

    const { privateKey, publicKey } = generatePairKey({
      modulusLength: 4096,
      algo: "rsa",
    });

    const tokens = createTokenPair({
      payload: { shopID: shopHolder._id, roles: shopHolder.roles, email },
      privateKey,
    });

    if (!tokens) {
      throw new ConflictError("Create tokens failed!");
    }

    const keyToken = await KeyTokenService.updateKeyToken({
      userId: shopHolder._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyToken) {
      throw new ConflictError("Create key token failed!");
    }

    return {
      shop: shopHolder,
      tokens,
    };
  };

  static logout = async ({ keyStore }: any) => {
    const deleteKey = await KeyTokenService.deleteKeyToken(keyStore._id);

    return deleteKey;
  };

  static getMe = async (shopID: string) => {
    const shopHolder = await shopModel.findOne({ _id: shopID }).lean();

    if (!shopHolder) {
      throw new NotFoundError("Shop not found!");
    }

    return {
      message: "Get me successfully",
      shop: shopHolder,
    };
  };
}

export default AccessService;
