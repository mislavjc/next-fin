import Form from "@/models/form";
import mongoose from "mongoose";

import { dbConnect } from "@/middleware/db";

const searchHandler = async (req, res) => {
  dbConnect();
  if (req.method === "GET") {
    const { search, option } = req.query;
    if (search !== "") {
      const forms = await Form.aggregate([
        {
          $lookup: {
            from: "inputs",
            localField: "inputs",
            foreignField: "_id",
            as: "inputs",
          },
        },
        {
          $match: {
            "inputs.value": new RegExp(search),
            option: mongoose.Types.ObjectId(option),
          },
        },
      ]);
      res.send(forms);
    }
    res.status(200);
  }
};

export default searchHandler;
