import mongoose from "mongoose";

export interface IPost {
  _id: string;
  restaurant: string;
  description: string;
  image: string;
  city: string;
  user: string;
  comments: Array<string>;
}

const postSchema = new mongoose.Schema<IPost>({
  _id: {
    type: String,
    required: true,
  },
  restaurant: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  comments: {
    type: [String],
    required: false,
    ref: "Comment",
  },
}, { timestamps: true });

export default mongoose.model<IPost>("Post", postSchema);
