import mongoose from "mongoose";

export interface IComment {
  _id: string;
  user: string;
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
  body: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model<IComment>("Comment", CommentSchema);
