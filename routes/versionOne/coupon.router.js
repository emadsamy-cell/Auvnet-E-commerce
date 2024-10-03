const router = require("express").Router();
const auth = require("../../middlewares/auth");
const { validation } = require("../../middlewares/validation")
const couponValidation = require("../../validation/coupon.validation");
const endpoints = require("../../endpoints/coupon.endpoint");
const couponController = require("../../controllers/coupon.controller");

router.post('/', validation(couponValidation.createCoupon), auth(endpoints.CREATE_COUPON), couponController.create)

router.get('/', validation(couponValidation.getCoupons), auth(endpoints.GET_COUPONS), couponController.getAll)

router.get('/:id', validation(couponValidation.getCoupon), auth(endpoints.GET_COUPON), couponController.getById)

router.patch('/:id', validation(couponValidation.updateCoupon), auth(endpoints.UPDATE_COUPON), couponController.update)

router.delete('/:id', validation(couponValidation.deleteCoupon), auth(endpoints.DELETE_COUPON), couponController.delete)

router.patch('/:id/restore', validation(couponValidation.deleteCoupon), auth(endpoints.DELETE_COUPON), couponController.delete)

router.post('/:id/claim', validation(couponValidation.claimCoupon), auth(endpoints.CLAIM_COUPON), couponController.claim)

module.exports = router;