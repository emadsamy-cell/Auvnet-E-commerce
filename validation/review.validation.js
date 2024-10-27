const Joi = require('joi');

// Define the validation schema
exports.get = {
  params: Joi.object({
    productID: Joi.string().length(24).messages({
      'string.base': 'Product ID should be a type of text',
      'string.empty': 'Product ID cannot be empty',
      'string.length': 'Product ID should have 24 characters',
      'any.required': 'Product ID is required'
    }),
  }),
  query: Joi.object({
    page: Joi.number().min(1).message({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1',
        }),
    size: Joi.number().min(1).message({
        'number.base': 'size must be a number',
        'number.min': 'size must be at least 1',
        }),
    isVerified: Joi.boolean().messages({
        'boolean.base': 'isVerified should be a type of boolean',
        }),
    search: Joi.string().messages({
        'string.base': 'Search should be a type of text',
        }),
    filterByStar: Joi.number().integer().min(1).max(5).message({
        'number.base': 'Filter by star must be a number',
        'number.min': 'Filter by star must be at least 1',
        'number.max': 'Filter by star must be at most 5',
        'number.integer': 'Filter by star must be an integer',
        }),
  }),
};

exports.create = {
  params: Joi.object({
    productID: Joi.string().length(24).messages({
      'string.base': 'Product ID should be a type of text',
      'string.empty': 'Product ID cannot be empty',
      'string.length': 'Product ID should have 24 characters',
      'any.required': 'Product ID is required'
    }),
  }),
  body: Joi.object({
    title: Joi.string().max(100).required().messages({
      'string.base': 'Title should be a type of text',
      'string.empty': 'Title cannot be empty',
      'string.max': 'Title should have a maximum length of 100 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().max(300).required().messages({
      'string.base': 'Description should be a type of text',
      'string.empty': 'Description cannot be empty',
      'string.max': 'Description should have a maximum length of 300 characters',
      'any.required': 'Description is required'
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.base': 'Rating should be a type of number',
      'number.min': 'Rating should be at least 1',
      'number.max': 'Rating should be at most 5',
      'number.integer': 'Rating should be an integer',
      'any.required': 'Rating is required'
    }),
  }),
};

exports.reply = {
  params: Joi.object({
    reviewID: Joi.string().length(24).messages({
      'string.base': 'Review ID should be a type of text',
      'string.empty': 'Review ID cannot be empty',
      'string.length': 'Review ID should have 24 characters',
    }),
  }),
  body: Joi.object({
    message: Joi.string().required().max(300).messages({
      'string.base': 'Message should be a type of text',
      'string.empty': 'Message cannot be empty',
      'string.max': 'Message should have a maximum length of 300 characters',
      'any.required': 'Message is required'
    }),
  }),
};

exports.update = {
  params: Joi.object({
    reviewID: Joi.string().length(24).messages({
      'string.base': 'Review ID should be a type of text',
      'string.empty': 'Review ID cannot be empty',
      'string.length': 'Review ID should have 24 characters',
    }),
  }),
  body: Joi.object({
    title: Joi.string().max(100).messages({
      'string.base': 'Title should be a type of text',
      'string.empty': 'Title cannot be empty',
      'string.max': 'Title should have a maximum length of 100 characters',
    }),
    description: Joi.string().max(300).messages({
      'string.base': 'Description should be a type of text',
      'string.empty': 'Description cannot be empty',
      'string.max': 'Description should have a maximum length of 300 characters',
    }),
    rating: Joi.number().integer().min(1).max(5).messages({
      'number.base': 'Rating should be a type of number',
      'number.min': 'Rating should be at least 1',
      'number.max': 'Rating should be at most 5',
      'number.integer': 'Rating should be an integer',
    }),
  }),
};

exports.parameterID = {
  params: Joi.object({
    reviewID: Joi.string().length(24).messages({
      'string.base': 'Review ID should be a type of text',
      'string.empty': 'Review ID cannot be empty',
      'string.length': 'Review ID should have 24 characters',
    }),
  }),
};