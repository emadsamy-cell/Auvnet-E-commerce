const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
};