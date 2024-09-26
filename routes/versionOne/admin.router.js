const router = require("express").Router();
const auth = require("../../middlewares/auth")
const { validation } = require("../../middlewares/validation")
const { GET_PROFILE, UPDATE_PROFILE, CREATE_ACCOUNT } = require("../../endpoints/admin.endpoint")
const { updateAdminProfileValidation, createAdminAccountValidation, adminLoginValidation, verifyOTPValidation, requestOTPValidation } = require("../../validation/admin.validation");
const { getProfileController, updateProfileController, createAdminAccountController, adminLoginController, verifyOTPController, requestOTPController } = require("../../controllers/admin.controller")

router.post("/auth/signIn", validation(adminLoginValidation), adminLoginController)
router.post("/auth/verify-otp", validation(verifyOTPValidation), verifyOTPController)
router.get("/auth/request-otp", validation(requestOTPValidation), requestOTPController)
router.get('/profile', auth(GET_PROFILE), getProfileController);
router.patch('/profile', validation(updateAdminProfileValidation), auth(UPDATE_PROFILE), updateProfileController);
router.post('/', validation(createAdminAccountValidation), auth(CREATE_ACCOUNT), createAdminAccountController);

module.exports = router;
