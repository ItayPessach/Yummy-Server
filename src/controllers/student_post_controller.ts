import StudentPost, { IStudentPost } from "../models/student_post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class StudentPostController extends BaseController<IStudentPost>{
    constructor() {
        super(StudentPost)
    }

    async post(req: AuthRequest, res: Response) {
        const id = req.user._id;
        req.body.owner = id;
        await super.post(req, res);
    }
}

export default new StudentPostController();
