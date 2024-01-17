import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from "../components/logger";
export interface AuthRequest extends Request {
    user?: { _id: string };
}
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        logger.error("user didn't add access token to the request");
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.error('something is wrong with the provided access token');
            return res.sendStatus(401);
        }

        req.user = user as { _id: string };
        next();
    });
}

export default authMiddleware;
