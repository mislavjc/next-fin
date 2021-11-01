import mongoose, { Schema } from "mongoose";

import Type from "./type";
import Option from "./option";

const MODEL_NAME = "Input";

const schema = new Schema({
  type: { type: Schema.Types.ObjectId, ref: "Type" },
  option: { type: Schema.Types.ObjectId, ref: "Option" },
  value: String,
});

export default mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, schema, "inputs");
