import mongoose, { Schema } from "mongoose";
import Option from "./option";

const MODEL_NAME = "Type";

const schema = new Schema({
  name: String,
  type: String,
  color: String,
  required: {
    type: Boolean,
    default: false,
  },
  additional: Schema.Types.Mixed,
  option: { type: Schema.Types.ObjectId, ref: "Option" },
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "types");
