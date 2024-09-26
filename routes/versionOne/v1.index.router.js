const router = require("express").Router();
const adminRouter = require("./admin.router");
const userRouter = require('./user.router');

router.use("/admin", adminRouter);
router.use("/user", userRouter);

module.exports = router;
