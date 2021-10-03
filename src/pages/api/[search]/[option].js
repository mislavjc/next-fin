import mongoose from "mongoose";

import Form from "@/models/form";
import Type from "@/models/type";

import { dbConnect } from "@/middleware/db";

const searchHandler = async (req, res) => {
  dbConnect();
  if (req.method === "GET") {
    const { search, option } = req.query;
    if (search !== "" && !search.includes("+")) {
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
      const result = await Type.populate(forms, { path: "inputs.type" });
      res.send(result);
    } else {
      const allForms = await Form.find({
        option: mongoose.Types.ObjectId(option),
      }).populate({
        path: "inputs",
        populate: {
          path: "type",
        },
      });
      res.send(allForms);
    }
    res.status(200);
  }
};

export default searchHandler;
