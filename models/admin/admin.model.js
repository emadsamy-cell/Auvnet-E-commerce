const mongoose = require("mongoose");
const roles = require("../../enums/roles");

const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: roles.ADMIN,
  },
  OTP: {
    type: String,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  OTPExpiresAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Admin", adminSchema);
