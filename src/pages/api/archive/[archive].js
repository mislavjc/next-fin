import Form from "@/models/form";

import { dbConnect } from "@/middleware/db";

const deleteHandler = async (req, res) => {
  dbConnect();
  if (req.method === "GET") {
    const { archive: id } = req.query;
    const form = await Form.findById(id);
    form.archived = true;
    await form.save();
    res.status(201).json({ message: "all ok" });
  }
  if (req.method === "POST") {
    const { archive: id } = req.query;
    const form = await Form.findById(id);
    form.archived = false;
    await form.save();
    res.status(201).json({ message: "all ok" });
  }
};

export default deleteHandler;
