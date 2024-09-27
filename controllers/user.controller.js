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
    const isExist = await userRepo.findOne({
        filter: { $or: [ { email }, { userName } ] },
        select: "_id"
    });

    if (isExist.success) {
        return res.status(409).json(
            createResponse(false, "Email or userName already connect to an account", 409, isExist.error)
        )
    }

    // create user with the generated otp
    password = await passwordManager.hashPassword(password);
    const user = await userRepo.create({
        data: { name, userName, email, password, OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
    });

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
    const isExist = await userRepo.findOne({
        filter: { $or: [ { email }, { userName } ] },
        select: "-OTP -accountType -createAt -couponClaimed -voucherClaimed"
    });

    if (!isExist.success) {
        return res.status(401).json(
            createResponse(isExist.success, "Incorrect userName or email", 401, isExist.error)
        );
    }

    // compare passwords
    const matched = passwordManager.comparePassword(password, isExist.data.password);
    if (!matched) {
        return res.status(401).json(
            createResponse(false, "Incorrect password", 401)
        );
    }

    // check if the account is verified
    if (!isExist.data.isVerified) {
        return res.status(401).json(
            createResponse(false, "Please verify your account first to login", 401)
        );
    }

    // create token for the user
    const token = tokenManager.generateToken(isExist.data);

    // return result
    return res.status(200).json(
        createResponse(true, "Login successfully", 200, null, {
            token,
            user: isExist.data
        })
    );
});

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, OTP } = req.body;
    
    // find the user and update the OTP to null
    const result = await userRepo.updateOne({
        filter: { email, OTP, OTPExpiresAt: { $gt: new Date() } },
        update: { OTP: null, isVerified: true },
    });

    if (!result.success) {
        return res.status(401).json(
            createResponse(result.success,"Invalid OTP code", result.statusCode, result.error)
        );
    }

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
    let result = await userRepo.updateOne({
        data: { email },
        update: {  OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
    });

    // email not found
    if (!result.success)
        return res.status(result.statusCode).json(
                createResponse(result.success, "This email has no accounts", result.statusCode, result.error)
            );

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
    let result = await userRepo.updateOne({
        data: { email },
        update: {  OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
    });

    // email not found
    if (!result.success)
        return res.status(result.statusCode).json(
            createResponse(result.success, "This email has no accounts", result.statusCode, result.error)
        );

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
    let result = await userRepo.updateOne({
        filter: { email, OTP: null }, 
        update: { isVerified: true, password }, 
    });

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
    const user = userRepo.findOne({ 
        filter: { _id: req.user.id },
        select: "name address phone gender image"
    });
    
    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, "This user is deleted", user.statusCode, user.error)
        );
    }

    // send the result
    return res.status(200).json(
        createResponse(true, "User Found", 200, null, user.data)
    );
});

exports.updateProfile = asyncHandler(async (req, res) => {
});