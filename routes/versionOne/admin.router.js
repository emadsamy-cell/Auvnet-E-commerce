const router = require("express").Router();
const auth = require("../../middlewares/auth")
const { validation } = require("../../middlewares/validation")
const endpoints = require("../../endpoints/admin.endpoint")
const adminValidator = require("../../validation/admin.validation");
const adminController = require("../../controllers/admin.controller");

// Auth routes
router.post("/auth/signIn", validation(adminValidator.adminLoginValidation), adminController.adminLoginController)
router.post("/auth/verify-otp", validation(adminValidator.verifyOTPValidation), adminController.verifyOTPController)
router.get("/auth/request-otp", validation(adminValidator.requestOTPValidation), adminController.requestOTPController)

// Profile routes
router.get('/profile', auth(endpoints.GET_PROFILE), adminController.getProfileController);
router.patch('/profile', validation(adminValidator.updateAdminProfileValidation), auth(endpoints.UPDATE_PROFILE), adminController.updateProfileController);
router.patch('/profile/password', validation(adminValidator.updateAdminPasswordValidation), auth(endpoints.UPDATE_PROFILE), adminController.changePasswordController);

// Admin management routes
router.post('/', validation(adminValidator.createAdminAccountValidation), auth(endpoints.CREATE_ACCOUNT), adminController.createAdminAccountController);
router.get('/', auth(endpoints.GET_ADMINS), adminController.getAllAdminsController);
router.patch('/:adminId/role', validation(adminValidator.updateAdminRoleValidation), auth(endpoints.UPDATE_ROLE), adminController.updateAdminRoleController);
router.delete('/:adminId', validation(adminValidator.deleteAdminValidation), auth(endpoints.DELETE_ADMIN), adminController.deleteAdminController);
router.patch('/:adminId/restore', validation(adminValidator.deleteAdminValidation), auth(endpoints.DELETE_ADMIN), adminController.deleteAdminController);

module.exports = router;
