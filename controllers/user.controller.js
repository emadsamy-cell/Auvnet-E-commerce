const passwordManager = require("../helpers/passwordManager");
const otpManager = require('../helpers/otpManager');
const userRepo = require('../models/user/user.repo');
const tokenManager = require('../helpers/tokenManager');
const mailManager = require('../utils/emailService');
const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');

exports.signUp = asyncHandler(async (req, res) => {
    let { name, userName, email, password } = req.body;

    // generate otp code
    const OTP = otpManager.generateOTP();

    // check if the email or userName already exist
    const isExist = await userRepo.findUser(
        { $or: [{ email }, { userName }] },
        "_id"
    );

    if (isExist.success) {
        return res.status(409).json(
            createResponse(false, "Email or userName already connect to an account", 409, isExist.error)
        )
    }

    // create user with the generated otp
    password = await passwordManager.hashPassword(password);
    const user = await userRepo.create(
        { name, userName, email, password, OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
    );

    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, user.message, user.statusCode, user.error)
        );
    }

    // generate message with otp then send it to email of the user
    const result = await mailManager.emailSetup("OTPVerification", {
        email: req.body.email,
        subject: 'OTP verification',
        OTP
    });

    // if there are any error in sending the message
    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "There are something wrong", result.statusCode, result.error)
        )
    }

    // response
    return res.status(201).json(
        createResponse(result.success, "OTP code has been sent to your email", 201)
    );
});

exports.signIn = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;

    // check if the userName or email exists
    const isExist = await userRepo.findUser(
        { $or: [{ email }, { userName }] },
        "-OTP -accountType -createdAt -couponClaimed -voucherClaimed -likedVendors -dislikedVendors -__v" 
    );

    if (!isExist.success) {
        return res.status(401).json(
            createResponse(isExist.success, "Incorrect userName or email", 401, isExist.error)
        );
    }

    // compare passwords
    const matched = await passwordManager.comparePassword(password, isExist.data.password);
    if (!matched) {
        return res.status(401).json(
            createResponse(false, "Incorrect password", 401)
        );
    }

    // Check if the account is deleted
    if (isExist.data.isDeleted) {
        return res.status(401).json(
            createResponse(false, "This account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    // check if the account is verified
    if (!isExist.data.isVerified) {
        return res.status(401).json(
            createResponse(false, "Please verify your account first to login", 401)
        );
    }

    // Generate access & refresh token
    const accessToken = tokenManager.generateAccessToken(isExist.data);
    const refreshToken = tokenManager.generateRefreshToken(isExist.data);

    // Send refresh token in secure cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/v1/auth/refresh',
        maxAge: +process.env.COOKIE_MAX_AGE_MS
    });

    // return result
    return res.status(200).json(
        createResponse(true, "Login successfully", 200, null, {
            token: accessToken,
            user: isExist.data
        })
    );
});

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, OTP } = req.body;

    // find the user and update the OTP to null
    const user = await userRepo.findUser(
        { email, isDeleted: false },
        "OTP OTPExpiresAt _id"
    )

    // email not found
    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, "This email has no accounts", user.statusCode, user.error)
        );
    }

    // Check if the account is deleted
    if (user.data.isDeleted) {
        return res.status(401).json(
            createResponse(false, "This account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    // if OTP is not equal to the user OTP
    if (user.data.OTP !== OTP) {
        return res.status(401).json(
            createResponse(false, "Incorrect OTP", 401)
        );
    }

    // check if the OTP is expired
    if (new Date() > user.data.OTPExpiresAt) {
        return res.status(401).json(
            createResponse(false, "OTP has been expired", 401)
        );
    }

    // update the user with the OTP to null
    const result = await userRepo.updateUser(
        { _id: user.data._id },
        { OTP: null, isVerified: true }
    );

    // return results
    return res.status(result.statusCode).json(
        createResponse(result.success, "OTP has been verified successfully!", result.statusCode)
    );
});

exports.resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // generate otp code
    const OTP = otpManager.generateOTP();

    // Add OTP code to this email
    let result = await userRepo.updateUser(
        { email, isDeleted: false },
        { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
    );

    // email not found
    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "This email has no accounts", result.statusCode, result.error)
        );
    }

    // send email to the user
    result = await mailManager.emailSetup("OTPVerification", {
        email: email,
        subject: 'OTP verification',
        OTP
    });

    // if there are any error in sending the message
    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "There are something wrong", result.statusCode, result.error)
        )
    }

    // send result
    return res.status(result.statusCode).json(
        createResponse(true, "OTP has been sent to your email", result.statusCode)
    );
});

