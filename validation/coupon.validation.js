const joi = require("joi");
<<<<<<< HEAD
const { audienceLocation, discountType, status, usageLimit } = require("../enums/coupon")
=======
const { audienceLocation, discountType, status, usageLimit, couponType } = require("../enums/coupon")
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9

exports.createCoupon = {
    body: joi.object({
        code: joi.string().trim().alphanum().required().messages({
            'string.empty': "Coupon code can't be empty.",
            'any.required': 'Coupon code is required.',
            'string.alphanum': 'Coupon code must be alphanumeric.',
        }),

        discountType: joi.string().valid(discountType.PURCHASE, discountType.SHIPMENT).required().messages({
            'any.only': `Discount type must be either ${discountType.PURCHASE} or ${discountType.SHIPMENT}.`,
            'any.required': 'Discount type is required.',
        }),

<<<<<<< HEAD
        discountValue: joi.number().min(0).messages({
            'number.min': 'Discount value must be greater than or equal to 0',
=======
        discountValue: joi.number().min(1).messages({
            'number.min': 'Discount value must be greater than or equal to 1',
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
            'number.base': 'Discount value must be a number.',
        }),

        discountPercent: joi.number().min(0).max(100).messages({
            'number.min': 'Discount percent must be greater than or equal to 0',
            'number.max': 'Discount percent must be less than or equal to 100',
            'number.base': 'Discount percent must be a number.',
        }),

        expireAt: joi.date()
            .greater('now')
            .optional()
            .messages({
                'date.greater': 'Expiration date must be in the future.',
                'date.base': 'Expiration date must be a valid date (YYYY-MM-DD).',
            }),

        couponUsage: joi.object({
            type: joi.string().valid(usageLimit.UNLIMITED, usageLimit.LIMITED).required().messages({
                'any.only': `Coupon usage type must be either ${usageLimit.UNLIMITED} or ${usageLimit.LIMITED}.`,
                'any.required': 'Coupon usage type is required.',
            }),
            count: joi.alternatives().conditional('type', {
                is: usageLimit.LIMITED,
                then: joi.number().min(1).required().messages({
                    'any.required': `Usage count is required when usage type is set to ${usageLimit.LIMITED}.`,
                    'number.min': 'Usage count must be at least 1.',
                    'number.base': 'Usage count must be a number.',
                }),
                otherwise: joi.forbidden().messages({
                    'any.unknown': 'Usage count for coupon cannot be provided for UNLIMITED usage type.',
                }),
            }),
        }).required().messages({
            'any.required': 'Coupon usage is required.',
        }),

        userUsage: joi.object({
            type: joi.string().valid(usageLimit.UNLIMITED, usageLimit.LIMITED).required().messages({
                'any.only': `User usage type must be either ${usageLimit.UNLIMITED} or ${usageLimit.LIMITED}.`,
                'any.required': 'User usage type is required.',
            }),
            count: joi.alternatives().conditional('type', {
                is: usageLimit.LIMITED,
                then: joi.number().min(1).required().messages({
                    'any.required': `Usage count is required when usage type is set to ${usageLimit.LIMITED}.`,
                    'number.min': 'Usage count must be at least 1.',
                    'number.base': 'Usage count must be a number.',
                }),
                otherwise: joi.forbidden().messages({
                    'any.unknown': 'Usage count for user cannot be provided for UNLIMITED usage type.',
                }),
            }),
        }).required().messages({
            'any.required': 'User usage is required.',
        }),

        termsAndConditions: joi.object({
            minPurchaseValue: joi.number().min(0).optional().messages({
                'number.min': 'Minimum purchase value must be greater than or equal to 0.',
                'number.base': 'Minimum purchase value must be a number.',
            }),
            maxDiscountLimit: joi.number().min(0).optional().messages({
                'number.min': 'Maximum discount limit must be greater than or equal to 0.',
                'number.base': 'Maximum discount limit must be a number.',
            }),
            audienceLocation: joi.object({
                type: joi.string().required().valid(audienceLocation.REGION, audienceLocation.COUNTRY, audienceLocation.CITY).messages({
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

        products: joi.array().items(
            joi.string().length(24).messages({
                'string.length': 'Each product ID must be exactly 24 characters long.',
                'string.base': 'Each product ID must be a string.',
                'string.empty': 'Product ID can not be empty.',
                'any.required': 'Product ID is required.',
            })
        ).min(1).messages({
            'array.base': 'Products must be an array.',
            'array.min': 'Products array cannot be empty if provided.',
            'array.includes': 'All items in the products array must be valid product IDs.',
        }),

        categories: joi.array().items(
            joi.string().length(24).messages({
                'string.length': 'Each category ID must be exactly 24 characters long.',
                'string.base': 'Each category ID must be a string.',
            })
        ).min(1).messages({
            'array.base': 'Categories must be an array.',
            'array.min': 'Categories array cannot be empty if provided.',
            'array.includes': 'All items in the categories array must be valid categories IDs.',
        }),
    }).xor('discountValue', 'discountPercent').messages({
        'object.xor': 'Either discount value or discount percent must be provided.',
    })
}

exports.getCoupons = {
    query: joi.object({
        status: joi.string().valid(status.ACTIVE, status.EXPIRED).optional().messages({
            'any.only': `Status must be either ${status.ACTIVE} or ${status.INACTIVE}.`,
            'string.base': 'Status must be a string.',
            'string.empty': 'Status can not be empty.',
        }),

        code: joi.string().trim().optional().messages({
            'string.empty': 'Coupon code can not be empty.',
            'string.base': 'Coupon code must be a string.',
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

exports.getCoupon = {
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.length': 'Coupon ID must be exactly 24 characters long.',
            'string.base': 'Coupon ID must be a string.',
            'string.empty': 'Coupon ID can not be empty.',
            'any.required': 'Coupon ID is required.',
        }),
    })
}

exports.updateCoupon = {
    body: joi.object({
<<<<<<< HEAD
=======
        couponType: joi.string().valid(couponType.GLOBAL, couponType.TARGET).optional().messages({
            'any.only': `Coupon type must be either ${couponType.GLOBAL} or ${couponType.TARGET}.`,
            'string.base': 'Coupon type must be a string.',
        }),
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
        code: joi.string().trim().alphanum().messages({
            'string.empty': "Coupon code can't be empty.",
            'string.alphanum': 'Coupon code must be alphanumeric.',
        }),
        status: joi.string().valid(status.ACTIVE, status.EXPIRED).messages({
            'any.only': `Status must be either ${status.ACTIVE} or ${status.INACTIVE}.`,
            'string.base': 'Status must be a string.',
        }),
        discountType: joi.string().valid(discountType.PURCHASE, discountType.SHIPMENT).messages({
            'any.only': `Discount type must be either ${discountType.PURCHASE} or ${discountType.SHIPMENT}.`,
        }),

<<<<<<< HEAD
        discountValue: joi.number().min(0).messages({
            'number.min': 'Discount value must be greater than or equal to 0',
=======
        discountValue: joi.number().min(1).messages({
            'number.min': 'Discount value must be greater than or equal to 1',
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
            'number.base': 'Discount value must be a number.',
        }),

        discountPercent: joi.number().min(0).max(100).messages({
            'number.min': 'Discount percent must be greater than or equal to 0',
            'number.max': 'Discount percent must be less than or equal to 100',
            'number.base': 'Discount percent must be a number.',
        }),

        expireAt: joi.date()
            .greater('now')
            .optional()
            .messages({
                'date.greater': 'Expiration date must be in the future.',
                'date.base': 'Expiration date must be a valid date (YYYY-MM-DD).',
            }),

        couponUsage: joi.object({
            type: joi.string().required().valid(usageLimit.UNLIMITED, usageLimit.LIMITED).messages({
                'any.only': `Coupon usage type must be either ${usageLimit.UNLIMITED} or ${usageLimit.LIMITED}.`,
                'any.required': 'Coupon usage type is required.',
            }),
            count: joi.alternatives().conditional('type', {
                is: usageLimit.LIMITED,
                then: joi.number().min(1).messages({
                    'any.required': `Usage count is required when usage type is set to ${usageLimit.LIMITED}.`,
                    'number.min': 'Usage count must be at least 1.',
                    'number.base': 'Usage count must be a number.',
                }),
                otherwise: joi.forbidden().messages({
                    'any.unknown': 'Usage count for coupon cannot be provided for UNLIMITED usage type.',
                }),
            }),
        }),

        userUsage: joi.object({
            type: joi.string().required().valid(usageLimit.UNLIMITED, usageLimit.LIMITED).messages({
                'any.only': `User usage type must be either ${usageLimit.UNLIMITED} or ${usageLimit.LIMITED}.`,
                'any.required': 'User usage type is required.',
            }),
            count: joi.alternatives().conditional('type', {
                is: usageLimit.LIMITED,
                then: joi.number().min(1).messages({
                    'any.required': `Usage count is required when usage type is set to ${usageLimit.LIMITED}.`,
                    'number.min': 'Usage count must be at least 1.',
                    'number.base': 'Usage count must be a number.',
                }),
                otherwise: joi.forbidden().messages({
                    'any.unknown': 'Usage count for user cannot be provided for UNLIMITED usage type.',
                }),
            }),
        }),

        termsAndConditions: joi.object({
            minPurchaseValue: joi.number().min(0).optional().messages({
                'number.min': 'Minimum purchase value must be greater than or equal to 0.',
                'number.base': 'Minimum purchase value must be a number.',
            }),
            maxDiscountLimit: joi.number().min(0).optional().messages({
                'number.min': 'Maximum discount limit must be greater than or equal to 0.',
                'number.base': 'Maximum discount limit must be a number.',
            }),
            audienceLocation: joi.object({
                type: joi.string().required().valid(audienceLocation.REGION, audienceLocation.COUNTRY, audienceLocation.CITY).messages({
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

        products: joi.array().items(
            joi.string().length(24).messages({
                'string.length': 'Each product ID must be exactly 24 characters long.',
                'string.base': 'Each product ID must be a string.',
                'string.empty': 'Product ID can not be empty.',
                'any.required': 'Product ID is required.',
            })
        ).min(1).messages({
            'array.base': 'Products must be an array.',
            'array.min': 'Products array cannot be empty if provided.',
            'array.includes': 'All items in the products array must be valid product IDs.',
        }),

        categories: joi.array().items(
            joi.string().length(24).messages({
                'string.length': 'Each category ID must be exactly 24 characters long.',
                'string.base': 'Each category ID must be a string.',
            })
        ).min(1).messages({
            'array.base': 'Categories must be an array.',
            'array.min': 'Categories array cannot be empty if provided.',
            'array.includes': 'All items in the categories array must be valid categories IDs.',
        }),
    }).nand('discountValue', 'discountPercent').messages({
        'object.nand': 'Either discount value or discount percent can be provided.',
    }),
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.length': 'Coupon ID must be exactly 24 characters long.',
            'string.base': 'Coupon ID must be a string.',
            'string.empty': 'Coupon ID can not be empty.',
            'any.required': 'Coupon ID is required.',
        }),
    })
}

exports.deleteCoupon = {
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.length': 'Coupon ID must be exactly 24 characters long.',
            'string.base': 'Coupon ID must be a string.',
            'string.empty': 'Coupon ID can not be empty.',
            'any.required': 'Coupon ID is required.',
        }),
    })
}

exports.claimCoupon = {
    params: joi.object({
        id: joi.string().length(24).required().messages({
            'string.length': 'Coupon ID must be exactly 24 characters long.',
            'string.base': 'Coupon ID must be a string.',
            'string.empty': 'Coupon ID can not be empty.',
            'any.required': 'Coupon ID is required.',
        }),
    })
}