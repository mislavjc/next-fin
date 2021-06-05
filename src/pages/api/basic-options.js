import User from "@/models/user";
import Type from "@/models/type";
import Option from "@/models/option";
import { dbConnect } from "@/middleware/db";

const basicOptionsHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, names, types, additional, required, currency } =
      req.body;
    const user = await User.findOne({ email: currentUser.email });
    const username = user.email.split("@")[0];
    const acc = {};
    acc[username] = {
      email: user.email,
      create: true,
      delete: true,
      role: "admin",
      color: "#BDBDBD",
    };
    const option = new Option({
      owner: acc,
    });
    await option.save();
    user.create = true;
    user.delete = true;
    user.role = "admin";
    user.color = "#607d8b";
    user.option = option;
    user.admin = true;
    await user.save();
    for (let i = 0; i < Object.keys(names).length; i++) {
      const field = {
        name: names[i.toString()],
        type: types[i.toString()],
        required: required[i.toString()] || false,
        option: option,
      };
      if (additional[i.toString()]) {
        field.additional = additional[i.toString()];
      }
      if (currency[i.toString()]) {
        field.currency = currency[i.toString()];
      }
      const type = new Type(field);
      await type.save();
    }
    res.status(201).json({ message: "all ok" });
  }
};

export default basicOptionsHandler;
