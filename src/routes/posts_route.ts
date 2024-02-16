import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - restaurant
 *         - description
 *         - image
 *         - city
 *       properties:
 *         restaurant:
 *           type: string
 *           description: The post restaurant
 *         description:
 *           type: string
 *           description: The post description
 *         image:
 *           type: string
 *           format: binary
 *           description: The post image
 *         city:
 *          type: string
 *          description: The post city
 *       example:
 *         restaurant: 'GDB'
 *         description: 'Yesterday I eat at this place And It was amazing'
 *         image: File
 *         city: 'Yehud'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - body
 *       properties:
 *         body:
 *           type: string
 *           description: The comment body
 *       example:
 *         body: 'This looks such a good place. i must go there and try the new burger! '
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: get list of posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get("/", postsController.get.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: get post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the post to get
 *     responses:
 *       200:
 *         description: the post with the id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get("/:id", postsController.getById.bind(postsController));

/**
 * @swagger
 * /posts/{city}?page={page}&pageSize={pageSize}:
 *   get:
 *     summary: get post by city
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: city name of the posts to get
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: page number for paginated results
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: page size for paginated results
 *     responses:
 *       200:
 *         description: list of posts with the city name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get("/city/:city", postsController.getByCity.bind(postsController));

/**
 * @swagger
 * /posts/user/me?page={page}&pageSize={pageSize}:
 *   get:
 *     summary: get posts uploaded by me
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: page number for paginated results
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: page size for paginated results
 *     responses:
 *       200:
 *         description: list of posts with the user id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get(
  "/user/me",
  authMiddleware,
  postsController.getByMe.bind(postsController)
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: create post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *        200:
 *          description: the created post
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        409:
 *          description: Error while trying to create new post
 */
router.post("/", authMiddleware, postsController.post.bind(postsController));

/**
 * @swagger
 * /posts/{postId}/comment:
 *   post:
 *     summary: add comment to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: post id to add comment to
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *        200:
 *          description: New comment was added
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  allOf:
 *                    - $ref: '#/components/schemas/Comment'
 *        409:
 *          description: Error while trying to add comment to a post
 */
router.post(
  "/:postId/comment",
  authMiddleware,
  postsController.addCommentToPost.bind(postsController)
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: update post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the post to update
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       409:
 *         description: Error while trying to update post
 */
router.put(
  "/:id",
  authMiddleware,
  postsController.putById.bind(postsController)
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: delete post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the post to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the deleted post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       409:
 *         description: Error while trying to delete post
 */
router.delete(
  "/:id",
  authMiddleware,
  postsController.deleteById.bind(postsController)
);

export default router;
