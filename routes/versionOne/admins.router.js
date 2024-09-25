const router = require("express").Router();
const sendSMS = require("../../utils/sendSMS");

router.post("/send", async (req, res) => {
  const result = await sendSMS("+201019561595", "hello from express!");
  res.json({ message: "SMS sent successfully" });
});


module.exports = router;
