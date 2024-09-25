const jwt = require("jsonwebtoken");

const generateToken = (person) => {
  const token = jwt.sign(
    { id: person._id, userName: person.userName, role: person.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );
  return token;
};

const compareToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

module.exports = {
  generateToken,
  compareToken,
};
