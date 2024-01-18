import mongoose from "mongoose";

export interface IUser {
  _id: string;
  username: string;
  fullname: string;
  homeCity: string;
  profilePicture?: string;
  refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  homeCity: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
