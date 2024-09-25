const roles = require("../../enums/roles");

// roles policies
const adminPolicy = require("./adminPolicy");
const superAdminPolicy = require("./superAdminPolicy");
const userPolicy = require("./userPolicy");

const opts = {

    [roles.ADMIN]: {
        can: adminPolicy
    },
    [roles.SUPER_ADMIN]: {
        can: superAdminPolicy
    },
    // [roles.USER]: {
    //     can: userPolicy
    // }
};

module.exports = opts;