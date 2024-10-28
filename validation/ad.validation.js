const joi = require("joi");
const { audienceLocation } = require("../enums/coupon");  
const { status } = require("../enums/ads") 

const today = new Date();
today.setHours(0, 0, 0, 0);

exports.create = {
    body: joi.object({
        title: joi.string().min(3).max(15).required().messages({
            "string.base": "Title should be a type of text",
            "string.empty": "Title cannot be an empty field",
            "string.min": "Title should have a minimum length of 3",
            "string.max": "Title should have a maximum length of 15",
            "any.required": "Title is a required field"
        }),
        description: joi.string().min(3).max(150).required().messages({
            "string.base": "Description should be a type of text",
            "string.empty": "Description cannot be an empty field",
            "string.min": "Description should have a minimum length of 3",
            "string.max": "Description should have a maximum length of 150",
            "any.required": "Description is a required field"
        }),
        startDate: joi.date().min(today).required().messages({
            "date.base": "Start date should be a type of date",
            "date.empty": "Start date cannot be an empty field",
            "date.min": "Start date cannot be in the past",
            "any.required": "Start date is a required field"
        }),
        endDate: joi.date().greater(joi.ref('startDate')).messages({
            "date.base": "End date should be a type of date",
            "date.empty": "End date cannot be an empty field",
            "date.greater": "End date should be greater than the start date",
        }),
        linkURL: joi.string().uri().required().messages({
            "string.base": "Link URL should be a type of text",
            "string.empty": "Link URL cannot be an empty field",
            "string.uri": "Link URL should be a valid URL",
        }),
        targetAudience: joi.array().items(
            joi.object({
                type: joi.string().valid(audienceLocation.REGION, audienceLocation.COUNTRY, audienceLocation.CITY).required().messages({
                    'any.only': `Audience location type must be one of ${audienceLocation.REGION}, ${audienceLocation.COUNTRY}, or ${audienceLocation.CITY}.`,
                    'any.required': 'Type is required when targetAudience is provided.',
                }),
                location: joi.string().required().messages({
                    'any.required': 'Location is required when targetAudience is provided.',
                    'string.empty': 'Location cannot be empty.',
                    'string.base': 'Location must be a string.',
                })
            })
        ).optional().messages({
            'array.base': 'Target audience must be an array.',
            'object.base': 'Each target audience entry must be an object.',
        })
    }),
}

exports.get = {
    query: joi.object({
        status: joi.string().valid(status.ACTIVE, status.UPCOMING, status.EXPIRED).optional().messages({
            'any.only': `Status must be either ${status.ACTIVE} or ${status.UPCOMING} or ${status.EXPIRED}.`,
            'string.base': 'Status must be a string.',
            'string.empty': 'Status can not be empty.',
        }),

        title: joi.string().optional().messages({
            'string.empty': 'Voucher code can not be empty.',
            'string.base': 'Voucher code must be a string.',
        }),

        page: joi.number().min(1).optional().messages({
            'number.base': 'Page must be a number.',
            'number.min': 'Page must be greater than or equal to 1.',
        }),

        size: joi.number().min(1).optional().messages({
            'number.base': 'Size must be a number.',
            'number.min': 'Size must be greater than or equal to 1.',
        }),

        sortBy: joi.string().valid('startDate', 'status', 'endDate').optional().messages({
            'string.base': 'Sort by must be a string.',
            'string.valid': 'Sort by must be either startDate or endDate or status.',
            'string.empty': 'Sort by can not be empty.',
        }),

        sortOrder: joi.string().valid('asc', 'desc').optional().messages({
            'string.base': 'Sort order must be a string.',
            'string.valid': 'Sort order must be either asc or desc.',
            'string.empty': 'Sort order can not be empty.',
        }),
    })
}

exports.update = {
    body: joi.object({
        title: joi.string().min(3).max(15).messages({
            "string.base": "Title should be a type of text",
            "string.empty": "Title cannot be an empty field",
            "string.min": "Title should have a minimum length of 3",
            "string.max": "Title should have a maximum length of 15",
        }),
        description: joi.string().min(3).max(150).messages({
            "string.base": "Description should be a type of text",
            "string.empty": "Description cannot be an empty field",
            "string.min": "Description should have a minimum length of 3",
            "string.max": "Description should have a maximum length of 150",
        }),
        startDate: joi.date().min(today).messages({
            "date.base": "Start date should be a type of date",
            "date.empty": "Start date cannot be an empty field",
            "date.min": "Start date cannot be in the past",
        }),
        endDate: joi.date().min(today).messages({
            "date.base": "End date should be a type of date",
            "date.empty": "End date cannot be an empty field",
            "date.greater": "End date should be greater than the start date",
        }),
        status: joi.string().valid(status.ACTIVE, status.UPCOMING, status.EXPIRED).messages({
            'any.only': `Status must be either ${status.ACTIVE} or ${status.UPCOMING} or ${status.EXPIRED}.`,
            'string.base': 'Status must be a string.',
            'string.empty': 'Status can not be empty.',
        }),
        linkURL: joi.string().uri().messages({
            "string.base": "Link URL should be a type of text",
            "string.empty": "Link URL cannot be an empty field",
            "string.uri": "Link URL should be a valid URL",
        }),
        targetAudience: joi.array().min(0).items(
            joi.object({
                type: joi.string().valid(audienceLocation.REGION, audienceLocation.COUNTRY, audienceLocation.CITY).messages({
                    'any.only': `Audience location type must be one of ${audienceLocation.REGION}, ${audienceLocation.COUNTRY}, or ${audienceLocation.CITY}.`,
                    'any.required': 'Type is required when targetAudience is provided.',
                }),
                location: joi.string().messages({
                    'any.required': 'Location is required when targetAudience is provided.',
                    'string.empty': 'Location cannot be empty.',
                    'string.base': 'Location must be a string.',
                })
            })
        ).optional().messages({
            'array.base': 'Target audience must be an array.',
            'object.base': 'Each target audience entry must be an object.',
        })
    }),
}

exports.delete = {
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.base': 'Id must be a string.',
            'string.empty': 'Id can not be empty.',
            'string.length': 'Id must be 24 characters long.',
        }),
    })
}