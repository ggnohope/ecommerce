import { KeyObject } from "crypto";
import JWT, { Secret } from "jsonwebtoken";

export const createTokenPair = ({
  payload,
  privateKey,
}: {
  payload: object;
  privateKey: Secret;
}) => {
  const accessToken = JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });

  return {
    accessToken,
    refreshToken,
  };
};
