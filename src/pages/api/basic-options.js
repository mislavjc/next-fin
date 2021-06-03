import User from "@/models/user";
import Type from "@/models/type";
import Option from "@/models/option";
import { dbConnect } from "@/middleware/db";

const basicOptionsHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, names, types, additional } = req.body;
    const user = await User.findOne({ email: currentUser.email });
    const owner = [user.email];
    const option = new Option({
      owner,
    });
    await option.save();
    user.option = option;
    await user.save();
    for (let i = 0; i < Object.keys(names).length; i++) {
      const field = {
        name: names[i.toString()],
        type: types[i.toString()],
        option: option,
      };
      if (additional[i.toString()]) {
        const dropdownArr = additional[i.toString()].split(",");
        field.additional = dropdownArr;
      }
      const type = new Type(field);
      await type.save();
    }
    res.status(201).json({ message: "all ok" });
  }
};

export default basicOptionsHandler;
