const roles = require("../../enums/roles");

// roles policies
const adminPolicy = require("./adminPolicy");
const superAdminPolicy = require("./superAdminPolicy");
const userPolicy = require("./userPolicy");
const vendorPolicy = require("./vendorPolicy");

const opts = {

    [roles.ADMIN]: {
        can: adminPolicy
    },
    [roles.SUPER_ADMIN]: {
        can: superAdminPolicy
    },
    [roles.USER]: {
         can: userPolicy
    },
    [roles.VENDOR]: {
        can: vendorPolicy
    }
};

module.exports = opts;