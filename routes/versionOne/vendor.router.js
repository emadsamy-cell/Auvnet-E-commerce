const router = require("express").Router();

const schema = require('../../validation/vendor.validation');
const { validation } = require('../../middlewares/validation');
const isAuth = require('../../middlewares/auth');
const { uploadMultipleFields } = require('../../middlewares/upload');
const vendorController = require('../../controllers/vendor.controller');

const {
    GET_VENDOR,
    UPDATE_VENDOR
} = require('../../endpoints/vendor.endpoints')

const cpUpload = [
    { type: 'image', name: 'profileImage', maxCount: 1 },
    { type: 'image', name: 'coverImage', maxCount: 1 }
];

// Authentication
router.route('/auth/signIn').post(validation(schema.vendorSignIn), vendorController.signIn);
router.route('/auth/verify-otp').post(validation(schema.verifyOTP), vendorController.verifyOTP);
router.route('/auth/forget-password').post(validation(schema.forgetPassword), vendorController.forgetPassword);
router.route('/auth/reset-password').patch(validation(schema.resetPassword), vendorController.resetPassword);

// Profile Management
router.route('/profile/').get(isAuth(GET_VENDOR), vendorController.getProfile);
router.route('/profile/update').patch(uploadMultipleFields(cpUpload), validation(schema.updateVendorProfile), isAuth(UPDATE_VENDOR), vendorController.updateProfile);
router.route('/profile/change-password').patch(validation(schema.changeUerPassword), isAuth(UPDATE_VENDOR), vendorController.changePassword);

module.exports = router;
