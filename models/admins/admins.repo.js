const Admin = require("./admins.model");

// Create admin account
const createAdmin = async (admin) => {
  const newAdmin = await Admin.create(admin);
  if (!newAdmin) {
    throw new Error("Failed to create admin account", { cause: 400 });
  }
  return newAdmin;
};

const getAdmin = async (query, select = "", returnError = true) => {
  const admin = await Admin.findOne(query).select(select);
  if (!admin && returnError) {
    throw new Error("Admin not found", { cause: 404 });
  }

  return admin;
};

const saveOTPToDB = async (id, OTP) => {
  const savedOTP = await Admin.findByIdAndUpdate(id, { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }).select('OTP');
  if (!savedOTP) {
    throw new Error("Failed to save OTP", { cause: 500 });
  }
  return savedOTP;
};

const checkValidOTPAndUpdate = async (userName, OTP) => {
  const admin = await Admin.findOneAndUpdate({userName, OTP}, {OTP: null}).select('userName role OTP OTPExpiresAt');
  if (!admin) {
    throw new Error("Invalid OTP or OTP is expired", { cause: 403 });
  }
  return admin;
}

module.exports = {
  createAdmin,
  saveOTPToDB,
  getAdmin,
  checkValidOTPAndUpdate
};
