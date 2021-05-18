import mongoose, { Schema } from "mongoose";

const MODEL_NAME = "FieldType"

const schema = new Schema({
  name: String,
  type: String,
  color: String,
  required: {
    type: Boolean,
    default: false,
  },
  additional: Schema.Types.Mixed,
  owner: String,
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "fieldTypes");
