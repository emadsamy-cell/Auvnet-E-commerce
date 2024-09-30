const router = require("express").Router();

const schema = require('../../validation/user.validation');
const { validation } = require('../../middlewares/validation');
const isAuth = require('../../middlewares/auth');
const uploadImage = require('../../middlewares/uploadImage');
const userController = require('../../controllers/user.controller');
const passportSetup = require('../../utils/passportSetup')
const passport = require('passport')

const {
    GET_USER,
    UPDATE_USER
} = require('../../endpoints/user.endpoints');

router.route('/auth/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/auth/google/callback')
    .get(passport.authenticate('google', { failureRedirect: '/auth/google/fail' }), userController.socialLoginCallback);

router.route('/auth/google/fail')
    .get(userController.socialLoginFail);

router.route('/auth/apple')
    .get(passport.authenticate('apple'));

router.route('/auth/apple/callback')
    .get(passport.authenticate('apple', { failureRedirect: '/auth/apple/fail' }), userController.socialLoginCallback);

router.route('/auth/apple/fail')
    .get(userController.socialLoginFail);

router.route('/auth/signUp')
    .post(validation(schema.userSignUp), userController.signUp);

router.route('/auth/signIn')
    .post(validation(schema.userSignIn), userController.signIn);

router.route('/auth/verify-otp')
    .post(validation(schema.verifyOTP), userController.verifyOTP);

router.route('/auth/resend-otp')
    .post(validation(schema.resendOTP), userController.resendOTP);

router.route('/auth/forget-password')
    .post(validation(schema.resendOTP), userController.forgetPassword);

router.route('/auth/reset-password')
    .patch(validation(schema.resetPassword), userController.resetPassword);

router.route('/profile/')
    .get(isAuth(GET_USER), userController.getProfile);

router.route('/profile/update')
    .patch(uploadImage.single('image'), validation(schema.updateUserProfile), isAuth(UPDATE_USER), userController.updateProfile);

router.route('/profile/change-password')
    .patch(validation(schema.changeUerPassword), isAuth(UPDATE_USER), userController.changePassword);

module.exports = router;
