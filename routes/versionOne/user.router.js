const router = require("express").Router();

const schema = require('../../validation/user.validation');
const { validation } = require('../../middlewares/validation');
const isAuth = require('../../middlewares/auth');
const { uploadSingleFile } = require('../../middlewares/upload');
const userController = require('../../controllers/user.controller');
const { GET_USER, UPDATE_USER, LIST_USERS, DELETE_USER } = require('../../endpoints/user.endpoints');
const { GET_LIKED_VENDORS, LIKE_VENDOR, DISLIKE_VENDOR } = require('../../endpoints/vendor.endpoints');
const { LIKE_COLLECTION, DISLIKE_COLLECTION } = require('../../endpoints/collection.endpoints');

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

// User Management
router.route('/list').get(isAuth(LIST_USERS), validation(schema.listQuery), userController.listUsers);
router.route('/delete/:id').patch(isAuth(DELETE_USER), validation(schema.parameterID), userController.deleteUser);
router.route('/restore/:id').patch(isAuth(DELETE_USER), validation(schema.parameterID), userController.restoreUser);

// Vendor Like Management
router.route('/liked/vendors').get(isAuth(GET_LIKED_VENDORS), userController.getLikedVendors);
router.route('/like/vendor/:id').patch(isAuth(LIKE_VENDOR), validation(schema.parameterID), userController.likeVendor);
router.route('/dislike/vendor/:id').patch(isAuth(DISLIKE_VENDOR), validation(schema.parameterID), userController.dislikeVendor);

// Collection Like Management
router.route('/like/collection/:id').patch(isAuth(LIKE_COLLECTION), validation(schema.parameterID), userController.likeCollection);
router.route('/dislike/collection/:id').patch(isAuth(DISLIKE_COLLECTION), validation(schema.parameterID), userController.dislikeCollection);


module.exports = router;
