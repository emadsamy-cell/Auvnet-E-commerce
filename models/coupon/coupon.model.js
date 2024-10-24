const mongoose = require('mongoose');
const { couponType, discountType, status, usageLimit, audienceLocation } = require('../../enums/coupon')

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    couponType: {
        type: String,
        enum: [couponType.GLOBAL, couponType.TARGET],
        required: true
    },
    // Either applies to a purchase or shipping discount
    discountType: {
        type: String,
        enum: [discountType.PURCHASE, discountType.SHIPMENT], 
        required: true
    },
    // For fixed-value discount or shipping discount
    discountValue: {
        type: Number,
        required: function () {
            return this.discountPercent == null;
        },
        min: 0
    },
    // Percentage discount or shipping discount
    discountPercent: {
        type: Number,
        required: function () {
            return this.discountValue == null;
        },
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: [status.ACTIVE, status.EXPIRED],
        default: status.ACTIVE
    },
    expireAt: {
        type: Date,
    },
    // Quantity of coupon available
    couponUsage: {
        type: {
            type: String,
            enum: [usageLimit.UNLIMITED, usageLimit.LIMITED],
            required: true
        },
        count: {
            type: Number,
            min: 1
        }
    },
    // Whether a user can use it once or multiple times
    userUsage: {
        type: {
            type: String,
            enum: [usageLimit.UNLIMITED, usageLimit.LIMITED],
            required: true
        },
        count: {
            type: Number,
            min: 1
        }
    },
    // Number of times coupon has been used
    usedBy: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',  
                required: true,
                index: true
            },
            count: {
                type: Number,
                default: 0,
                required: true
            }
        }
    ],
    totalUsed: {
        type: Number,
        default: 0
    },
    // Terms and conditions for the coupon
    termsAndConditions: {
        minPurchaseValue: {
            type: Number,
            min: 0
        },
        maxDiscountLimit: {
            type: Number,
            min: 0
        },
        audienceLocation: {
            type: {
                type: String,
                enum: [audienceLocation.REGION, audienceLocation.COUNTRY, audienceLocation.CITY],
            },
            location: {
                type: String,
            }
        }
    },
    // Vendor or admin who created the coupon
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },

    // Array of product IDs to which the coupon applies
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
    }],
    // Array of category IDs to which the coupon applies
    categories: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

couponSchema.index({ 'audienceLocation.type': 1, 'audienceLocation.location': 1 });

// Validate that either vendor or admin is provided
couponSchema.pre('validate', function(next) {
    const hasVendor = !!this.vendor;
    const hasAdmin = !!this.admin;
    // Check if both fields are present or neither is present
    if (hasVendor && hasAdmin) {
        return next(new Error('Only one of vendor or admin can be provided.', { cause: 400 }));
    }
    if (!hasVendor && !hasAdmin) {
        return next(new Error('Either vendor or admin must be provided.', { cause: 400 }));
    }
    next();
});

module.exports = mongoose.model('Coupon', couponSchema);