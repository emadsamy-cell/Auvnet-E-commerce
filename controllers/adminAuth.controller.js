const { asyncHandler } = require("../utils/asyncHandler");
const {
  getAdmin,
  saveOTPToDB,
  checkValidOTPAndUpdate,
} = require("../models/admins/admins.repo");
const {
  comparePassword,
  generateOTP,
} = require("../helpers/authHelpers");
const { generateToken } = require("../helpers/tokenManager");
const sendSMS = require("../utils/sendSMS");
const { createResponse } = require("../utils/createResponse");

const adminLoginController = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  const adminExist = await getAdmin(
    { userName },
    "userName password phoneNumber",
    false
  );

  // Check if userName and password are correct.
  if (!adminExist || !(await comparePassword(password, adminExist.password))) {
    throw new Error("Invalid credentials", { cause: 401 });
  }

  // Generate OTP & Send SMS
  const OTP = generateOTP();
  await saveOTPToDB(adminExist._id, OTP);
  await sendSMS(
    adminExist.phoneNumber,
    `Your OTP is: ${OTP.value}. Please enter this code to proceed with login. The code will expire in 5 minutes. Do not share this OTP with anyone.`
  );

  const message = `An OTP has been sent to your registered phone number ending in "${adminExist.phoneNumber.slice(-4)}". Please check your phone and enter the code to proceed with the login.`;
  return res.status(200).json(createResponse(true, message, 200));
});

const verifyOTPController = asyncHandler(async (req, res) => {
  const { userName, OTP } = req.body;
  const admin = await checkValidOTPAndUpdate(userName, OTP);

  // Generate token
  const token = generateToken(admin);

  return res
    .status(200)
    .json(createResponse(true, "Login successfully", 200, null, { token }));
});

const requestOTPController = asyncHandler(async (req, res) => {
  const { userName } = req.body;
  const admin = await getAdmin({ userName }, "userName phoneNumber");

  // Generate OTP & Send SMS
  const OTP = generateOTP();
  await saveOTPToDB(admin._id, OTP);
  await sendSMS(
    admin.phoneNumber,
    `Your OTP is: ${OTP.value}. Please enter this code to proceed with login. The code will expire in 5 minutes. Do not share this OTP with anyone.`
  );

  const message = `An OTP has been sent to your registered phone number ending in "${admin.phoneNumber.slice(-4)}". Please check your phone and enter the code to proceed with the login.`;
  return res.status(200).json(createResponse(true, message, 200));
});

module.exports = {
  adminLoginController,
  verifyOTPController,
  requestOTPController,
};
