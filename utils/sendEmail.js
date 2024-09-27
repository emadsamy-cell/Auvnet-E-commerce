const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, html, attachments = null) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL, // generated ethereal user
        pass: process.env.SENDER_PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"AUVNET_Ecommerce" <${process.env.SENDEREMAIL}>`, // sender address
      to: email, // list of receivers
      subject,
      html,
      attachments,
    });

    return {
      success: true,
      message: "Email sent successfully",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email, please check your email and try again",
      statusCode: 400,
      error: "Invalid email"
    };
  }
};
