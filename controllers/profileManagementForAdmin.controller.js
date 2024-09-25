const { asyncHandler } = require("../utils/asyncHandler")
const { updateAdminProfile, getAdminProfile } = require("../models/admins/admins.repo")
const { createResponse } = require("../utils/createResponse")

const getProfileController = asyncHandler(async (req, res) => {
    const userId = req.user._id;
   
    const adminProfile = await getAdminProfile(userId);
    return res.status(200).json(createResponse(true, "Admin profile fetched successfully", 200, null, adminProfile));
});

const updateProfileController = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const updatedAdmin = await updateAdminProfile(userId, req.body);
    return res.status(200).json(createResponse(true, "Profile updated successfully", 200, null, updatedAdmin));
});

module.exports = {
    getProfileController,
    updateProfileController
};