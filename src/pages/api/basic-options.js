import User from "@/models/user";
import FieldType from "@/models/fieldType";
import { dbConnect } from "@/middleware/db";

const basicOptionsHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, names, types } = req.body;
    const user = await User.findOne({ email: currentUser.email }).exec();
    for (let i = 0; i < Object.keys(names).length; i++) {
      const field = {
        name: names[i.toString()],
        type: types[i.toString()],
        owner: user._id,
      };
      const fieldType = new FieldType(field);
      await fieldType.save();
    }
    res.status(201).json({ message: "all ok" });
  }
};

export default basicOptionsHandler;
