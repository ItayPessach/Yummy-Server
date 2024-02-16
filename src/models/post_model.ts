import mongoose from "mongoose";

export interface IComment {
  user: string;
  body: string;
  date: Date;
}

export interface IPost {
  _id?: string;
  restaurant: string;
  description: string;
  image: string;
  city: string;
  user: string;
  comments: Array<IComment>;
}

const postSchema = new mongoose.Schema<IPost>(
  {
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
      required: false,
      type: [
        {
          user: {
            type: String,
            required: true,
            ref: "User",
          },
          body: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", postSchema);
