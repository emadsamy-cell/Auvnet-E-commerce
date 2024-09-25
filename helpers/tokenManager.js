const jwt = require("jsonwebtoken");

const generateToken = (person) => {
  const token = jwt.sign(
    { _id: person._id, userName: person.userName, role: person.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};

const compareToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return decoded;
};

module.exports = {
  generateToken,
  compareToken,
};
