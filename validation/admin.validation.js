const joi = require("joi");
const roles = require("../enums/roles");

// _______________________________ Validation Data _______________________________
const userName = joi.string().min(3).max(30).required().alphanum().messages({
  'string.base': 'Username should be a type of text',
  "string.empty": "Username is required",
  "string.min": "Username must be at least 3 characters long",
  'string.alphanum': 'Username should only contain alphanumeric characters',
  'string.max': 'Username should have at most 30 characters',
  "any.required": "Username is required",
})

const password = joi.string().required().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required()
  .messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
    'string.pattern.base': 'Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character'
  })

const email = joi.string().email().required().messages({
  "string.base": "Email should be a type of text",
  "string.empty": "Email is required",
  "string.email": "Email must be a valid email",
  "any.required": "Email is required",
})

const phoneNumber = joi.string().required().messages({
  "string.base": "Phone number should be a type of text",
  "string.empty": "Phone number is required",
  "any.required": "Phone number is required",
})

const OTP = joi.string().min(6).max(6).required().messages({
  "string.empty": "OTP is required",
  "string.min": "OTP must be at least 6 characters long",
  "string.max": "OTP must be at most 6 characters long",
  "any.required": "OTP is required",
  "string.base": "OTP should be a type of text",
})

// _______________________________ Validation Schema _______________________________
exports.adminLoginValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName,
      password: joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
      })
    }),
};

exports.verifyOTPValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName,
      OTP,
    }),
};

exports.requestOTPValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName,
    }),
};

exports.updateAdminProfileValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(3).max(30).alphanum().messages({
        'string.base': 'Username should be a type of text',
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        'string.alphanum': 'Username should only contain alphanumeric characters',
        'string.max': 'Username should have at most 30 characters',
        "any.required": "Username is required",
      }),
      phoneNumber: joi.string().messages({
        "string.base": "Phone number should be a type of text",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
      }),
      email: joi.string().email().messages({
        "string.base": "Email should be a type of text",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
      }),
    }),
};

exports.updateAdminPasswordValidation = {
  body: joi
    .object()
    .required()
    .keys({
      currentPassword: joi.string().required().messages({
        "string.empty": "currentPassword can't be empty",
        "any.required": "currentPassword is required",
      }),
      newPassword: password,
    }),
};

exports.createAdminAccountValidation = {
  body: joi
    .object()
    .required()
    .keys({
      userName,
      password,
      email,
      phoneNumber,
    }),
};

exports.updateAdminRoleValidation = {
  body: joi
    .object()
    .required()
    .keys({
      newRole: joi.string().required().valid(roles.ADMIN, roles.SUPER_ADMIN).messages({
        "string.empty": "newRole is required",
        "any.required": "newRole is required",
        "any.only": `newRole must be either '${roles.ADMIN}' or '${roles.SUPER_ADMIN}'`,
      }),
    }),
  params: joi
    .object()
    .required()
    .keys({
      adminId: joi.string().min(24).max(24).required().messages({
        "string.empty": "adminId is required",
        "any.required": "adminId is required",
        "string.min": "adminId must be 24 characters long",
        "string.max": "adminId must be 24 characters long",
      }),
    }),
};

exports.deleteAdminValidation = {
  params: joi
    .object()
    .required()
    .keys({
      adminId: joi.string().min(24).max(24).required().messages({
        "string.empty": "adminId is required",
        "any.required": "adminId is required",
        "string.min": "adminId must be 24 characters long",
        "string.max": "adminId must be 24 characters long",
      }),
    }),
};

