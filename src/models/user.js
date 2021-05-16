import mongoose, { Schema } from "mongoose";

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
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "users");
