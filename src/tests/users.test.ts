import request from "supertest";
import { initApp } from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import { Express } from "express";

let app: Express;
let accessToken: string;
const user: IUser = {
  _id: "1234567890",
  email: "test@.post.test",
  password: "1234567890",
  fullName: "test",
  homeCity: "test",
};
beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();

  User.deleteMany({ email: user.email });
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User tests", () => {
  const addUser = async (user: IUser) => {
    const response = await request(app)
      .post("/user")
      .set("Authorization", "JWT " + accessToken)
      .send(user);
    expect(response.statusCode).toBe(201);
  };

  test("Test Get All Users - empty response", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post User", async () => {
    await addUser(user);
  });

  test("Test Get All Users with one user in DB", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const us = response.body[0];
    expect(us.fullName).toBe(user.fullName);
    expect(us._id).toBe(user._id);
    expect(us.email).toBe(user.email);
    expect(us.homeCity).toBe(user.homeCity);
  });

  test("Test Post duplicate User", async () => {
    const response = await request(app)
      .post("/user")
      .set("Authorization", "JWT " + accessToken)
      .send(user);
    expect(response.statusCode).toBe(409);
  });

  // test("Test PUT /user/:id", async () => {
  //   const updatedUser = { ...user, name: "Jane Doe 33" };
  //   const response = await request(app)
  //     .put(`/user/${user._id}`)
  //     .send(updatedUser);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.name).toBe(updatedUser.name);
  // });

  // test("Test DELETE /user/:id", async () => {
  //   const response = await request(app).delete(`/user/${user._id}`);
  //   expect(response.statusCode).toBe(200);
  // });
});
