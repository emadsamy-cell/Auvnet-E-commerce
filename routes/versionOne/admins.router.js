const router = require("express").Router();
const auth = require("../../middlewares/auth")
const { GET_PROFILE, UPDATE_PROFILE } = require("../../endpoints/admin.endpoint")
const { validation } = require("../../middlewares/validation")
const { updateProfileController, getProfileController } = require("../../controllers/profileManagementForAdmin.controller");
const { updateAdminProfileValidation } = require("../../validation/profileManagementForAdmin.validation");

router.get('/profile', auth(GET_PROFILE), getProfileController);
router.post('/profile', validation(updateAdminProfileValidation), auth(UPDATE_PROFILE), updateProfileController);

module.exports = router;
