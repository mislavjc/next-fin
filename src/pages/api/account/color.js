import User from "@/models/user";
import { dbConnect } from "@/middleware/db";

const colorHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { owner, selected: color } = req.body;
    console.log(owner, color);
    const user = await User.findById(owner._id);
    user.color = color;
    await user.save();

    res.status(201).json({ message: "all ok" });
  } 
};

export default colorHandler;
