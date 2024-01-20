import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *         - homeCity
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         fullName:
 *           type: string
 *           description: The user fullName
 *         homeCity:
 *           type: string
 *           description: The user home city
 *       example:
 *         email: 'user@gmail.com'
 *         fullName: 'user junior'
 *         homeCity: 'Ganey Tikva'
 *         password: '1234567'
 *
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Unexpected error
 */
router.get("/", authMiddleware, usersController.get.bind(usersController));

/**
 * @swagger
 * /users/{:id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected error
 */
router.get(
  "/:id",
  authMiddleware,
  usersController.getById.bind(usersController)
);

/**
 * @swagger
 * /users/{:id}:
 *   put:
 *     summary: Edit an existing user by id
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected error
 */
router.put(
  "/:id",
  authMiddleware,
  usersController.putById.bind(usersController)
);

export default router;
