const router = require("express").Router();
const authRouter = require("./versionOne/auth.router");

router.use("/auth", authRouter);

module.exports = router;
