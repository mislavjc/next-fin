import User from "@/models/user";
import Type from "@/models/type";
import { dbConnect } from "@/middleware/db";

const basicOptionsHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, names, types, additional } = req.body;
    const user = await User.findOne({ email: currentUser.email })
    for (let i = 0; i < Object.keys(names).length; i++) {
      const field = {
        name: names[i.toString()],
        type: types[i.toString()],
        owner: user._id,
      };
      if (additional[i.toString()]) {
        const dropdownArr = additional[i.toString()].split(",");
        field.additional = dropdownArr
      }
      const type = new Type(field);
      await type.save();
    }
    res.status(201).json({ message: "all ok" });
  }
};

export default basicOptionsHandler;
