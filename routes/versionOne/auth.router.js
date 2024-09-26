const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hello from version one");
});

module.exports = router;
