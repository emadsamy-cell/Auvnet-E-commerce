const Joi = require('joi');

// Define the validation schema
exports.vendorSignIn = {
  body: Joi.object({
    userName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.base': 'Username should be a type of text',
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username should have at least 3 characters',
        'string.max': 'Username should have at most 30 characters',

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
};

exports.verifyOTP = {
  body: Joi.object({
    OTP: Joi.string()
      .alphanum()
      .min(3)
      .max(8)
      .required()
      .messages({
        'string.base': 'OTP should be a type of text',
        'string.empty': 'OTP cannot be empty',
        'string.min': 'OTP should have at least 3 characters',
        'string.max': 'OTP should have at most 8 characters',
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

exports.forgetPassword = {
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

exports.updateVendorProfile = {
  body: Joi.object({
    name: Joi.string()
      .messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be empty',
      }),
    country: Joi.string()
      .messages({
        'string.base': 'Country should be a type of text',
        'string.empty': 'Country cannot be empty',
      }),
    city: Joi.string()
      .messages({
        'string.base': 'City should be a type of text',
        'string.empty': 'City cannot be empty',
      }),
    region: Joi.string()
      .messages({
        'string.base': 'Region should be a type of text',
        'string.empty': 'Region cannot be empty',
      }),
    latitude: Joi.string()
      .pattern(/^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/)
      .messages({
        'string.base': 'Latitude should be a type of text',
        'string.empty': 'Latitude cannot be empty',
        'string.pattern.base': 'Invalid latitude format',
      }),
    longitude: Joi.string()
      .pattern(/^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/)
      .messages({
        'string.base': 'Longitude should be a type of text',
        'string.empty': 'Longitude cannot be empty',
        'string.pattern.base': 'Invalid longitude format',
      }),
    primaryPhone: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/) // Phone number pattern
      .messages({
        'string.base': 'Phone number should be a type of text',
        'string.empty': 'Phone number cannot be empty',
        'string.length': 'Phone number should have 11 characters',
        'string.pattern.base': 'Phone number should contain only digits',
      }),
    secondaryPhone: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/) // Phone number pattern
      .messages({
        'string.base': 'Phone number should be a type of text',
        'string.empty': 'Phone number cannot be empty',
        'string.length': 'Phone number should have 11 characters',
        'string.pattern.base': 'Phone number should contain only digits',
      }),
    gender: Joi.string()
      .valid('Male', 'Female')
      .messages({
        'any.only': 'Gender must be either Male or Female', // Custom message
      })
  }).with('latitude', 'longitude')
    .with('longitude', 'latitude')
    .messages({
      'object.with': 'Latitude and longitude must be provided together',
    })
}

exports.changeUerPassword = {
  body: Joi.object({
    newPassword: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have at least 8 characters',
        'any.required': 'Password is required'
      }),
    confirmPassword: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Confirm password does not match the password',
        'any.required': 'Confirm password is required'
      })
  }),
}

// Vendor Management
exports.createVendor = {
  body: Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Name should be a type of text',
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),
    userName: Joi.string().min(3).max(30).required().messages({
      'string.base': 'Username should be a type of text',
      'string.empty': 'Username cannot be empty',
      'string.min': 'Username should have at least 3 characters',
      'string.max': 'Username should have at most 30 characters',
      'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
      'string.base': 'Email should be a valid string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required()
      .messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
        'string.pattern.base': 'Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character'
      })
  })
}

exports.getVendors = {
  query: Joi.object({
    page: Joi.number().min(1).messages({
      'number.base': 'Page should be a type of number',
      'number.min': 'Page should be greater than 0',
      'any.required': 'Page is required'
    }),
    size: Joi.number().min(1).messages({
      'number.base': 'Limit should be a type of number',
      'number.min': 'Limit should be greater than 0',
      'any.required': 'Limit is required'
    }),
    isDeleted: Joi.boolean().messages({
      'boolean.base': 'isDeleted should be a type of boolean',
    }),
    status: Joi.string().valid('active', 'inactive').messages({
      'any.only': 'Status should be either active or inactive',
    })
  })
}

exports.updateStatus = {
  body: Joi.object({
    status: Joi.string().valid('active', 'inactive').required().messages({
      'any.only': 'Status should be either active or inactive',
      'any.required': 'Status is required'
    })
  }),
  params: Joi.object({
    vendorId: Joi.string().length(24).required().messages({
      'string.base': 'vendorId should be a type of text',
      'string.empty': 'vendorId cannot be empty',
      'any.required': 'vendorId is required',
      'string.length': 'vendorId should have 24 characters'
    })
  })
}

exports.deleteVendor = {
  params: Joi.object({
    vendorId: Joi.string().length(24).required().messages({
      'string.base': 'vendorId should be a type of text',
      'string.empty': 'vendorId cannot be empty',
      'any.required': 'vendorId is required',
      'string.length': 'vendorId should have 24 characters'
    })
  }),
}
