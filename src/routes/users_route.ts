import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", authMiddleware, usersController.get.bind(usersController));
router.get(
  "/:id",
  authMiddleware,
  usersController.getById.bind(usersController)
);
router.post("/", authMiddleware, usersController.post.bind(usersController));
router.put(
  "/:id",
  authMiddleware,
  usersController.putById.bind(usersController)
);
router.delete(
  "/:id",
  authMiddleware,
  usersController.deleteById.bind(usersController)
);

export default router;
