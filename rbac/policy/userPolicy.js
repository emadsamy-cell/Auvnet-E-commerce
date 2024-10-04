// User Endpoints Policy
const {
    GET_USER,
    UPDATE_USER
} = require('../../endpoints/user.endpoints');

// Category Endpoints Policy
const {
    GET_CATEGORY,
} = require('../../endpoints/category.endpoints');

const {
    GET_COUPONS,
    GET_COUPON,
    CLAIM_COUPON
} = require("../../endpoints/coupon.endpoint")

module.exports = [
    GET_USER,
    UPDATE_USER,
    GET_COUPONS,
    GET_COUPON,
    CLAIM_COUPON,

    GET_CATEGORY
];