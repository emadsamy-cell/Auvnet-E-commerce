const { compareToken, generateAccessToken } = require("../helpers/tokenManager");
const { createResponse } = require("../utils/createResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

exports.sendRefreshToken = async (req, res) => {
    try {
        // Read refresh token from cookies
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) return res.status(403).json(createResponse(false, "No refresh token found", 403));

        // Verify the refresh token
        const checkToken = compareToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        if (!checkToken) return res.status(403).json(createResponse(false, "Invalid refresh token", 403));

        const decoded = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

        // Generate and send access token
        const accessToken = generateAccessToken(decoded);
        return res.status(200).json(createResponse(true, "Refresh token is matched!", 200, null, { token: accessToken }));
    } catch (error) {
        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/v1/admin/auth/refresh',
            maxAge: 0,
        });
        return res.status(500).json(createResponse(false, error.message, 500));
    }
};

exports.logoutUser = asyncHandler(async (req, res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/v1/admin/auth/refresh',
        maxAge: 0,
    });
    return res.status(200).json(createResponse(true, "User logged out successfully", 200));
});