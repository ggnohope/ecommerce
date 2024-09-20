import { HEADER } from "../constants";
import { UnauthorizedError } from "../core/error.response";
import { Created, OK } from "../core/success.response";
import { CustomRequest } from "../interface";
import accessService from "../services/access.service";
import { Request, Response } from "express";

class AccessController {
  static refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const refreshTokenResult = await accessService.refreshToken(refreshToken);
    new OK(200, "Refresh token successfully!", refreshTokenResult).send(res);
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const loginResult = await accessService.login({ email, password });
    new OK(200, "Login successfully!", loginResult).send(res);
  };

  static signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const signUpResult = await accessService.signUp({ name, email, password });
    new Created(201, "Sign up successfully!", signUpResult).send(res);
  };

  static logout = async (req: CustomRequest, res: Response) => {
    const authorizationHeader = req.headers[HEADER.AUTHORIZATION];
    const accessToken =
      typeof authorizationHeader === "string"
        ? authorizationHeader.split(" ")[1]
        : undefined;

    if (!accessToken || Array.isArray(accessToken)) {
      throw new UnauthorizedError("Invalid AccessToken!");
    }

    const logoutResult = await accessService.logout({
      accessToken,
      shopId: req.user.shopId,
    });
    new OK(200, "Logout successfully!", logoutResult).send(res);
  };

  static getMe = async (req: CustomRequest, res: Response) => {
    const { user } = req;
    const meResult = await accessService.getMe({ id: user.shopId });
    new OK(200, "Get me successfully!", meResult).send(res);
  };
}

export default AccessController;
