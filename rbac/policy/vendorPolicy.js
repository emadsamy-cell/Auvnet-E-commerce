// Vendor Endpoints Policy
const {
    GET_VENDOR,
    UPDATE_VENDOR
} = require('../../endpoints/vendor.endpoints');

// Category Endpoints Policy
const {
    GET_CATEGORY,
} = require('../../endpoints/category.endpoints');

module.exports = [
    GET_VENDOR,
    UPDATE_VENDOR,

    GET_CATEGORY
];