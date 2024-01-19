import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", postsController.get.bind(postsController));
router.get("/:id", postsController.getById.bind(postsController));
router.get("/city/:city", postsController.getByCity.bind(postsController));
router.get("/user/:userId", postsController.getByUserId.bind(postsController));
router.post("/", authMiddleware, postsController.post.bind(postsController));
router.put(
  "/:id",
  authMiddleware,
  postsController.putById.bind(postsController)
);
router.delete(
  "/:id",
  authMiddleware,
  postsController.deleteById.bind(postsController)
);

export default router;
