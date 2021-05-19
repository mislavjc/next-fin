import User from "@/models/user";
import FieldType from "@/models/fieldType";
import Field from "@/models/field";
import Form from "@/models/form";
import { dbConnect } from "@/middleware/db";

const createHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, dataObj } = req.body;
    const user = await User.findOne({ email: currentUser.email }).exec();
    for (const [key, value] of Object.entries(dataObj)) {
      const fieldType = await FieldType.findOne({_id: key})
      const field = new Field({
        value,
        owner: user.id,
        fieldType,
      })
      console.log(field)
    }
    res.status(201).json({ message: "all ok" });
  }
};

export default createHandler;
