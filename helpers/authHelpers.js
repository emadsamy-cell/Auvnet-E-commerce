const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const salt = +process.env.SALTROUND;
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const generateOTP = () => {
  const value = Math.floor(100000 + Math.random() * 900000);
  //expires in 5 minutes
  const expiresAt = Date.now() + 5 * 60 * 1000;
  return { value, expiresAt };
};

module.exports = {
  hashPassword,
  comparePassword,
  generateOTP,
};
