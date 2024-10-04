// Vendor Endpoints Policy
const {
    GET_VENDOR,
    UPDATE_VENDOR
} = require('../../endpoints/vendor.endpoints');

const {
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON
} = require("../../endpoints/coupon.endpoint")

// Category Endpoints Policy
const {
    GET_CATEGORY,
} = require('../../endpoints/category.endpoints');

module.exports = [
    GET_VENDOR,
    UPDATE_VENDOR,
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON,

    GET_CATEGORY
];