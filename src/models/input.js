import mongoose, { Schema } from "mongoose";
import Type from "./type"

const MODEL_NAME = "Input"

const schema = new Schema({
  type: { type: Schema.Types.ObjectId, ref: "Type" },
  owner: String,
  value: String,
  test: String
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "inputs");
