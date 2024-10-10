const router = require("express").Router();
const adminRouter = require("./admin.router");
const userRouter = require('./user.router');
const vendorRouter = require('./vendor.router');
const authRouter = require("./auth.router");
const couponRouter = require("./coupon.router");
const categoryRouter = require("./category.router");
const voucherRouter = require("./voucher.router");

router.use("/auth", authRouter)
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/vendor", vendorRouter);
router.use("/category", categoryRouter);
router.use("/coupon", couponRouter);
router.use("/voucher", voucherRouter);

module.exports = router;
