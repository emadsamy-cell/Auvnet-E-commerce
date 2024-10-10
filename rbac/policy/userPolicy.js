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
    REDEEM_VOUCHER
];