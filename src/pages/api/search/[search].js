import Form from "@/models/form";

import { dbConnect } from "@/middleware/db";

const searchHandler = async (req, res) => {
  dbConnect();
  if (req.method === "GET") {
    const { search } = req.query;
    const forms = await Form.aggregate([
      {
        $lookup: {
          from: "inputs",
          localField: "inputs",
          foreignField: "_id",
          as: "inputsEmbeded",
        },
      },
      {
        $match: { "inputsEmbeded.value":  new RegExp(search) },
      },
    ]);
    res.status(201).json({ message: "all ok" });
  }
};

export default searchHandler;
