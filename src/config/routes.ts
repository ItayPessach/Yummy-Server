import { Express } from "express";
import usersRoute from "../routes/users_route";
import postsRoute from "../routes/posts_route";
import authRoute from "../routes/auth_route";

export const configRoutes = (app: Express) => {
  app.use("/users", usersRoute);
  app.use("/posts", postsRoute);
  app.use("/auth", authRoute);
};
