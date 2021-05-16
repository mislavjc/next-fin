import mongoose from "mongoose";

export const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.DB_CONN_STR, {
    newUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
}

export function jsonify(obj) {
  return JSON.parse(JSON.stringify(obj));
}
