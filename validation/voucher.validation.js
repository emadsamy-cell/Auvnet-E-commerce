const joi = require("joi");
const { offerType, voucherStatus } = require("../enums/voucher")
const { audienceLocation } = require("../enums/coupon");

exports.createVoucher = {
    body: joi.object({
        code: joi.string().alphanum().required().messages({
            'string.empty': "Voucher code can't be empty.",
            'any.required': 'Voucher code is required.',
            'string.alphanum': 'Voucher code must be alphanumeric.',
        }),

        description: joi.string().required().messages({
            'string.empty': "Description can't be empty.",
            'any.required': 'Description is required.',
        }),

        offerType: joi.string().valid(offerType.COINS, offerType.DISCOUNT, offerType.SUBSCRIPTION).required().messages({
            'any.only': `Offer type must be either ${offerType.COINS} or ${offerType.DISCOUNT} or ${offerType.SUBSCRIPTION}.`,
            'any.required': 'Offer type is required.',
        }),

        offerValue: joi.number().min(0).required().messages({
            'number.min': 'offerValue must be greater than or equal to 0',
            'number.base': 'offerValue must be a number.',
            'any.required': 'Offer value is required.',
        }),

        expireAt: joi.date().greater('now').optional().messages({
            'date.greater': 'Expiration date must be in the future.',
            'date.base': 'Expiration date must be a valid date (YYYY-MM-DD).',
        }),

<<<<<<< HEAD
        numberOfVouchers: joi.number().min(0).messages({
            'number.min': 'Number of vouchers must be greater than or equal to 0.',
=======
        numberOfVouchers: joi.number().min(1).messages({
            'number.min': 'Number of vouchers must be greater than or equal to 1.',
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
            'number.base': 'Number of vouchers must be a number.',
        }),

        termsAndConditions: joi.object({
            minCoins: joi.number().min(0).optional().messages({
                'number.min': 'Minimum coins value must be greater than or equal to 0.',
                'number.base': 'Minimum coins value must be a number.',
            }),
            audienceLocation: joi.object({
                type: joi.string().valid(audienceLocation.REGION, audienceLocation.COUNTRY, audienceLocation.CITY).required().messages({
                    'any.only': `Audience location type must be ${audienceLocation.REGION}, ${audienceLocation.COUNTRY}, or ${audienceLocation.CITY}.`,
                    'any.required': 'Type is required when audienceLocation is provided.',
                }),
                location: joi.string().required().messages({
                    'any.required': 'Location is required when audienceLocation is provided.',
                    'string.empty': 'Location can not be empty.',
                    'string.base': 'Location must be a string.',
                })
            }).optional().messages({
                'object.base': 'Audience location must be an object.',
            }),
        }),
    })
}

exports.getVouchers = {
    query: joi.object({
        status: joi.string().valid(voucherStatus.ACTIVE, voucherStatus.EXPIRED, voucherStatus.USED).optional().messages({
            'any.only': `Status must be either ${voucherStatus.ACTIVE} or ${voucherStatus.EXPIRED} or ${voucherStatus.USED}.`,
            'string.base': 'Status must be a string.',
            'string.empty': 'Status can not be empty.',
        }),

        code: joi.string().alphanum().optional().messages({
            'string.empty': 'Voucher code can not be empty.',
            'string.base': 'Voucher code must be a string.',
            'string.alphanum': 'Voucher code must be alphanumeric.',
        }),

        date: joi.date().greater('now').optional().messages({
            'date.base': 'Date must be a valid date.',
            'date.empty': 'Date can not be empty.',
            'date.greater': 'Expiry date must be in the future.',
        }),

        page: joi.number().min(1).optional().messages({
            'number.base': 'Page must be a number.',
            'number.min': 'Page must be greater than or equal to 1.',
        }),

        size: joi.number().min(1).optional().messages({
            'number.base': 'Size must be a number.',
            'number.min': 'Size must be greater than or equal to 1.',
        }),

        sortBy: joi.string().valid('expireAt', 'status').optional().messages({
            'string.base': 'Sort by must be a string.',
            'string.valid': 'Sort by must be either expireAt or status.',
            'string.empty': 'Sort by can not be empty.',
        }),

        sortOrder: joi.string().valid('asc', 'desc').optional().messages({
            'string.base': 'Sort order must be a string.',
            'string.valid': 'Sort order must be either asc or desc.',
            'string.empty': 'Sort order can not be empty.',
        }),
    })
}

exports.getVoucher = {
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.length': 'Voucher ID must be exactly 24 characters long.',
            'string.base': 'Voucher ID must be a string.',
            'string.empty': 'Voucher ID can not be empty.',
            'any.required': 'Voucher ID is required.',
        }),
    })
}

