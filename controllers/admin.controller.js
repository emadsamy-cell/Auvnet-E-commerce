const sendSMS = require("../utils/sendSMS");
const adminRepo = require("../models/admin/admin.repo");
const { generateOTP } = require("../helpers/otpManager");
const { asyncHandler } = require("../utils/asyncHandler");
const adminMessages = require("../messages/admin.messages");
const { generateAccessToken, generateRefreshToken } = require("../helpers/tokenManager");
const { createResponse } = require("../utils/createResponse");
const mailManager = require("../utils/emailService")
const { comparePassword, hashPassword } = require("../helpers/passwordManager");
const { paginate } = require("../utils/pagination");
const roles = require("../enums/roles");

// Admin login
exports.adminLoginController = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  // Check if admin exists with the given userName
  const adminExist = await adminRepo.isExist({ userName }, "userName password phoneNumber isDeleted");
  if (!adminExist.success) {
    return res.status(401).json(createResponse(adminExist.success, "Invalid userName", 401));
  }

  // Check if userName and password are correct.
  const passwordMatch = await comparePassword(password, adminExist.data.password);
  if (!passwordMatch) {
    return res.status(401).json(createResponse(false, "Invalid password", 401));
  }

  // Check if admin is deleted
  if (adminExist.data.isDeleted) {
    return res.status(403).json(createResponse(false, "Account is deleted", 403));
  }

  // Generate OTP
  const OTP = generateOTP();

  // Save OTP to database with its expiry time
  const updateResult = await adminRepo.update(
    { _id: adminExist.data._id },
    { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt });
  if (!updateResult.success) {
    return res.status(updateResult.statusCode).json(createResponse(updateResult.success, updateResult.message, updateResult.statusCode));
  }

  // Send OTP to admin's phone number
  const smsSent = await sendSMS(adminExist.data.phoneNumber, adminMessages.verificationOtp(OTP.value));
  if (!smsSent.success) {
    return res.status(smsSent.statusCode).json(createResponse(smsSent.success, smsSent.message, smsSent.statusCode, smsSent.error));
  }

  const message = adminMessages.successfulLogin(adminExist.data.phoneNumber);
  return res.status(200).json(createResponse(true, message, 200));
});

// Verify OTP
exports.verifyOTPController = asyncHandler(async (req, res) => {
  const { userName, OTP } = req.body;

  // Check if OTP is valid and update the OTP field if it is.
  const result = await adminRepo.updateAndReturn(
    { userName, OTP, OTPExpiresAt: { $gt: new Date() } },
    { OTP: null },
    "userName role master phoneNumber"
  )
  if (!result.success) {
    return res.status(403).json(createResponse(result.success, "Invalid OTP or OTP is expired", 403));
  }

  // Generate access & refresh token
  const accessToken = generateAccessToken(result.data);
  const refreshToken = generateRefreshToken(result.data);

  // Send refresh token in secure cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/v1/auth/refresh',
    maxAge: +process.env.COOKIE_MAX_AGE_MS
  });

  delete result.data.master;

  return res.status(200).json(createResponse(true, "Login successfully", 200, null, { token: accessToken, admin: result.data }));
});

// Request OTP
exports.requestOTPController = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  // Check if admin exists with the given userName
  const adminExist = await adminRepo.isExist(
    { userName },
    "userName phoneNumber",
  );
  if (!adminExist.success) {
    return res.status(adminExist.statusCode).json(createResponse(adminExist.success, "Invalid userName", adminExist.statusCode));
  }

  // Generate OTP
  const OTP = generateOTP();

  // Save OTP to database with its expiry time
  const updateResult = await adminRepo.update(
    { _id: adminExist.data._id },
    { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
  );
  if (!updateResult.success) {
    return res.status(updateResult.statusCode).json(createResponse(updateResult.success, updateResult.message, updateResult.statusCode));
  }

  // Send OTP to admin's phone number
  const smsSent = await sendSMS(
    adminExist.data.phoneNumber,
    adminMessages.verificationOtp(OTP.value)
  );
  if (!smsSent.success) {
    return res.status(smsSent.statusCode).json(createResponse(smsSent.success, smsSent.message, smsSent.statusCode, smsSent.error));
  }

  const message = adminMessages.successfulLogin(adminExist.data.phoneNumber);
  return res.status(200).json(createResponse(true, message, 200));
});

// Get admin profile
exports.getProfileController = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Check if admin exists with the given id
  const adminProfile = await adminRepo.isExist(
    { _id: adminId },
    "userName email phoneNumber role"
  );

  return res.status(200).json(createResponse(true, "Admin profile fetched successfully", 200, null, adminProfile.data));
});

