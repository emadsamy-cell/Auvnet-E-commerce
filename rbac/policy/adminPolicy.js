const { GET_PROFILE } = require("../../endpoints/admin.endpoint")
const { UPDATE_PROFILE } = require("../../endpoints/admin.endpoint")

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

    GET_CATEGORY,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY
]