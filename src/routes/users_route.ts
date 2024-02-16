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
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get my user by the id that is in the token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
router.get("/me", authMiddleware, usersController.getMe.bind(usersController));

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Edit my user by the id that is in the token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
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
router.put("/", authMiddleware, usersController.putById.bind(usersController));

export default router;
