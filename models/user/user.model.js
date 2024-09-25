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
        lowercase: true
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    OTP: {
        type: String,
        default: null
    },
    address: {
        country: {
            type: String,
        },
        city: {
            type: String,
        },
        region: {
            type: String,
        },
        coordinates: {
            latitude:{
                type: Number,
            },
            longitude: {
                type: Number,
            }
        }
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
        ref: 'Coupon'
    },
    voucherClaimed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher'
    },
    resetToken: {
        type: String, 
    },
    resetTokenExpire: {
        type: Date,
    },
});

userSchema.index({ 'notifications.expireAt': 1 }, {expireAfterSeconds: 0});

module.exports = mongoose.model('User', userSchema);