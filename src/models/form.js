import mongoose, { Schema } from "mongoose";
import Input from "./input"

const MODEL_NAME = "Form"

const schema = new Schema({
  owner: String,
  inputs: [{ type: Schema.Types.ObjectId, ref: "Input" }],
  attachments: [
    {
      url: String,
      filename: String,
      size: Number,
    },
  ],
  archived: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "forms");

