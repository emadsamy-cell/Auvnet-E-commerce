<<<<<<< HEAD
const { visibility } = require('../enums/collection');
=======
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
const Joi = require('joi');

// Define the validation schema
exports.getAll = {
  query: Joi.object({
    page: Joi.number().min(1).message({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1',
    }),
    size: Joi.number().min(1).message({
        'number.base': 'size must be a number',
        'number.min': 'size must be at least 1',
    }),
    vendor: Joi.string().length(24).message(
      'Vendor must be a valid 24-character hex string (MongoDB ObjectId).'
    ),
  }),
};

exports.getProducts = {
  params: Joi.object({
    collectionID: Joi.string().length(24).messages({
      'string.base': 'Collection ID should be a type of text',
      'string.empty': 'Collection ID cannot be empty',
      'string.length': 'Collection ID should have 24 characters',
      'any.required': 'Collection ID is required'
    }),
  }),
  query: Joi.object({
    name: Joi.string().messages({
        'string.base': 'Name should be a type of text',
      }),
    minPrice: Joi.number().min(0).message({
        'number.base': 'Min price must be a number',
        'number.min': 'Min price must be at least 0',
      }),
    maxPrice: Joi.number().min(0).message({
        'number.base': 'Max price must be a number',
        'number.min': 'Max price must be at least 0',
      }),
    category: Joi.string().length(24).message(
      'Category must be a valid 24-character hex string (MongoDB ObjectId).'
      ),
    page: Joi.number().min(1).message({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1',
      }),
    size: Joi.number().min(1).message({
        'number.base': 'size must be a number',
        'number.min': 'size must be at least 1',
    }),
<<<<<<< HEAD
    availability: Joi.boolean().messages({
      'boolean.base': 'Availability should be a type of boolean',
    }),
    visibility: Joi.string().valid(visibility.PUBLIC, visibility.HIDDEN).messages({
      'string.base': 'Visibility should be a type of text',
      'string.valid': 'Visibility should be either public or hidden',
    }),
=======
    availability: Joi.boolean().invalid(false).messages({
        'boolean.invalid': 'Availability should be true',
    })
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
  })
};

exports.createCollection = {
  body: Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Name should be a type of text',
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),
    description: Joi.string().messages({
      'string.base': 'Description should be a type of text',
      'string.empty': 'Description cannot be empty',
    }),
  }),
};

exports.updateCollection = {
  params: Joi.object({
    collectionID: Joi.string().length(24).messages({
      'string.base': 'Collection ID should be a type of text',
      'string.empty': 'Collection ID cannot be empty',
      'string.length': 'Collection ID should have 24 characters',
<<<<<<< HEAD
=======
      'any.required': 'Collection ID is required'
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
    }),
  }),
  body: Joi.object({
    name: Joi.string().messages({
      'string.base': 'Name should be a type of text',
      'string.empty': 'Name cannot be empty',
    }),
    description: Joi.string().messages({
      'string.base': 'Description should be a type of text',
      'string.empty': 'Description cannot be empty',
    }),
<<<<<<< HEAD
    visibility: Joi.string().valid(visibility.PUBLIC, visibility.HIDDEN).messages({
=======
    visibility: Joi.string().valid('public', 'hidden').messages({
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
      'string.base': 'Visibility should be a type of text',
      'string.valid': 'Visibility should be either public or hidden',
    }),
  }),
};

exports.deleteCollection = {
  params: Joi.object({
    collectionID: Joi.string().length(24).messages({
      'string.base': 'Collection ID should be a type of text',
      'string.empty': 'Collection ID cannot be empty',
      'string.length': 'Collection ID should have 24 characters',
      'any.required': 'Collection ID is required'
    }),
  }),
};

exports.addProducts = {
<<<<<<< HEAD
  params: Joi.object({
    collectionID: Joi.string().length(24).messages({
      'string.base': 'Collection ID should be a type of text',
      'string.empty': 'Collection ID cannot be empty',
      'string.length': 'Collection ID should have 24 characters',
      'any.required': 'Collection ID is required'
    }),
  }),
=======
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
  body: Joi.object({
    products: Joi.array().items(Joi.string().length(24)).required().messages({
      'array.base': 'Products should be an array',
      'array.empty': 'Products cannot be empty',
      'any.required': 'Products is required'
    }),
<<<<<<< HEAD
=======
    collections: Joi.array().items(Joi.string().length(24)).required().messages({
      'array.base': 'Collections should be an array',
      'array.empty': 'Collections cannot be empty',
      'any.required': 'Collections is required'
    }),
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
  }),
};

exports.removeProducts = {
  params: Joi.object({
    collectionID: Joi.string().length(24).messages({
      'string.base': 'Collection ID should be a type of text',
      'string.empty': 'Collection ID cannot be empty',
      'string.length': 'Collection ID should have 24 characters',
      'any.required': 'Collection ID is required'
    }),
  }),
  body: Joi.object({
    products: Joi.array().items(Joi.string().length(24)).required().messages({
      'array.base': 'Products should be an array',
      'array.empty': 'Products cannot be empty',
      'any.required': 'Products is required'
    }),
  }),
};

exports.restoreCollection = {
  params: Joi.object({
    collectionID: Joi.string().length(24).messages({
      'string.base': 'Collection ID should be a type of text',
      'string.empty': 'Collection ID cannot be empty',
      'string.length': 'Collection ID should have 24 characters',
      'any.required': 'Collection ID is required'
    }),
  }),
};