exports.updateVoucher = {
    body: joi.object({
        code: joi.string().alphanum().optional().messages({
            'string.empty': "Voucher code can't be empty.",
            'string.alphanum': 'Voucher code must be alphanumeric.',
        }),

        description: joi.string().optional().messages({
            'string.empty': "Description can't be empty.",
            'any.required': 'Description is required.',
        }),

        offerType: joi.string().valid(offerType.COINS, offerType.DISCOUNT, offerType.SUBSCRIPTION).optional().messages({
            'any.only': `Offer type must be either ${offerType.COINS} or ${offerType.DISCOUNT} or ${offerType.SUBSCRIPTION}.`,
        }),

        offerValue: joi.number().optional().min(0).messages({
            'number.min': 'offerValue must be greater than or equal to 0',
            'number.base': 'offerValue must be a number.',
        }),

        expireAt: joi.date().greater('now').optional().messages({
            'date.greater': 'Expiration date must be in the future.',
            'date.base': 'Expiration date must be a valid date (YYYY-MM-DD).',
        }),

        status: joi.string().valid(voucherStatus.ACTIVE, voucherStatus.EXPIRED, voucherStatus.USED).optional().messages({
            'any.only': `Status must be either ${voucherStatus.ACTIVE} or ${voucherStatus.EXPIRED} or ${voucherStatus.USED}.`,
            'string.base': 'Status must be a string.',
            'string.empty': 'Status can not be empty.',
        }),

<<<<<<< HEAD
        numberOfVouchers: joi.number().min(0).messages({
            'number.min': 'Number of vouchers must be greater than or equal to 0.',
=======
        numberOfVouchers: joi.number().min(1).messages({
            'number.min': 'Number of vouchers must be greater than or equal to 1.',
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
            'number.base': 'Number of vouchers must be a number.',
        }),

        termsAndConditions: joi.object({
            minCoins: joi.number().min(0).optional().messages({
                'number.min': 'Minimum coins value must be greater than or equal to 0.',
                'number.base': 'Minimum coins value must be a number.',
            }),
            audienceLocation: joi.object({
                type: joi.string().valid(audienceLocation.REGION, audienceLocation.COUNTRY, audienceLocation.CITY).required().messages({
                    'any.only': `Audience location type must be ${audienceLocation.REGION}, ${audienceLocation.COUNTRY}, or ${audienceLocation.CITY}.`,
                    'any.required': 'Type is required when audienceLocation is provided.',
                }),
                location: joi.string().required().messages({
                    'any.required': 'Location is required when audienceLocation is provided.',
                    'string.empty': 'Location can not be empty.',
                    'string.base': 'Location must be a string.',
                })
            }).optional().messages({
                'object.base': 'Audience location must be an object.',
            }),
        }),

        usedBy: joi.array().items(joi.string().length(24)).optional().messages({
            'array.base': 'Used by must be an array.',
            'array.empty': 'Used by can not be empty.',
            'array.items': 'Used by must be an array of strings.',
        }),
    })
}

exports.deleteVoucher = {
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.length': 'Voucher ID must be exactly 24 characters long.',
            'string.base': 'Voucher ID must be a string.',
            'string.empty': 'Voucher ID can not be empty.',
            'any.required': 'Voucher ID is required.',
        }),
    })
}

exports.claimVoucher = {
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.length': 'Voucher ID must be exactly 24 characters long.',
            'string.base': 'Voucher ID must be a string.',
            'string.empty': 'Voucher ID can not be empty.',
            'any.required': 'Voucher ID is required.',
        }),
    })
}

exports.redeemVoucher = {
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.length': 'Voucher ID must be exactly 24 characters long.',
            'string.base': 'Voucher ID must be a string.',
            'string.empty': 'Voucher ID can not be empty.',
            'any.required': 'Voucher ID is required.',
        }),
    })
}