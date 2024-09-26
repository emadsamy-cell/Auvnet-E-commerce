const router = require("express").Router();
const adminRouter = require("./admin.router");

router.use("/admin", adminRouter);

module.exports = router;
