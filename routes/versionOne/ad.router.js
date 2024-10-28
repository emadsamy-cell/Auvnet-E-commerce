const router = require("express").Router();
const auth = require("../../middlewares/auth");
const endpoints = require("../../endpoints/ad.endpoints");
const { validation } = require("../../middlewares/validation");
const adValidation = require("../../validation/ad.validation");
const adController = require("../../controllers/ad.controller");
const multer = require('../../middlewares/upload');

router.post('/', auth(endpoints.CREATE_AD), multer.uploadMultipleFields([{ name: 'video', maxCount: 1 }, { name: 'images', maxCount: 5 }]), validation(adValidation.create), adController.create)
router.get('/', validation(adValidation.get), auth(endpoints.GET_ADS), adController.getAll)
router.patch('/:id', auth(endpoints.UPDATE_AD), multer.uploadMultipleFields([{ name: 'video', maxCount: 1 }, { name: 'images', maxCount: 5 }]), validation(adValidation.update), adController.update)
router.delete('/:id', validation(adValidation.delete), auth(endpoints.DELETE_AD), adController.delete)

module.exports = router;