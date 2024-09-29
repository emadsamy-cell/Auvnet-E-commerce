const adminRepo = require("../models/admin/admin.repo");
const { hashPassword } = require("./passwordManager");
const roles = require("../enums/roles");

// Create super admin account
createSuperAdmin = async () => {
  try {
    const superAdmin = {
      userName: process.env.SUPER_ADMIN_USERNAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: await hashPassword(process.env.SUPER_ADMIN_PASSWORD),
      role: roles.SUPER_ADMIN,
      phoneNumber: process.env.SUPER_ADMIN_PHONE,
      master: true
    };
    await adminRepo.create(superAdmin);
    console.log("Super admin account created successfully");
  } catch (error) {
    console.log("Failed to create super admin account", error);
  }
};

module.exports = createSuperAdmin;
