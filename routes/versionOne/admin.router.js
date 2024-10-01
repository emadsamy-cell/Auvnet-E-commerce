const router = require("express").Router();
const auth = require("../../middlewares/auth")
const { validation } = require("../../middlewares/validation")
const { GET_PROFILE, UPDATE_PROFILE, CREATE_ACCOUNT, GET_ADMINS, UPDATE_ROLE, DELETE_ADMIN } = require("../../endpoints/admin.endpoint")
const { updateAdminProfileValidation, createAdminAccountValidation, adminLoginValidation, verifyOTPValidation, requestOTPValidation, updateAdminRoleValidation, deleteAdminValidation, updateAdminPasswordValidation } = require("../../validation/admin.validation");
const { getProfileController, updateProfileController, createAdminAccountController, adminLoginController, verifyOTPController, requestOTPController, getAllAdminsController, updateAdminRoleController, deleteAdminController, changePasswordController } = require("../../controllers/admin.controller");

// Auth routes
router.post("/auth/signIn", validation(adminLoginValidation), adminLoginController)
router.post("/auth/verify-otp", validation(verifyOTPValidation), verifyOTPController)
router.get("/auth/request-otp", validation(requestOTPValidation), requestOTPController)

// Profile routes
router.get('/profile', auth(GET_PROFILE), getProfileController);
router.patch('/profile', validation(updateAdminProfileValidation), auth(UPDATE_PROFILE), updateProfileController);
router.patch('/profile/password', validation(updateAdminPasswordValidation), auth(UPDATE_PROFILE), changePasswordController);

// Admin management routes
router.post('/', validation(createAdminAccountValidation), auth(CREATE_ACCOUNT), createAdminAccountController);
router.get('/', auth(GET_ADMINS), getAllAdminsController);
router.patch('/:adminId/role', validation(updateAdminRoleValidation), auth(UPDATE_ROLE), updateAdminRoleController);
router.delete('/:adminId', validation(deleteAdminValidation), auth(DELETE_ADMIN), deleteAdminController);
router.patch('/:adminId/restore', validation(deleteAdminValidation), auth(DELETE_ADMIN), deleteAdminController);

module.exports = router;
