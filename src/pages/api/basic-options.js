import User from "@/models/user";
import { dbConnect } from "@/middleware/db";

const basicOptionsHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, names, types } = req.body;
    const user = await User.findOne({ email: currentUser.email }).exec();
    res.status(201).json({ message: "all ok" });
  }
};

export default basicOptionsHandler;
