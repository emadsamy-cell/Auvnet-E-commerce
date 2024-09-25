const joi = require("joi");

const adminLoginValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(3).required(),
      password: joi.string().min(5).required(),
    }),
};

const verifyOTPValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(3).required(),
      OTP: joi.string().min(6).max(6).required(),
    }),
};

const requestOTPValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(3).required(),
    }),
};

module.exports = {
  adminLoginValidation,
  verifyOTPValidation,
  requestOTPValidation,
};
