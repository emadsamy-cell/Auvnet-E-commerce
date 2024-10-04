const jwt = require("jsonwebtoken");
const tokenManager = require("../helpers/tokenManager");
const { asyncHandler } = require("../utils/asyncHandler");
const { createResponse } = require("../utils/createResponse");
const passwordManager = require("../helpers/passwordManager");

const userRepo = require('../models/user/user.repo');

exports.sendRefreshToken = async (req, res) => {
    try {
        // Read refresh token from cookies
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) return res.status(403).json(createResponse(false, "No refresh token found", 403));

        // Verify the refresh token
        const checkToken = tokenManager.compareToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        if (!checkToken) return res.status(403).json(createResponse(false, "Invalid refresh token", 403));

        const decoded = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

        // Generate and send access token
        const accessToken = tokenManager.generateAccessToken(decoded);
        return res.status(200).json(createResponse(true, "Refresh token is matched!", 200, null, { token: accessToken }));
    } catch (error) {
        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/v1/auth/refresh',
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
        path: '/v1/auth/refresh',
        maxAge: 0,
    });
    return res.status(200).json(createResponse(true, "User logged out successfully", 200));
});

exports.socialLoginCallback = asyncHandler(async (req, res) => {
    let { provider, displayName, email, email_verified, picture } = req.user;
    const userName = email.split('@')[0];
    if (!displayName) displayName = userName;
    if (!provider) provider = 'apple';

    // check if the email is verified
    if (!email_verified) {
        // return res.status(400).json(createResponse(false, 'Social Login authentication failed: Invalid email', 400));
        return res.redirect(`${process.env.frontendBaseURL}?success=false&message=Email not verified`);
    }

    // check if the email already exist
    const userExist = await userRepo.findUser(
        { email },
        "userName role master"
    );
    if (userExist.success) {
        // Generate tokens for the user
        const accessToken = tokenManager.generateAccessToken(userExist.data);
        const refreshToken = tokenManager.generateRefreshToken(userExist.data);

        // Send refresh token in secure cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/v1/auth/refresh',
            maxAge: +process.env.COOKIE_MAX_AGE_MS
        });

        return res.redirect(`${process.env.frontendBaseURL}?success=true&token=${accessToken}`);
    }

    const hashedPassword = await passwordManager.hashPassword(process.env.DEFAULT_PASSWORD);

    // create new user with the google account
    const newUser = await userRepo.create({
        name: displayName,
        userName,
        email,
        password: hashedPassword,
        image: picture,
        accountType: provider,
        isVerified: email_verified
    });
    if (!newUser.success) {
        // return res.status(400).json(createResponse(newUser.success, "Social Login authentication failed: Failed to save user", newUser.statusCode, newUser.error));
        return res.redirect(`${process.env.frontendBaseURL}?success=false&message=Failed to save user data`);
    }

    // Generate tokens for the user
    const accessToken = tokenManager.generateAccessToken(newUser.data);
    const refreshToken = tokenManager.generateRefreshToken(newUser.data);

    // Send refresh token in secure cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/v1/auth/refresh',
        maxAge: +process.env.COOKIE_MAX_AGE_MS
    });

    return res.redirect(`${process.env.frontendBaseURL}?success=true&token=${accessToken}`);
});

exports.socialLoginFail = asyncHandler(async (req, res) => {
    // return res.status(400).json(createResponse(false, 'Social Login authentication failed', 400))
    return res.redirect(`${process.env.frontendBaseURL}?success=false&message=Social Login authentication failed`);
})