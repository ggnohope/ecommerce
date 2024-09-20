import crypt from "crypto";
import { NextFunction, Request, Response } from "express";

export const generatePairKey = ({
  algo,
  modulusLength,
}: {
  algo: any;
  modulusLength: number;
}) => {
  const { privateKey, publicKey } = crypt.generateKeyPairSync(algo, {
    modulusLength: modulusLength,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });

  return { privateKey, publicKey };
};

export const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
