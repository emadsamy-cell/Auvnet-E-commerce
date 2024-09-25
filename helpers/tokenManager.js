const jwt = require('jsonwebtoken');

const generateToken = (id, role, expiresIn) => {
    // jwt options
    const payload = {
        id,
        role
    };
    const secretKey = process.env.JWT_SECRET_KEY;
    const option = {
        expiresIn: "30d"
    }

    // create token
    const token = jwt.sign(payload, secretKey, option);
    return token;
}

const compareToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
}

module.exports = {
    generateToken,
    compareToken
};
