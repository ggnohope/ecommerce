"use strict";

import bcrypt from "bcrypt";
import shopModel from "../models/shop.model";
import crypt from "crypto";
import KeyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
import { ROLE_SHOP } from "../constants";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../core/error.response";

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

    const { privateKey, publicKey } = crypt.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    const keyToken = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
    });

    if (!keyToken) {
      throw new ConflictError("Create key token failed!");
    }

    const tokens = createTokenPair({
      payload: { shopID: newShop._id, roles: newShop.roles, email },
      privateKey,
    });

    if (!tokens) {
      throw new ConflictError("Create token failed!");
    }

    return {
      code: "SUCCESS",
      message: "Sign up successfully",
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

    if (password !== shopHolder.password) {
      throw new UnauthorizedError("Password is incorrect!");
    }

    return {
      message: "Login successfully",
      shop: shopHolder,
    };
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
