const router = require("express").Router();
const auth = require("../../middlewares/auth");
const { validation } = require("../../middlewares/validation")
const couponValidation = require("../../validation/coupon.validation");
const endpoints = require("../../endpoints/coupon.endpoint");
const couponController = require("../../controllers/coupon.controller");

router.post('/', validation(couponValidation.createCoupon), auth(endpoints.CREATE_COUPON), couponController.create)

router.get('/', validation(couponValidation.getCoupons), auth(endpoints.GET_COUPONS), couponController.getAll)

router.get('/:id', validation(couponValidation.getCoupon), auth(endpoints.GET_COUPON), couponController.getById)

module.exports = router;