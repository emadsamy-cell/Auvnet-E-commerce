const router = require("express").Router();
const { validation } = require('../../middlewares/validation')
const { adminLoginController, verifyOTPController, requestOTPController } = require("../../controllers/adminAuth.controller");
const { adminLoginValidation, verifyOTPValidation, requestOTPValidation } = require("../../validation/adminAuth.validation");

router.get("/", (req, res) => {
  res.send("Hello from version one");
});

router.post("/admin/signIn", validation(adminLoginValidation), adminLoginController)
router.post("/admin/verify-otp", validation(verifyOTPValidation), verifyOTPController)
router.get("/admin/request-otp", validation(requestOTPValidation), requestOTPController)

module.exports = router;
