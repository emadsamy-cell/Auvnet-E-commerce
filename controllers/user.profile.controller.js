const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');
const userRepo = require('../models/user/user.repo');

exports.getProfile = asyncHandler(async (req, res) => {
    // get user with id
    const user = userRepo.getUser({ _id: req.user.id });
    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, user.message, user.statusCode, user.error)
        );
    }

    // send the result
    return res.status(200).json(
        createResponse(true, "User Found", 200, null, user.data)
    );
});
