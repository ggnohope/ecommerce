import crypto from "crypto";
import apiKeyModel from "../models/apiKey.model";

export const findById = async (key: string) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey ?? null;
};
