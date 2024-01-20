import request from "supertest";
import { initApp } from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import { Express } from "express";

let app: Express;
let accessToken: string;
const user: IUser = {
  email: "test@user.test",
  password: "1234567890",
  fullName: "test",
  homeCity: "test",
};

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();

  User.deleteMany({ email: user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User tests", () => {
  const addUser = async (user: IUser) => {
    const response = await request(app).post("/auth/register").send(user);
    user._id = response.body._id;
    expect(response.statusCode).toBe(201);
    const response2 = await request(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
    expect(response2.statusCode).toBe(200);
  };

  test("Test Get Me - not authenticated", async () => {
    const response = await request(app).get("/users/me");
    expect(response.statusCode).toBe(401);
  });

  test("Test Post User", async () => {
    await addUser(user);
  });

  test("Test Get Me - authenticated", async () => {
    const response = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.fullName).toBe(user.fullName);
    expect(response.body._id).toBe(user._id);
    expect(response.body.email).toBe(user.email);
    expect(response.body.homeCity).toBe(user.homeCity);
  });

  test("Test Post duplicate User", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(409);
  });

  test("Test PUT /users", async () => {
    const updatedUser = { ...user, fullName: "Jane Doe 33" };
    const response = await request(app)
      .put(`/users`)
      .send(updatedUser)
      .set("Authorization", "Bearer " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.fullName).toBe(updatedUser.fullName);
  });
});
