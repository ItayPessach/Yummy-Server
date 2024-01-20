import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";

class UsersController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  async getMe(req: AuthRequest, res: Response) {
    req.params.id = req.user._id;
    await super.getById(req, res);
  }

  async putById(req: AuthRequest, res: Response) {
    req.params.id = req.user._id;
    await super.putById(req, res);
  }
}

export default new UsersController();
