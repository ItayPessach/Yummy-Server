import { Express } from "express";
import studentRoute from "../routes/student_route";
import studentPostRoute from "../routes/student_post_route";
import authRoute from "../routes/auth_route";

export const configRoutes = (app: Express) => {
    app.use("/student", studentRoute);
    app.use("/studentpost", studentPostRoute);
    app.use("/auth", authRoute);
};