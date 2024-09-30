const moment = require('moment');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    userName: {
        type: String,
        required : true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    OTP: {
        type: String,
        default: null
    },
    OTPExpiresAt: {
        type: Date,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    region: {
        type: String,
        default: null
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    phone: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    accountType: {
        type: String,
        enum: ['system', 'google', 'apple'],
        default: 'system'
    },
    favorite: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    wishlist: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    notifications: [
        {
            title: {
                type: String,
            },
            content: {
                type: String,
            },
            link: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            expireAt: {
                type: Date,
                default: moment().add(2, 'M').toDate()
            },
        }
    ],     
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    coins: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: null
    },
    likedVendors: [
        {
            vendor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vendor'
            }
        }
    ],
    dislikedVendors: [
        {
            vendor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vendor'                
            }
        }
    ],
    couponClaimed: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null
    },
    voucherClaimed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        default: null
    },
    resetToken: {
        type: String,
        select: false
    },
    resetTokenExpire: {
        type: Date,
        select: false
    },
});

userSchema.index({ location: '2dsphere' });

userSchema.index({ 'notifications.expireAt': 1 }, {expireAfterSeconds: 0});

module.exports = mongoose.model('User', userSchema);