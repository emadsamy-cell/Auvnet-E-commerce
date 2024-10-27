// Vendor Endpoints Policy
const {
    GET_VENDOR,
    UPDATE_VENDOR,
} = require('../../endpoints/vendor.endpoints');

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
} = require('../../endpoints/category.endpoints');

// Collection Endpoints Policy
const {
    GET_COLLECTION,
    CREATE_COLLECTION,
    UPDATE_COLLECTION,
    DELETE_COLLECTION
} = require('../../endpoints/collection.endpoints');

// Review Endpoints Policy
const {
    GET_REVIEWS,
    CREATE_REPLY,
} = require('../../endpoints/review.endpoints');

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
    DELETE_COLLECTION,

    GET_REVIEWS,
    CREATE_REPLY,
];