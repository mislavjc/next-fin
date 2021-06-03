import mongoose, { Schema } from "mongoose";

const MODEL_NAME = "Option";

const schema = new Schema({
  owner: Schema.Types.Mixed,
  subscription: {
    type: String,
    default: "Bez pretplate",
  },
  totalUsage: Number,
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "options");