// Update admin profile
exports.updateProfileController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Update admin profile
  const updatedAdmin = await adminRepo.updateAndReturn(
    { _id: userId },
    req.body,
    "userName email phoneNumber",
    { new: true, runValidators: true },
  );
  if (!updatedAdmin.success) {
    return res.status(updatedAdmin.statusCode).json(createResponse(updatedAdmin.success, "Failed to update profile", updatedAdmin.statusCode));
  }

  return res.status(updatedAdmin.statusCode).json(createResponse(updatedAdmin.success, "Profile updated successfully", updatedAdmin.statusCode, null, updatedAdmin.data));
});

// Update admin password
exports.changePasswordController = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // get the user with given id
  const admin = await adminRepo.isExist(
    { _id: req.user._id },
    "password"
  );
  if (!admin.success) {
    return res.status(admin.statusCode).json(
      createResponse(admin.success, admin.message, admin.statusCode)
    );
  }

  // compare the old password with the current password
  const matched = await comparePassword(currentPassword, admin.data.password);
  if (!matched) {
    return res.status(401).json(
      createResponse(false, "Incorrect password", 401)
    );
  }

  // update the password with the new password
  const password = await hashPassword(newPassword);
  const result = await adminRepo.update(
    { _id: req.user._id },
    { password }
  );

  return res.status(result.statusCode).json(
    createResponse(result.success, "Password has been changed successfully", result.statusCode)
  );
});

// Create admin account
exports.createAdminAccountController = asyncHandler(async (req, res) => {
  const { userName, email, password, phoneNumber } = req.body;
  // Hash password
  const hashedPassword = await hashPassword(password);

  // Save admin details to database
  const result = await adminRepo.create({ userName, email, password: hashedPassword, phoneNumber, createdBy: req.user._id });
  if (!result.success) {
    return res.status(result.status).json(createResponse(result.success, result.message, result.statusCode));
  }

  // Send email to admin with credentials
  const emailSent = await sendEmailToAdminController({ userName, email, password, phoneNumber });
  if (!emailSent.success) {
    return res.status(emailSent.status).json(createResponse(emailSent.success, emailSent.message, emailSent.statusCode, emailSent.error));
  }

  return res.status(201).json(createResponse(true, "Admin account created successfully", 201, null, result.data));
});

// Send email to admin with credentials
const sendEmailToAdminController = async (admin) => {
  const emailOptions = {
    email: admin.email,
    subject: "Admin Account Credentials",
    userName: admin.userName,
    password: admin.password,
    phoneNumber: admin.phoneNumber,
    role: "Admin"
  };

  const emailSent = await mailManager.emailSetup("accountCredentials", emailOptions);
  return emailSent;
};

// Get all admins for super admin
exports.getAllAdminsController = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const options = paginate(page, size);

  const admins = await adminRepo.getList(
    { role: roles.ADMIN },
    "userName email phoneNumber role isDeleted",
    { sort: { createdAt: -1 }, ...options },
    [{ path: "createdBy", select: "userName email" }]
  );
  return res.status(200).json(createResponse(true, "Admins fetched successfully", 200, null, admins));
});

// Update admin role
exports.updateAdminRoleController = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { newRole } = req.body;

  // Master only who can update another superAdmin
  if (newRole === roles.ADMIN && !req.user.master) {
    return res.status(403).json(createResponse(false, "You are not master to perform this !", 403));
  }

  // Update admin role
  const updatedAdmin = await adminRepo.update(
    { _id: adminId },
    { role: newRole }
  );

  if (!updatedAdmin.success) {
    return res.status(404).json(createResponse(updatedAdmin.success, updatedAdmin.message, updatedAdmin.statusCode));
  }
  return res.status(200).json(createResponse(updatedAdmin.success, updatedAdmin.message, updatedAdmin.statusCode));
})

// Delete/unDelete admin
exports.deleteAdminController = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const isDeleted = req.method === "DELETE" ? true : false;

  // unMaster superAdmin can delete only admins
  const filter = req.user.master ? { _id: adminId } : { _id: adminId, role: roles.ADMIN };

  const deletedAdmin = await adminRepo.update(
    filter,
    { isDeleted }
  );
  if (!deletedAdmin.success) {
    return res.status(deletedAdmin.statusCode).json(createResponse(deletedAdmin.success, deletedAdmin.message, deletedAdmin.statusCode));
  }

  return req.method === "DELETE" ?
    res.status(204).json(createResponse(deletedAdmin.success, deletedAdmin.message, 204))
    :
    res.status(200).json(createResponse(deletedAdmin.success, "Admin is restored successfully", 200))
})

