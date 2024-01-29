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
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  },
  homeCity: {
    type: String,
    required: false,
    default: 'TEL AVIV - YAFO',
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
