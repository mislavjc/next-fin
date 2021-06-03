import User from "@/models/user";
import { dbConnect } from "@/middleware/db";
const mail = require('@sendgrid/mail')

mail.setApiKey(process.env.SENDGRID_API_KEY)

const basicOptionsHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { username, email, color } = req.body;
    console.log(username, email, color)
    const message = `
      Name: ${username}\r\n
      Email: ${email}\r\n
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

export default basicOptionsHandler;
