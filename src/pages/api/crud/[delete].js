import Form from "@/models/form";

import { dbConnect } from "@/middleware/db";

const deleteHandler = async (req, res) => {
  dbConnect();
  if (req.method === "DELETE") {
    const { delete: id } = req.query;
    await Form.findByIdAndDelete(id);
    await res.status(201).json({ message: "all ok" });
  }
};

export default deleteHandler;
