import Type from "@/models/type";
import Option from "@/models/option";
import Input from "@/models/input";
import Form from "@/models/form";

import { dbConnect } from "@/middleware/db";

const createHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { currentUser, dataObj, attachments } = req.body;
    const option = await Option.findOne({ id: currentUser.option });
    const formArr = [];
    for (const [key, value] of Object.entries(dataObj)) {
      const type = await Type.findOne({ _id: key });
      const input = new Input({
        value,
        option,
        type,
      });
      await input.save();
      formArr.push(input);
    }
    const form = new Form({
      inputs: formArr,
      option,
      attachments
    });
    await form.save();
    res.send(form);
  }
};

export default createHandler;
