import { Types } from "mongoose";
import keyTokenModel from "../models/keyToken.model";

export default class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
  }: {
    userId: Types.ObjectId;
    publicKey: String;
  }) => {
    try {
      const newKeyToken = await keyTokenModel.create({
        user: userId,
        publicKey: publicKey,
      });

      return newKeyToken ?? null;
    } catch (error) {
      return error;
    }
  };
}
