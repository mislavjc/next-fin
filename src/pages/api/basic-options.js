import User from "@/models/user"
import {dbConnect} from "@/middleware/db"

const handler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const data = req.body;
    const user = await User.find({}).exec();
    res.status(201).json({ message: "all ok" });
  }
  if (req.method === "GET") {
    const user = await User.find({}).exec();
    res.send(user[0].email);
  }
};

export default handler;