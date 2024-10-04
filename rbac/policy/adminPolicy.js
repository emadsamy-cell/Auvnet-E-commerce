const {
    GET_PROFILE,
    UPDATE_PROFILE
} = require("../../endpoints/admin.endpoint")

const {
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON
} = require("../../endpoints/coupon.endpoint")

// Category Endpoints Policy
const {
    GET_CATEGORY,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY
} = require("../../endpoints/category.endpoints")

module.exports = [
    GET_PROFILE,
    UPDATE_PROFILE,
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON,

    GET_CATEGORY,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY
]