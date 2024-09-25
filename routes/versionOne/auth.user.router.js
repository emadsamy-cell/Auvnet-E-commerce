const router = require("express").Router();

const schema = require('../../validation/auth.validation');
const { validation } = require('../../middlewares/validation');
const authUserController = require('../../controllers/auth.user.controller');


router.route('/signUp')
    .post(validation(schema.userSignUp), authUserController.signUp);

router.route('/signIn')
    .post(validation(schema.userSignIn), authUserController.signIn);

router.route('/verify-otp')
    .post(validation(schema.verifyOTP), authUserController.verifyOTP);

router.route('/resend-otp')
    .post(validation(schema.resendOTP), authUserController.resendOTP);

router.route('/forget-password')
    .post(validation(schema.resendOTP), authUserController.forgetPassword);
    
router.route('/reset-password')
    .put(validation(schema.resetPassword), authUserController.resetPassword);

module.exports = router;
