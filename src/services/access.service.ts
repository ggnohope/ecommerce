"use strict";

import bcrypt from "bcrypt";
import shopModel from "../models/shop.model";
import crypt from "crypto";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

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
    try {
      const shopHolder = await shopModel.findOne({ email }).lean();

      if (shopHolder) {
        return {
          code: "xxx",
          message: "Shop already registered",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (!newShop) {
        return {
          code: "xxx",
          message: "Sign up failed",
          status: "error",
        };
      }

      const { privateKey, publicKey } = crypt.generateKeyPairSync("rsa", {
        modulusLength: 4096,
      });
    } catch (error) {
      return {
        code: "xxx",
        message: (error as Error).message,
        status: "error",
      };
    }
  };
  static login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const shopHolder = await shopModel.findOne({ email }).lean();

      if (!shopHolder) {
        return {
          code: "xxx",
          message: "Shop not found",
          status: "error",
        };
      }

      console.log("[P]::login::", shopHolder.email, shopHolder.password);

      if (password !== shopHolder.password) {
        return {
          code: "xxx",
          message: "Password is incorrect",
          status: "error",
        };
      }

      return {
        code: "xxx",
        message: "Login successfully",
        shop: shopHolder,
        status: "success",
      };
    } catch (error) {
      return {
        code: "xxx",
        message: (error as Error).message,
        status: "error",
      };
    }
  };
  static getMe = async (shopID: string) => {
    try {
      const shopHolder = await shopModel.findOne({ _id: shopID }).lean();

      if (!shopHolder) {
        return {
          code: "xxx",
          message: "Shop not found",
          status: "error",
        };
      }

      return {
        code: "xxx",
        message: "Get me successfully",
        shop: shopHolder,
        status: "success",
      };
    } catch (error) {
      return {
        code: "xxx",
        message: (error as Error).message,
        status: "error",
      };
    }
  };
}

export default AccessService;
