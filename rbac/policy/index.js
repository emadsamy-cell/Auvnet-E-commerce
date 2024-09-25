const roles = require("../../enums/roles");

// roles policies
const userPolicy = require("./userPolicy");

const opts = {

    [roles.USER]: {
        can: userPolicy
    }
};

module.exports = opts;