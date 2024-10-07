// Admin Endpoints Policy.
const {
  GET_PROFILE,
  UPDATE_PROFILE,
  CREATE_ACCOUNT,
  GET_ADMINS,
  UPDATE_ROLE,
  DELETE_ADMIN
} = require("../../endpoints/admin.endpoint");

// Coupon Endpoints Policy
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
  DELETE_VENDOR,

} = require("../../endpoints/vendor.endpoints")

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

  CREATE_VENDOR,
  GET_VENDORS,
  UPDATE_STATUS,
  DELETE_VENDOR,
];
