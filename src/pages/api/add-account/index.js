import User from "@/models/user";
import { dbConnect } from "@/middleware/db";

const basicOptionsHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { username, email, color } = req.body;
    console.log(username, email, color)
    res.status(201).json({ message: "all ok" });
  }
};

export default basicOptionsHandler;
