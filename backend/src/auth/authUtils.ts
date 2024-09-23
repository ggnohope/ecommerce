import JWT, { Secret } from "jsonwebtoken";

export const createTokenPair = ({
  payload,
  accessKey,
  refreshKey,
}: {
  payload: object;
  accessKey: Secret;
  refreshKey: Secret;
}) => {
  const accessToken = JWT.sign(payload, accessKey, {
    expiresIn: process.env.JWT_ACCESS_EXPIRED,
  });

  const refreshToken = JWT.sign(payload, refreshKey, {
    expiresIn: process.env.JWT_REFRESH_EXPIRED,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const createAccessToken = ({
  payload,
  accessKey,
}: {
  payload: object;
  accessKey: Secret;
}) => {
  const accessToken = JWT.sign(payload, accessKey, {
    expiresIn: process.env.JWT_ACCESS_EXPIRED,
  });

  return { accessToken };
};

export const createRefreshToken = ({
  payload,
  refreshKey,
}: {
  payload: object;
  refreshKey: Secret;
}) => {
  const refreshToken = JWT.sign(payload, refreshKey, {
    expiresIn: process.env.JWT_REFRESH_EXPIRED,
  });

  return { refreshToken };
};
