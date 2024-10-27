// Admin Endpoints Policy
const {
    GET_PROFILE,
    UPDATE_PROFILE
} = require("../../endpoints/admin.endpoints")

// Coupon Endpoints Policy
const {
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON,
    UPDATE_COUPON,
    DELETE_COUPON
} = require("../../endpoints/coupon.endpoints")

// Category Endpoints Policy
const {
    GET_CATEGORY,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY
} = require("../../endpoints/category.endpoints")

// Users Endpoints Policy
const {
    LIST_USERS,
    DELETE_USER
} = require("../../endpoints/user.endpoints")

// Vendor Endpoints Policy
const {
    CREATE_VENDOR,
    GET_VENDORS,
    UPDATE_STATUS,
    DELETE_VENDOR
} = require("../../endpoints/vendor.endpoints")

// Voucher Endpoints Policy
const {
    CREATE_VOUCHER,
    GET_VOUCHERS,
    GET_VOUCHER,
    UPDATE_VOUCHER,
    DELETE_VOUCHER,

} = require("../../endpoints/voucher.endpoints")

const {
    GET_COLLECTION,
    DELETE_COLLECTION
} = require('../../endpoints/collection.endpoints');

const {
    GET_REVIEWS,
    DELETE_REVIEW
} = require('../../endpoints/review.endpoints');

module.exports = [
    GET_PROFILE,
    UPDATE_PROFILE,
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON,
    UPDATE_COUPON,
    DELETE_COUPON,

    GET_CATEGORY,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,

    LIST_USERS,
    DELETE_USER,

    GET_COLLECTION,
    DELETE_COLLECTION,

    CREATE_VENDOR,
    GET_VENDORS,
    UPDATE_STATUS,
    DELETE_VENDOR,

    CREATE_VOUCHER,
    GET_VOUCHERS,
    GET_VOUCHER,
    UPDATE_VOUCHER,
    DELETE_VOUCHER,

    GET_REVIEWS,
    DELETE_REVIEW,
]