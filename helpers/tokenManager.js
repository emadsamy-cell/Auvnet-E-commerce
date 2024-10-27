const jwt = require("jsonwebtoken");

const generateToken = (person) => {
  const token = jwt.sign(
    { _id: person._id, userName: person.userName, role: person.role, master: person.master },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};

// Generate Access Token
const generateAccessToken = (person) => {
  const token = jwt.sign(
    { _id: person._id, userName: person.userName, role: person.role, master: person.master },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
  return token;
};

// Generate Refresh Token
const generateRefreshToken = (person) => {
  return jwt.sign(
    { _id: person._id, userName: person.userName, role: person.role, master: person.master },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

const compareToken = (token, key) => {
  const decoded = jwt.verify(token, key);
  return decoded;
};

const decodeToken = (token, options = {}) => {
  return jwt.decode(token, options);
};

module.exports = {
  generateToken,
  compareToken,
  generateAccessToken,
  generateRefreshToken,
  decodeToken
};
