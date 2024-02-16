import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { handleSingleUploadFile } from "../utils/upload_file";
import { logger } from "../components/logger";

class UsersController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  async getMe(req: AuthRequest, res: Response) {
    req.params.id = req.user._id;
    await super.getById(req, res);
  }

  async putById(req: AuthRequest, res: Response) {
    let uploadResult: { file: Express.Multer.File; body: unknown };

    try {
      uploadResult = await handleSingleUploadFile(req, res);
    } catch (e) {
      logger.error("error while trying to upload file");
      res.status(422).json({ errors: [e.message] });
      return;
    }

    req.params.id = req.user._id;
    req.body.profileImage = uploadResult.file?.filename;
    await super.putById(req, res);
  }
}

export default new UsersController();
