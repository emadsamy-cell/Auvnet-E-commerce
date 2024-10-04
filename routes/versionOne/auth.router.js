const passport = require('passport')
const router = require("express").Router();
const passportSetup = require('../../utils/passportSetup')
const authController = require('../../controllers/auth.controller');

router.post('/logout', authController.logoutUser);

router.post('/refresh', authController.sendRefreshToken);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/v1/auth/google/fail' }), authController.socialLoginCallback);

router.get('/google/fail', authController.socialLoginFail);

router.get('/apple', passport.authenticate('apple'));

router.get('/apple/callback', passport.authenticate('apple', { failureRedirect: '/v1/auth/apple/fail' }), authController.socialLoginCallback);

router.get('/apple/fail', authController.socialLoginFail);

module.exports = router;