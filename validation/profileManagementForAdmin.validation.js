const joi = require("joi");

const updateAdminProfileValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(3),
      phoneNumber: joi.string(),
      email: joi.string().email(),
    }),
}; 

module.exports = { 
  updateAdminProfileValidation
};