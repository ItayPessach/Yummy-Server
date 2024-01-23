import Post, { IPost } from "../models/post_model";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import { logger } from "../components/logger";
import { handleSingleUploadFile } from "../utils/upload_file";

class PostsController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async post(req: AuthRequest, res: Response) {
    let uploadResult: { file: Express.Multer.File; body: unknown };

    try {
      uploadResult = await handleSingleUploadFile(req, res);
    } catch (e) {
      logger.error("error while trying to upload file");
      res.status(422).json({ errors: [e.message] });
      return;
    }

    req.body.user = req.user._id;
    req.body.image = uploadResult.file?.filename;
    await super.post(req, res);
  }

  async getById(req: Request, res: Response) {
    try {
      const post = await (
        await this.model.findById(req.params.id).populate("user")
      ).populate("comments.user");
      res.send(post);
    } catch (err) {
      logger.error("error while trying to get post by id");
      res.status(500).json({ message: err.message });
    }
  }

  async getByCity(req: Request, res: Response) {
    const city = req.params.city;
    const page = +req.query.page;
    const limit = +req.query.pageSize;

    try {
      const posts = await this.model
        .find({ city })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("user");
      res.send(posts);
    } catch (err) {
      logger.error("error while trying to get posts by city");
      res.status(500).json({ message: err.message });
    }
  }

  async getByMe(req: AuthRequest, res: Response) {
    const page = +req.query.page;
    const limit = +req.query.pageSize;

    try {
      const posts = await this.model
        .find({ user: req.user._id })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("user");
      res.send(posts);
    } catch (err) {
      logger.error("error while trying to get posts by user id");
      res.status(500).json({ message: err.message });
    }
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
