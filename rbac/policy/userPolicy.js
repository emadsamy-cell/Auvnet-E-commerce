const {
    GET_USER,
    UPDATE_USER
} = require('../../endpoints/user.endpoints');

const {
    GET_COUPONS,
    GET_COUPON
} = require("../../endpoints/coupon.endpoint")

module.exports = [
    GET_USER,
    UPDATE_USER,
    GET_COUPONS,
    GET_COUPON
];