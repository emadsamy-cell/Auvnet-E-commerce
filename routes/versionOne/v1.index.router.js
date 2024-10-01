const router = require("express").Router();
const authController = require("../../controllers/auth.controller");
const adminRouter = require("./admin.router");
const userRouter = require('./user.router');
const vendorRouter = require('./vendor.router');
const categoryRouter = require('./category.router');

router.post('/auth/logout', authController.logoutUser);
router.post('/auth/refresh', authController.sendRefreshToken);

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/vendor", vendorRouter);
router.use("/category", categoryRouter);

module.exports = router;
