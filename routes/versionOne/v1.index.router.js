const router = require("express").Router();
const adminRouter = require("./admin.router");
const userRouter = require('./user.router');
const authController = require("../../controllers/auth.controller");

router.post('/auth/logout', authController.logoutUser);
router.post('/auth/refresh', authController.sendRefreshToken);

router.use("/admin", adminRouter);
router.use("/user", userRouter);

module.exports = router;
