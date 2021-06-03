import User from "@/models/user";
import Option from "@/models/option";
import { dbConnect } from "@/middleware/db";
const mail = require('@sendgrid/mail')

mail.setApiKey(process.env.SENDGRID_API_KEY)

const addAccountHandler =  async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { email, owner } = req.body;
    const option = await Option.findById(owner.option)
    option.owner.push(email);
    await option.save();
    const message = `
      Email: ${email}\r\n
      Link: localhost:3000/invitation/${option._id}
      Message: test
    `

    const data = {
      to: "mislavjc@gmail.com",
      from: process.env.EMAIL_FROM,
      subject: "Test slanja maila",
      text: message,
      html: message.replace(/\r\n/g, "<br>")
    }
    
    mail.send(data)

    res.status(201).json({ message: "all ok" });
  }
};

export default addAccountHandler;
