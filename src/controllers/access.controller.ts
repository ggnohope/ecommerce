import accessService from "../services/access.service";
import { Request, Response } from "express";

class AccessController {
  signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    return res
      .status(201)
      .json(await accessService.signUp({ name, email, password }));
  };
}

export default new AccessController();
