import User from "@/models/user";
import Type from "@/models/type";
import Input from "@/models/input";
import Form from "@/models/form";

import { dbConnect } from "@/middleware/db";

const editHandler = async (req, res) => {
  dbConnect();
  if (req.method === "PUT") {
    const { currentUser, dataObj, form: _id } = req.body;
    const form = await Form.findOne({ _id }).populate({
      path: "inputs",
      populate: {
        path: "type",
      },
    });
    console.log(dataObj);
    for (let i = 0; i < form.inputs.length; i++) {
      const newVal = dataObj[form.inputs[i]._id];
      const input = await Input.findByIdAndUpdate(form.inputs[i]._id, {
        value: newVal,
      });
      await input.save();
    }
    await form.save();
    res.status(201).json({ message: "all ok" });
  }
};

export default editHandler;
