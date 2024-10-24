const Joi = require('joi');

// Define the validation schema
exports.getCategories = {
    query: Joi.object({
        page: Joi.number()
        .min(1)
        .message({
            'number.base': 'Page must be a number',
            'number.min': 'Page must be at least 1',
        }),
        size: Joi.number()
        .min(1)
        .message({
            'number.base': 'size must be a number',
            'number.min': 'size must be at least 1',
        }),
    }),
};

exports.createCategory = {
    body: Joi.object({
      name: Joi.string()
        .max(30)
        .required()
        .messages({
          'string.base': 'Name should be a type of text',
          'string.empty': 'Name cannot be empty',
          'string.max': 'Name should have at most 30 characters',
          'any.required': 'Name is required'
        }),
      parent: Joi.string()
      .required()
      .length(24)
      .allow(null)
      .messages({
          'string.base': 'Parent should be a type of text',
          'string.empty': 'Parent cannot be empty',
          'string.length': 'Parent should have 24 characters',
          'any.required': 'Parent is required'
      }),
    }),
};

exports.updateCategory = {
    params: Joi.object({
        id: Joi.string()
        .min(24)
        .max(24)
        .messages({
            'string.base': 'Id must be a type of text',
            'string.empty': 'Id cannot be empty',
            'string.min': 'Id should have at least 24 characters',
            'string.max': 'Id should have at most 24 characters',
        }),
    }),
    body: Joi.object({
        name: Joi.string()
        .required()
        .max(30)
        .messages({
            'string.base': 'Name should be a type of text',
            'string.empty': 'Name cannot be empty',
            'string.max': 'Name should have at most 30 characters',
            'any.required': 'Name is required'
        })
    }),
};

exports.deleteCategory = {
    params: Joi.object({
        id: Joi.string()
        .min(24)
        .max(24)
        .message('Id must be a valid 24-character hex string (MongoDB ObjectId).'),
    }),
};
