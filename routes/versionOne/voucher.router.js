const router = require("express").Router();
const auth = require("../../middlewares/auth");
const { validation } = require("../../middlewares/validation")
const voucherValidation = require("../../validation/voucher.validation");
const endpoints = require("../../endpoints/voucher.endpoints");
const voucherController = require("../../controllers/voucher.controller");

router.post('/', validation(voucherValidation.createVoucher), auth(endpoints.CREATE_VOUCHER), voucherController.create)

router.get('/', validation(voucherValidation.getVouchers), auth(endpoints.GET_VOUCHERS), voucherController.getAll)

router.get('/:id', validation(voucherValidation.getVoucher), auth(endpoints.GET_VOUCHER), voucherController.getById)

router.patch('/:id', validation(voucherValidation.updateVoucher), auth(endpoints.UPDATE_VOUCHER), voucherController.update)

router.delete('/:id', validation(voucherValidation.deleteVoucher), auth(endpoints.DELETE_VOUCHER), voucherController.delete)

router.patch('/:id/restore', validation(voucherValidation.deleteVoucher), auth(endpoints.DELETE_VOUCHER), voucherController.delete)

router.post('/:id/claim', validation(voucherValidation.claimVoucher), auth(endpoints.CLAIM_VOUCHER), voucherController.claim)

router.post('/:id/redeem', validation(voucherValidation.redeemVoucher), auth(endpoints.REDEEM_VOUCHER), voucherController.redeem)

module.exports = router;