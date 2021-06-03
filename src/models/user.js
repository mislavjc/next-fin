import mongoose, { Schema } from "mongoose";
import Option from "./option";

const MODEL_NAME = "User";

const schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  color: String,
  create: Boolean,
  delete: Boolean,
  role: String,
  username: String,
  option: { type: Schema.Types.ObjectId, ref: "Option" },
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "users");
