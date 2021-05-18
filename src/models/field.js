import mongoose, { Schema } from "mongoose";
import FieldType from "./fieldType"

const MODEL_NAME = "Field"

const schema = new Schema({
  fieldtype: { type: Schema.Types.ObjectId, ref: "FieldType" },
  owner: String,
  value: String,
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "fields");
