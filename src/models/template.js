import mongoose, { Schema } from "mongoose";
import Field from "./field"

const MODEL_NAME = "Template"

const schema = new Schema({
  owner: String,
  fields: [{ type: Schema.Types.ObjectId, ref: "Field" }],
  attachments: [
    {
      url: String,
      filename: String,
      size: Number,
    },
  ],
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "templates");

