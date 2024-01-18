import mongoose from "mongoose";

export interface IComment {
  _id: string;
  user: string;
  createdAt: Date;
  body: string;
}

const CommentSchema = new mongoose.Schema<IComment>({
  _id: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IComment>("Comment", CommentSchema);