exports.forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // generate otp code
    const OTP = otpManager.generateOTP();

    // Add OTP code to this email
    let result = await userRepo.updateUser(
        { email, isDeleted: false },
        { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
    );

    // email not found
    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "This email has no accounts", result.statusCode, result.error)
        );
    }

    // send OTP code to that email
    result = await mailManager.emailSetup("forgetPassword", {
        email: email,
        subject: 'Reset Password',
        OTP
    });

    // if there are any error in sending the message
    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "There are something wrong", result.statusCode, result.error)
        )
    }

    // send result
    return res.status(result.statusCode).json(
        createResponse(true, "OTP has been sent to your email", result.statusCode)
    );
});

exports.resetPassword = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    password = await passwordManager.hashPassword(password);

    // Update user with email and otp is null then update password
    let result = await userRepo.updateUser(
        { email, OTP: null, isDeleted: false },
        { isVerified: true, password, OTP: "Not Verified OTP" },
    );

    if (!result.success) {
        return res.status(403).json(
            createResponse(result.success, "Unauthorized to preform this action", result.statusCode, result.error)
        );
    }

    result = await mailManager.emailSetup("confirmedResetEmail", {
        email: email,
        subject: 'Password has been changed successfully',
    });

    // if there are any error in sending the message
    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "There are something wrong", result.statusCode, result.error)
        )
    }

    // send result
    return res.status(result.statusCode).json(
        createResponse(true, "Password has been changed successfully", result.statusCode)
    );
});

exports.getProfile = asyncHandler(async (req, res) => {
    // get user with id
    const user = await userRepo.findUser(
        { _id: req.user._id },
        "name country city region phone gender image -_id"
    );

    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, "This user is not found", user.statusCode, user.error)
        );
    }

    // send the result
    return res.status(200).json(
        createResponse(true, "User Found", 200, null, user.data)
    );
});

exports.updateProfile = asyncHandler(async (req, res) => {
    // check if coordinates is exist
    if (req.body.latitude && req.body.longitude) {
        const {latitude, longitude} = req.body;
        req.body.location = {
            type: "Point",
            coordinates: [latitude * 1, longitude * 1]
        }
    }

    // check if the image is exist
    if (req.file) {
        req.body.image = req.file.location;
    }

    // update user with id
    const result = await userRepo.findAndUpdateUser(
        { _id: req.user._id },
        req.body,
        "name country city region phone gender image -_id",
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "This user is not found", result.statusCode, result.error)
        );
    }

    // send the result
    return res.status(result.statusCode).json(
        createResponse(result.success, "User updated successfully", result.statusCode, null, result.data)
    );
});

exports.changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // get the user with id
    const user = await userRepo.findUser(
        { _id: req.user._id },
        "password"
    );

    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, "This user is not found", user.statusCode, user.error)
        );
    }

    // compare the old password with the current password
    const matched = await passwordManager.comparePassword(currentPassword, user.data.password);
    if (!matched) {
        return res.status(401).json(
            createResponse(false, "Incorrect password", 401)
        );
    }

    // update the password with the new password
    const password = await passwordManager.hashPassword(newPassword);
    const result = await userRepo.updateUser(
        { _id: req.user._id },
        { password }
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "This user is not found", result.statusCode, result.error)
        );
    }

    // send the result
    return res.status(result.statusCode).json(
        createResponse(result.success, "Password has been changed successfully", result.statusCode)
    );
});
