const {
  GET_PROFILE,
  UPDATE_PROFILE,
  CREATE_ACCOUNT,
  GET_ADMINS,
  UPDATE_ROLE,
  DELETE_ADMIN
} = require("../../endpoints/admin.endpoint");

// Category Endpoints Policy
const {
  GET_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
} = require("../../endpoints/category.endpoints");

module.exports = [
  GET_PROFILE, UPDATE_PROFILE, CREATE_ACCOUNT, GET_ADMINS, UPDATE_ROLE, DELETE_ADMIN,

  GET_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
];
