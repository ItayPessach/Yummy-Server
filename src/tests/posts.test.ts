import { Express } from "express";
import request from "supertest";
import { initApp } from "../app";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

let app: Express;
const user: IUser = {
  _id: "1234567890",
  email: "test@.post.test",
  password: "1234567890",
  fullName: "test",
  homeCity: "test",
};

let accessToken = "";

beforeAll(async () => {
  app = await initApp();
  await Post.deleteMany();

  await User.deleteMany({ email: user.email });
  const response = await request(app).post("/auth/register").send(user);
  user._id = response.body._id;
  const response2 = await request(app).post("/auth/login").send(user);
  accessToken = response2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

const post1: IPost = {
  _id: "1234567890",
  restaurant: "restaurant1",
  description: "description1",
  image: "image1",
  city: "city1",
  user: user._id,
  comments: [],
};

describe("post tests", () => {
  const addPost = async (post: IPost) => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "JWT " + accessToken)
      .send(post);
    expect(response.statusCode).toBe(201);
    expect(response.body.user).toBe(user._id);
    expect(response.body.restaurant).toBe(post.restaurant);
    expect(response.body.description).toBe(post.description);
    expect(response.body.image).toBe(post.image);
    expect(response.body.city).toBe(post.city);
    expect(response.body.comments).toStrictEqual([]);
  };

  test("Test Get All posts - empty response", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post post", async () => {
    addPost(post1);
  });

  test("Test Get All posts with one post in DB", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.user).toBe(user._id);
    expect(rc.restaurant).toBe(post1.restaurant);
    expect(rc.description).toBe(post1.description);
    expect(rc.image).toBe(post1.image);
    expect(rc.city).toBe(post1.city);
    expect(rc.comments).toStrictEqual([]);
  });
});
