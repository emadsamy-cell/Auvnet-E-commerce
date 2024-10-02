const {
    GET_VENDOR,
    UPDATE_VENDOR
} = require('../../endpoints/vendor.endpoints');

const {
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON
} = require("../../endpoints/coupon.endpoint")


module.exports = [
    GET_VENDOR,
    UPDATE_VENDOR,
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON
];