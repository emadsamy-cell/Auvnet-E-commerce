const router = require("express").Router();

const schema = require('../../validation/user.validation');
const { validation } = require('../../middlewares/validation');
const isAuth = require('../../middlewares/auth');
const { uploadSingleFile } = require('../../middlewares/upload');
const userController = require('../../controllers/user.controller');
const {
    GET_USER,
    UPDATE_USER
} = require('../../endpoints/user.endpoints');

// Authentication
router.route('/auth/signUp').post(validation(schema.userSignUp), userController.signUp);
router.route('/auth/signIn').post(validation(schema.userSignIn), userController.signIn);
router.route('/auth/verify-otp').post(validation(schema.verifyOTP), userController.verifyOTP);
router.route('/auth/resend-otp').post(validation(schema.resendOTP), userController.resendOTP);
router.route('/auth/forget-password').post(validation(schema.resendOTP), userController.forgetPassword);
router.route('/auth/reset-password').patch(validation(schema.resetPassword), userController.resetPassword);

// Profile Management
router.route('/profile/').get(isAuth(GET_USER), userController.getProfile);
router.route('/profile/update').patch(uploadSingleFile('image', 'image'), validation(schema.updateUserProfile), isAuth(UPDATE_USER), userController.updateProfile);
router.route('/profile/change-password').patch(validation(schema.changeUerPassword), isAuth(UPDATE_USER), userController.changePassword);

module.exports = router;
