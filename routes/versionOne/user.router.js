const router = require("express").Router();

const schema = require('../../validation/user.validation');
const { validation } = require('../../middlewares/validation');
const isAuth = require('../../middlewares/auth')
const userController = require('../../controllers/user.controller');

const {
    GET_USER
} = require('../../endpoints/user.endpoints');

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
    .put(validation(schema.resetPassword), userController.resetPassword);

router.route('/profile/')
    .get(isAuth(GET_USER), userController.getProfile);


module.exports = router;
