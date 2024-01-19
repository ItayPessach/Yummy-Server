import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class PostsController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async post(req: AuthRequest, res: Response) {
    const id = req.user._id;
    req.body.user = id;
    await super.post(req, res);
  }

  async getByCity(req: AuthRequest, res: Response) {
    const city = req.params.city;

    try {
      const posts = this.model.find({ city: city });
      res.send(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getByUserId(req: AuthRequest, res: Response) {
    const userId = req.params.userId;

    try {
      const posts = this.model.find({ user: userId });
      res.send(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new PostsController();
