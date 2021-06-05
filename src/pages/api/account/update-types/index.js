import User from "@/models/user";
import Type from "@/models/type";
import Option from "@/models/option";
import { dbConnect } from "@/middleware/db";

const updateTypes = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { owner, names, types, additional, typeIdArr, count, required, currency } =
      req.body;
    const user = await User.findOne({ email: owner.email });
    const option = await Option.findById(user.option);
    for (let i = 0; i < typeIdArr.length; i++) {
      const type = await Type.findById(typeIdArr[i]);
      type.name = names[i.toString()];
      type.type = types[i.toString()];
      type.required = required[i.toString()] || false;
      if (additional[i.toString()]) {
        type.additional = additional[i.toString()];
      }
      if (currency[i.toString()]) {
        type.currency = currency[i.toString()];
      }
      await type.save();
    }
    if (count !== typeIdArr.length) {
      for (let i = typeIdArr.length; i < Object.keys(names).length; i++) {
        const field = {
          name: names[i.toString()],
          type: types[i.toString()],
          required: required[i.toString()] || false,
          option: option,
        };
        if (additional[i.toString()]) {
          const dropdownArr = additional[i.toString()].split(",");
          field.additional = dropdownArr;
        }
        if (currency[i.toString()]) {
          field.currency = currency[i.toString()];
        }
        const type = new Type(field);
        await type.save();
      }
    }

    res.status(201).json({ message: "all ok" });
  }
};

export default updateTypes;
