const Joi = require('joi');

// Define the validation schema
exports.userSignUp = {
  body: Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name should have at least 3 characters',
        'string.max': 'Name should have at most 30 characters',
        'any.required': 'Name is required'
      }),
    
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.base': 'Username should be a type of text',
        'string.alphanum': 'Username should only contain alphanumeric characters',
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username should have at least 3 characters',
        'string.max': 'Username should have at most 30 characters',
        'any.required': 'Username is required'
      }),
  
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'Email should be a valid string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
  
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have at least 8 characters',
        'any.required': 'Password is required'
      }),
  
    confirmPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Confirm password does not match the password',
        'any.required': 'Confirm password is required'
      })
  }),
};

exports.userSignIn = {
  body: Joi.object({
    usernameOrEmail : Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.base': 'Username or Email should be a type of text',
        'any.required': 'Username or Email is required'
      }),
    
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have at least 8 characters',
        'any.required': 'Password is required'
      }),
  })
}

exports.verifyOTP = {
  body: Joi.object({
    OTP : Joi.string()
      .alphanum()
      .min(3)
      .max(8)
      .required()
      .messages({
        'string.base': 'OTP should be a type of text',
        'any.required': 'OTP is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'Email should be a valid string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
  })
}

exports.resendOTP = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'Email should be a valid string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
  })
}

exports.resetPassword = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'Email should be a valid string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have at least 8 characters',
        'any.required': 'Password is required'
      }),
  
    confirmPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Confirm password does not match the password',
        'any.required': 'Confirm password is required'
      })
  }),
}