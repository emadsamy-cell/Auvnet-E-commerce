const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const templateManager = require('../helpers/email.template');

const transporter = nodemailer.createTransport(emailConfig);

exports.emailSetup = async(emailType, emailOptions) => {
  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: emailOptions.email
  };

  if (emailType === "OTPVerification") {
    mailOptions['subject'] = emailOptions.subject,
    mailOptions['html'] = templateManager.otpTemplate(emailOptions.OTP)
  }

  else if (emailType === "forgetPassword") {
    mailOptions['subject'] = emailOptions.subject,
    mailOptions['html'] = templateManager.forgetTemplate(emailOptions.OTP)
  }

  else if (emailType === "confirmedResetEmail") {
    mailOptions['subject'] = emailOptions.subject,
    mailOptions['html'] = templateManager.confirmResetPassword
  }

  else if(emailType === "adminCredentials"){
    mailOptions['subject'] = emailOptions.subject,
    mailOptions['html'] = templateManager.adminCredentials(emailOptions.userName, emailOptions.password, emailOptions.phoneNumber)
  }

  const result = await sendEmail(mailOptions);
  return result;
};

const sendEmail = async (mailOptions) => {
  try {
    const result = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      statusCode: 200,
      message: "Email has been sent successfully",
      data: result,
      error: null
    };
  } catch (error) {
    return {
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
        error
    };
  }
}