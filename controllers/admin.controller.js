const sendSMS = require("../utils/sendSMS");
const { sendEmail } = require("../utils/sendEmail");
const adminRepo = require("../models/admin/admin.repo");
const { generateOTP } = require("../helpers/otpManager");
const { asyncHandler } = require("../utils/asyncHandler");
const adminMessages = require("../messages/admin.messages");
const { generateToken } = require("../helpers/tokenManager");
const { createResponse } = require("../utils/createResponse");
const { comparePassword, hashPassword } = require("../helpers/passwordManager");

// Admin login
const adminLoginController = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  // Check if admin exists with the given userName
  const adminExist = await adminRepo.isExist({
    filter: { userName },
    select: "userName password phoneNumber",
  });
  if (!adminExist.success) {
    return res.status(401).json(createResponse(adminExist.success, "Invalid userName", 401));
  }

  // Check if userName and password are correct.
  if (!(await comparePassword(password, adminExist.data.password))) {
    return res.status(401).json(createResponse(false, "Invalid password", 401));
  }

  // Generate OTP
  const OTP = generateOTP();

  // Save OTP to database with its expiry time
  const updateResult = await adminRepo.updateOne({
    filter: { _id: adminExist.data._id },
    data: { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt },
  });
  if (!updateResult.success) {
    return res.status(updateResult.statusCode).json(createResponse(updateResult.success, updateResult.message, updateResult.statusCode));
  }

  // Send OTP to admin's phone number
  const smsSent = await sendSMS(adminExist.data.phoneNumber, adminMessages.OTPSentForVerificationFormat(OTP.value));
  if (!smsSent.success) {
    return res.status(smsSent.statusCode).json(createResponse(smsSent.success, smsSent.message, smsSent.statusCode, smsSent.error));
  }

  const message = adminMessages.successLoginResponseFormat(adminExist.data.phoneNumber);
  return res.status(200).json(createResponse(true, message, 200));
});

// Verify OTP
const verifyOTPController = asyncHandler(async (req, res) => {
  const { userName, OTP } = req.body;

  // Check if OTP is valid and update the OTP field if it is.
  const result = await adminRepo.findOneAndUpdate({
    filter: { userName, OTP, OTPExpiresAt: { $gt: new Date() } },
    data: { OTP: null },
    select: "userName role"
  })
  if (!result.success) {
    return res.status(403).json(createResponse(result.success, "Invalid OTP or OTP is expired", 403));
  }

  // Generate token
  const token = generateToken(result.data);

  return res.status(200).json(createResponse(true, "Login successfully", 200, null, { token }));
});

// Request OTP
const requestOTPController = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  // Check if admin exists with the given userName
  const adminExist = await adminRepo.isExist({
    filter: { userName },
    select: "userName phoneNumber",
  });
  if (!adminExist.success) {
    return res.status(adminExist.statusCode).json(createResponse(adminExist.success, "Invalid userName", adminExist.statusCode));
  }

  // Generate OTP
  const OTP = generateOTP();

  // Save OTP to database with its expiry time
  const updateResult = await adminRepo.updateOne({
    filter: { _id: adminExist.data._id },
    data: { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt },
  });
  if (!updateResult.success) {
    return res.status(updateResult.statusCode).json(createResponse(updateResult.success, updateResult.message, updateResult.statusCode));
  }

  // Send OTP to admin's phone number
  const smsSent = await sendSMS(
    adminExist.data.phoneNumber,
    adminMessages.OTPSentForVerificationFormat(OTP.value)
  );
  if (!smsSent.success) {
    return res.status(smsSent.statusCode).json(createResponse(smsSent.success, smsSent.message, smsSent.statusCode, smsSent.error));
  }

  const message = adminMessages.successLoginResponseFormat(adminExist.data.phoneNumber);
  return res.status(200).json(createResponse(true, message, 200));
});

// Get admin profile
const getProfileController = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Check if admin exists with the given id
  const adminProfile = await adminRepo.isExist({
    filter: { _id: adminId },
    select: "userName email phoneNumber role",
  });

  return res.status(200).json(createResponse(true, "Admin profile fetched successfully", 200, null, adminProfile.data));
});

// Update admin profile
const updateProfileController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Update admin profile
  const updatedAdmin = await adminRepo.findOneAndUpdate({
    filter: { _id: userId },
    data: req.body,
    select: "userName email phoneNumber",
    options: { new: true, runValidators: true },
  });
  if (!updatedAdmin.success) {
    return res.status(updatedAdmin.statusCode).json(createResponse(updatedAdmin.success, "Failed to update profile", updatedAdmin.statusCode));
  }

  return res.status(updatedAdmin.statusCode).json(createResponse(updatedAdmin.success, "Profile updated successfully", updatedAdmin.statusCode, null, updatedAdmin.data));
});

// Create admin account
const createAdminAccountController = asyncHandler(async (req, res) => {
  const { userName, email, password, phoneNumber } = req.body;
  // Hash password
  const hashedPassword = await hashPassword(password);

  // Save admin details to database
  const result = await adminRepo.createAdmin({
    data: { userName, email, password: hashedPassword, phoneNumber },
  });
  if (!result.success) {
    return res.status(result.status).json(createResponse(result.success, result.message, result.statusCode));
  }

  // Send email to admin with credentials
  const emailSent = await sendEmailToAdminController({ userName, email, password, phoneNumber, });
  if (!emailSent.success) {
    return res.status(emailSent.status).json(createResponse(emailSent.success, emailSent.message, emailSent.statusCode, emailSent.error));
  }

  return res.status(201).json(createResponse(true, "Admin account created successfully", 200, null, result.data));
});

// Send email to admin with credentials
const sendEmailToAdminController = async (admin) => {
  const email = adminMessages.emailSentToAdminForAccountCredentials(admin.userName, admin.password, admin.phoneNumber);
  return await sendEmail(admin.email, email.title, email.body);
};

module.exports = {
  adminLoginController,
  verifyOTPController,
  requestOTPController,
  getProfileController,
  updateProfileController,
  createAdminAccountController,
};
