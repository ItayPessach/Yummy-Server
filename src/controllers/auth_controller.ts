import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../components/logger";

const register = async (req: Request, res: Response) => {
  const { email, password, fullName, homeCity } = req.body;
  if (!email || !password || !fullName || !homeCity) {
    logger.error(
      "missing one of the following: email, password, fullName, homeCity"
    );
    return res
      .status(400)
      .send(
        "missing one of the following: email, password, fullName, homeCity"
      );
  }

  try {
    const sameUser = await User.findOne({ email: email });
    if (sameUser) {
      logger.error("email already exists");
      return res.status(409).send("email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email: email,
      password: encryptedPassword,
      fullName: fullName,
      homeCity: homeCity,
    });
    logger.info("new user added to db");
    return res.status(201).send(user);
  } catch (err) {
    logger.error("error while trying to register");
    return res.status(500).send("error while trying to register");
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error("missing email or password");
    return res.status(400).send("missing email or password");
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      logger.error("email is incorrect");
      return res.status(401).send("email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.error("password is incorrect");
      return res.status(401).send("password is incorrect");
    }

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );
    if (!user.refreshTokens) {
      user.refreshTokens = [refreshToken];
    } else {
      user.refreshTokens.push(refreshToken);
    }

    await user.save();
    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    logger.error("error while trying to login");
    return res.status(500).send("error while trying to login");
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!refreshToken) {
    logger.error("user didn't add refresh token to the request");
    return res.sendStatus(401);
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        logger.error("something is wrong with the provided refresh token");
        return res.sendStatus(401);
      }

      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (token) => token !== refreshToken
          );
          await userDb.save();
          return res.sendStatus(200);
        }
      } catch (err) {
        logger.error("error while trying to logout");
        res.sendStatus(500).send("error while trying to logout");
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!refreshToken) {
    logger.error("user didn't add refresh token to the request");
    return res.sendStatus(401);
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        logger.error("something is wrong with the provided refresh token");
        return res.sendStatus(401);
      }

      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        }

        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET
        );
        userDb.refreshTokens = userDb.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        userDb.refreshTokens.push(newRefreshToken);
        await userDb.save();
        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (err) {
        logger.error("error while trying to refresh");
        res.sendStatus(500).send("error while trying to refresh");
      }
    }
  );
};
export default {
  register,
  login,
  logout,
  refresh,
};
