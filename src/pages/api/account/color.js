import User from "@/models/user";

import { dbConnect } from "@/middleware/db";

const colorHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { owner: currentUser, selected: color } = req.body;
    const user = await User.findById(currentUser._id);
    user.color = color;
    await user.save();

    res.status(201).json({ message: "all ok" });
  }
};

export default colorHandler;
