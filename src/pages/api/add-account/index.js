import User from "@/models/user";
import Option from "@/models/option";
import { dbConnect } from "@/middleware/db";
const mail = require("@sendgrid/mail");

mail.setApiKey(process.env.SENDGRID_API_KEY);

const addAccountHandler = async (req, res) => {
  dbConnect();
  if (req.method === "POST") {
    const { email, owner, role, add, del } = req.body;
    const option = await Option.findById(owner.option);
    const username = email.split("@")[0].replace(".", "");
    if (username in option.owner) {
      await User.findOneAndUpdate(
        { email: email },
        {
          role: role,
          create: add,
          delete: del,
        }
      );
    } else {
      const acc = { ...option.owner };
      acc[username] = {
        create: add,
        delete: del,
        role,
        color: "#607d8b",
      };
      option.owner = acc;
      await option.save();
      const message = `
      Email: ${email}\r\n
      Link: localhost:3000/invitation/${option._id}
      Message: Kopirajte link
    `;

      const data = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: "Invite za FIN",
        text: message,
        html: `
        <!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <title></title> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> #outlook a{padding: 0;}body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}p{display: block; margin: 13px 0;}</style><!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if lte mso 11]> <style type="text/css"> .mj-outlook-group-fix{width:100% !important;}</style><![endif]--> <link href="https://fonts.googleapis.com/css?family=Open Sans" rel="stylesheet" type="text/css"> <style type="text/css"> @import url(https://fonts.googleapis.com/css?family=Open Sans); </style> <style type="text/css"> @media only screen and (min-width:480px){.mj-column-per-100{width: 100% !important; max-width: 100%;}}</style> <style type="text/css"> [owa] .mj-column-per-100{width: 100% !important; max-width: 100%;}</style> <style type="text/css"> @media only screen and (max-width:480px){table.mj-full-width-mobile{width: 100% !important;}td.mj-full-width-mobile{width: auto !important;}}</style></head><body style="background-color:#f8f8f8;"> <div style="background-color:#f8f8f8;"><!--[if mso | IE]> <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" > <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"> <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-left:0px;padding-right:0px;padding-top:0px;text-align:center;"><!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td class="" style="vertical-align:top;width:600px;" ><![endif]--> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"> <tr> <td style="font-size:0px;padding:10px 25px;padding-top:0px;padding-right:0px;padding-bottom:40px;padding-left:0px;word-break:break-word;"> <p style="border-top:solid 7px #5E14FF;font-size:1px;margin:0px auto;width:100%;"> </p><!--[if mso | IE]> <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 7px #5E14FF;font-size:1px;margin:0px auto;width:600px;" role="presentation" width="600px" > <tr> <td style="height:0;line-height:0;"> &nbsp; </td></tr></table><![endif]--> </td></tr><tr> <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"> <tbody> <tr> <td style="width:110px;"> <img alt="" height="auto" src="https://fin.com.hr/icons/logo.svg" style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" title="" width="110"/> </td></tr></tbody> </table> </td></tr></table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table> </div><!--[if mso | IE]> </td></tr></table> <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" > <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"> <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;"><!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td class="" style="vertical-align:top;width:600px;" ><![endif]--> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"> <tr> <td align="center" style="font-size:0px;padding:10px 25px;padding-top:40px;padding-right:50px;padding-bottom:0px;padding-left:50px;word-break:break-word;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"> <tbody> <tr> <td style="width:300px;"> <img alt="" height="auto" src="http://9pl9.mjt.lu/tplimg/9pl9/b/yvrt/t65sn.png" style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" title="" width="300"/> </td></tr></tbody> </table> </td></tr></table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table> </div><!--[if mso | IE]> </td></tr></table> <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" > <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"> <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:20px 0px 20px 0px;padding-bottom:70px;padding-top:30px;text-align:center;"><!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td class="" style="vertical-align:top;width:600px;" ><![endif]--> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"> <tr> <td align="left" style="font-size:0px;padding:0px 25px 0px 25px;padding-top:0px;padding-right:50px;padding-bottom:0px;padding-left:50px;word-break:break-word;"> <div style="font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;color:#797e82;"> <h1 style="text-align:center; color: #000000; line-height:32px">Bok ${username},</h1> </div></td></tr><tr> <td align="left" style="font-size:0px;padding:0px 25px 0px 25px;padding-top:0px;padding-right:50px;padding-bottom:0px;padding-left:50px;word-break:break-word;"> <div style="font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;color:#797e82;"> <p style="margin: 10px 0; text-align: center;">${owner.email}vam je dopusutio pristup podatcima svog poslovanja.&nbsp;</p><p style="margin: 10px 0; text-align: center;">Nakon registracije pritisnite gumb ispod kako bi prihvatiili pozivnicu</p></div></td></tr><tr> <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:10px;word-break:break-word;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"> <tr> <td align="center" bgcolor="#5E14FF" role="presentation" style="border:none;border-radius:100px;cursor:auto;mso-padding-alt:15px 25px 15px 25px;background:#5E14FF;" valign="middle"> <a href="https://fin.com.hr/invitation/${option._id}" style="display:inline-block;background:#5E14FF;color:#ffffff;font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:15px 25px 15px 25px;mso-padding-alt:0px;border-radius:100px;" target="_blank"> <b style="font-weight:700"><b style="font-weight:700">Prihvati pozivnicu</b></b> </a> </td></tr></table> </td></tr></table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </div></body></html>
        `,
      };

      mail.send(data);
    }

    res.status(201).json({ message: "all ok" });
  }
};

export default addAccountHandler;
