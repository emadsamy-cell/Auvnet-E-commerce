// Vendor Endpoints Policy
const {
    GET_VENDOR,
    UPDATE_VENDOR
} = require('../../endpoints/vendor.endpoints');

const {
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON,
    UPDATE_COUPON,
    DELETE_COUPON
} = require("../../endpoints/coupon.endpoint")

// Category Endpoints Policy
const {
    GET_CATEGORY,
} = require('../../endpoints/category.endpoints');

const {
    GET_COLLECTION,
    CREATE_COLLECTION,
    UPDATE_COLLECTION,
    DELETE_COLLECTION
} = require('../../endpoints/collection.endpoints');

module.exports = [
    GET_VENDOR,
    UPDATE_VENDOR,
    CREATE_COUPON,
    GET_COUPONS,
    GET_COUPON,
    UPDATE_COUPON,
    DELETE_COUPON,

    GET_CATEGORY,

    GET_COLLECTION,
    CREATE_COLLECTION,
    UPDATE_COLLECTION,
    DELETE_COLLECTION
];