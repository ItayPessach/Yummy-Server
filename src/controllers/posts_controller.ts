import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import {logger} from "../components/logger";

class PostsController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async post(req: AuthRequest, res: Response) {
    const id = req.user._id;
    // TODO: save post image on server uploads directory
    req.body.user = id;
    await super.post(req, res);
  }

  async getByCity(req: Request, res: Response) {
    const city = req.params.city;

    await super.getByFilter(req, res, { city });
  }

  async getByUserId(req: Request, res: Response) {
    const userId = req.params.userId;

    await super.getByFilter(req, res, { user: userId });
  }

  async addCommentToPost(req: AuthRequest, res: Response) {
    const user = req.user._id;
    const postId = req.params.postId;

    try {
      const post = await this.model.findById(postId);
      post.comments = [...post.comments, { ...req.body, user }];

      await post.save();
      res.send(post.comments);
    } catch (err) {
      logger.error("error while adding comment to a post");
      res.status(409).send("fail: " + err.message);
    }
  }
}

export default new PostsController();