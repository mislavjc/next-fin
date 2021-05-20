import User from "@/models/user";
import Type from "@/models/type";
import Input from "@/models/input";
import Form from "@/models/form";

import { dbConnect } from "@/middleware/db";

const createHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, dataObj } = req.body;
    const user = await User.findOne({ email: currentUser.email }).exec();
    const formArr = [];
    for (const [key, value] of Object.entries(dataObj)) {
      const type = await Type.findOne({ _id: key });
      const input = new Input({
        value,
        owner: user.id,
        type,
      });
      await input.save();
      formArr.push(input);
    }
    const form = new Form({
      fields: formArr,
      owner: user.id,
    });
    await form.save();
    res.status(201).json({ message: "all ok" });
  }
};

export default createHandler;
