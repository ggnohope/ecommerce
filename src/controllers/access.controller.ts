"use strict";

import accessService from "../services/access.service";
import { Request, Response } from "express";

class AccessController {
  signUp = async (req: Request, res: Response) => {
    try {
      return res.status(201).json({ message: "Sign up successfully" });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };
}

export default new AccessController();
