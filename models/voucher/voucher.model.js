const mongoose = require('mongoose');
const { offerType, voucherStatus } = require("../../enums/voucher")
const { audienceLocation } = require("../../enums/coupon");

const voucherSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true
    },
    offerType: {
        type: String,
        enum: [offerType.SUBSCRIPTION, offerType.COINS, offerType.DISCOUNT],
        required: true
    },
    offerValue: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: [voucherStatus.ACTIVE, voucherStatus.EXPIRED, voucherStatus.USED],
        default: voucherStatus.ACTIVE
    },
    expireAt: {
        type: Date,
        index: { expires: 0 }
    },
    // Quantity of vouchers available
    numberOfVouchers: {
        type: Number,
        min: 0
    },
    // Number of times coupon has been used
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],
    // Terms and conditions for the voucher
    termsAndConditions: {
        minCoins: {
            type: Number,
            min: 0,
            default: 0
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
});

voucherSchema.index({ 'audienceLocation.type': 1, 'audienceLocation.location': 1 });

module.exports = mongoose.model('Voucher', voucherSchema);