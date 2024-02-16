import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  fullName?: string;
  homeCity?: string;
  profileImage?: string;
  refreshTokens?: Array<string>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  },
  homeCity: {
    type: String,
  },
  profileImage: {
    type: String,
    required: false,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
