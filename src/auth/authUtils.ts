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
    expiresIn: "5s",
  });

  const refreshToken = JWT.sign(payload, refreshKey, {
    expiresIn: "15m",
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
    expiresIn: "5s",
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
    expiresIn: "15m",
  });

  return { refreshToken };
};
