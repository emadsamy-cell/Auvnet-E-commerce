// User Endpoints Policy
const {
    GET_USER,
    UPDATE_USER
} = require('../../endpoints/user.endpoints');

// Category Endpoints Policy
const {
    GET_CATEGORY,
} = require('../../endpoints/category.endpoints');

// Coupon Endpoints Policy
const {
    GET_COUPONS,
    GET_COUPON,
    CLAIM_COUPON
} = require("../../endpoints/coupon.endpoints")

// Voucher Endpoints Policy
const {
    GET_VOUCHERS,
    GET_VOUCHER,
    CLAIM_VOUCHER,
    REDEEM_VOUCHER
  } = require("../../endpoints/voucher.endpoints")

// Collection Endpoints Policy
const {
    GET_COLLECTION,
    LIKE_COLLECTION,
    DISLIKE_COLLECTION
} = require('../../endpoints/collection.endpoints');

// Vendor Endpoints Policy
const {
    GET_VENDORS,
    LIKE_VENDOR,
    DISLIKE_VENDOR
} = require('../../endpoints/vendor.endpoints');

// Ad Endpoints Policy
const {
    GET_ADS,
  } = require("../../endpoints/ad.endpoints");

module.exports = [
    GET_USER,
    UPDATE_USER,

    GET_COUPONS,
    GET_COUPON,
    CLAIM_COUPON,

    GET_CATEGORY,

    GET_VOUCHERS,
    GET_VOUCHER,
    CLAIM_VOUCHER,
    REDEEM_VOUCHER,

    GET_COLLECTION,
    LIKE_COLLECTION,
    DISLIKE_COLLECTION,

    GET_VENDORS,
    LIKE_VENDOR,
    DISLIKE_VENDOR,

    GET_ADS,
    
];