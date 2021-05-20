import User from "@/models/user";
import Type from "@/models/type";
import Input from "@/models/input";
import Form from "@/models/form";
import Test from "@/models/test";

import { dbConnect } from "@/middleware/db";

const createHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, dataObj } = req.body;
    const user = await User.findOne({ email: currentUser.email }).exec();
    for (const [key, value] of Object.entries(dataObj)) {
      const type = await Type.findOne({_id: key})
      const input = new Input({
        value,
        owner: user.id,
        type,
      })
      await input.save()
    }
    res.status(201).json({ message: "all ok" });
  }
};

export default createHandler;
