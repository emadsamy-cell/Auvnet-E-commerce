const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const templateManager = require('../helpers/email.template');

const transporter = nodemailer.createTransport(emailConfig);

exports.sendOTPVerificationEmail = async (options) => {
  try {
    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: options.email,
      subject: options.subject,
      html: templateManager.otpTemplate(options.OTP)
    };
  
    // Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
};

exports.sendForgetEmail = async (options) => {
  try {
    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: options.email,
      subject: options.subject,
      html: templateManager.forgetTemplate(options.OTP)
    };
  
    // Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
};

exports.sendConfirmedResetPasswordEmail = async (options) => {
  try {
    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: options.email,
      subject: options.subject,
      html: templateManager.confirmResetPassword
    };
  
    // Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
};



