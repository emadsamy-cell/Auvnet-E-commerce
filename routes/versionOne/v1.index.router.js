const router = require("express").Router();
const adminRouter = require("./admin.router");
const userRouter = require('./user.router');
const vendorRouter = require('./vendor.router');

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/vendor", vendorRouter);

module.exports = router;
