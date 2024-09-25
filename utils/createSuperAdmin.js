const { createAdmin } = require("../models/admins/admins.repo");
const { hashPassword } = require("../helpers/passwordHashing");
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
    };
    await createAdmin(superAdmin);
    console.log("Super admin account created successfully");
  } catch (error) {
    console.log("Failed to create super admin account", error);
  }
};

module.exports = createSuperAdmin;
