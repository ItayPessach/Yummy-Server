import { Express } from "express";
import request from "supertest";
import { initApp } from "../app";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post_model";
import User, { IUser } from "../models/user_model";

let app: Express;
const user: IUser = {
  email: "test@post.test",
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

const post: Partial<IPost> = {
  restaurant: "restaurant1",
  description: "description1",
  image: "image1",
  city: "yehud",
  user: user._id,
};

describe("post tests", () => {
  test("TEST POST post", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "Bearer " + accessToken)
      .send(post);

    post._id = response.body._id;

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toBe(user._id);
    expect(response.body.restaurant).toBe(post.restaurant);
    expect(response.body.description).toBe(post.description);
    expect(response.body.image).toBe(post.image);
    expect(response.body.city).toBe(post.city);
    expect(response.body.comments).toStrictEqual([]);
  });

  test("Test GET posts", async () => {
    const response = await request(app).get("/posts");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test GET post by id", async () => {
    const response = await request(app).get(`/posts/${post._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toBe(user._id);
    expect(response.body.restaurant).toBe(post.restaurant);
    expect(response.body.description).toBe(post.description);
    expect(response.body.image).toBe(post.image);
    expect(response.body.city).toBe(post.city);
    expect(response.body.comments).toStrictEqual([]);
  });

  test("Test GET posts by city", async () => {
    const response = await request(app).get("/posts/city/yehud");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("TEST GET post by user id", async () => {
    const response = await request(app).get(`/posts/user/${user._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test PUT post", async () => {
    const response = await request(app)
      .put(`/posts/${post._id}`)
      .set("Authorization", "Bearer " + accessToken)
      .send({ city: "tel aviv" });

    expect(response.statusCode).toBe(200);
    expect(response.body.city).toBe("tel aviv");
  });

  test("Test POST comment", async () => {
    const response = await request(app)
      .post(`/posts/${post._id}/comment`)
      .set("Authorization", "Bearer " + accessToken)
      .send({ body: "GDB is amazing" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].body).toBe("GDB is amazing");
    expect(response.body[0].user).toBe(user._id);
  });

  test("Test DELETE post", async () => {
    const response = await request(app)
      .delete(`/posts/${post._id}`)
      .set("Authorization", "Bearer " + accessToken);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(post._id);
  });
});
