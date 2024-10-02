const {
    GET_PROFILE,
    UPDATE_PROFILE
} = require("../../endpoints/admin.endpoint")

const {
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON
} = require("../../endpoints/coupon.endpoint")

module.exports = [
    GET_PROFILE,
    UPDATE_PROFILE,
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON
]