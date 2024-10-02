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
  GET_COUPON
} = require("../../endpoints/coupon.endpoint")

module.exports = [
  GET_PROFILE,
  UPDATE_PROFILE,
  CREATE_ACCOUNT,
  GET_ADMINS,
  UPDATE_ROLE,
  DELETE_ADMIN,
  CREATE_COUPON,
  GET_COUPONS,
  GET_COUPON
];
