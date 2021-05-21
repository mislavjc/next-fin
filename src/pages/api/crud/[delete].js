import User from "@/models/user";
import Type from "@/models/type";
import Input from "@/models/input";
import Form from "@/models/form";

import { dbConnect } from "@/middleware/db";

const deleteHandler = async (req, res) => {
  dbConnect();
  if (req.method === "DELETE") {
    const { delete: id } = req.query;
    await Form.findByIdAndDelete(id);
    res.status(201).json({ message: "all ok" });
  }
};

export default deleteHandler;
