import { Types } from "mongoose";
import keyTokenModel from "../models/keyToken.model";
import { NotFoundError } from "../core/error.response";

export default class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: Types.ObjectId;
    publicKey: String;
    privateKey: String;
    refreshToken: String;
  }) => {
    const filter = { user: userId };
    const update = {
      publicKey,
      privateKey,
      refreshToken,
      refreshTokensUsed: [],
    };
    const options = { upsert: true, new: true };

    const newKeyToken = await keyTokenModel
      .findOneAndUpdate(filter, update, options)
      .lean();

    return newKeyToken ?? null;
  };

  static updateKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: Types.ObjectId;
    publicKey: String;
    privateKey: String;
    refreshToken: String;
  }) => {
    const existingKeyToken = await keyTokenModel.findOne({ user: userId });

    const { refreshTokensUsed = [] } = existingKeyToken ?? {};

    const update = {
      publicKey,
      privateKey,
      refreshToken,
      refreshTokensUsed: [...refreshTokensUsed, refreshToken],
    };

    const options = { upsert: true, new: true };

    const updatedKeyToken = await keyTokenModel
      .findOneAndUpdate({ user: userId }, update, options)
      .lean();

    return updatedKeyToken ?? null;
  };

  static findKeyTokenByUserId = async (userId: Types.ObjectId) => {
    const keyToken = await keyTokenModel.findOne({ user: userId }).lean();

    return keyToken ?? null;
  };

  static deleteKeyToken = async (id: Types.ObjectId) => {
    const keyToken = await keyTokenModel.findOneAndDelete({ _id: id });

    return keyToken ?? null;
  };
}
