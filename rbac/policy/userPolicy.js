// User Endpoints Policy
const {
    GET_USER,
    UPDATE_USER
} = require('../../endpoints/user.endpoints');

// Category Endpoints Policy
const {
    GET_CATEGORY,
} = require('../../endpoints/category.endpoints');


module.exports = [
    GET_USER,
    UPDATE_USER,

    GET_CATEGORY
];