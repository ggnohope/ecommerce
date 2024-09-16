import { Created, OK } from "../core/success.response";
import { CustomRequest } from "../interface";
import accessService from "../services/access.service";
import { Request, Response } from "express";

class AccessController {
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const loginResult = await accessService.login({ email, password });
    new OK(200, "Login successfully!", loginResult).send(res);
  };

  signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const signUpResult = await accessService.signUp({ name, email, password });
    new Created(201, "Sign up successfully!", signUpResult).send(res);
  };

  logout = async (req: CustomRequest, res: Response) => {
    const { keyStore } = req;

    console.log(keyStore);

    const logoutResult = await accessService.logout({ keyStore });
    new OK(200, "Logout successfully!", logoutResult).send(res);
  };
}

export default new AccessController();
