const {
  GET_PROFILE,
  UPDATE_PROFILE,
  CREATE_ACCOUNT,
  GET_ADMINS,
  UPDATE_ROLE,
  DELETE_ADMIN
} = require("../../endpoints/admin.endpoint");

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
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
} = require("../../endpoints/category.endpoints");

const {
  LIST_USERS,
  DELETE_USER
} = require("../../endpoints/user.endpoints");

const {
  GET_COLLECTION,
  DELETE_COLLECTION
} = require('../../endpoints/collection.endpoints');

module.exports = [
  
  GET_PROFILE,
  UPDATE_PROFILE,
  CREATE_ACCOUNT,
  GET_ADMINS,
  UPDATE_ROLE,
  DELETE_ADMIN,
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
  DELETE_COLLECTION
];
