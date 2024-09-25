const { otpGenerator } = require('../helpers/otp.helper');
const passwordManager = require('../helpers/password.helper');
const userRepo = require('../models/user/user.repo');
const tokenManager = require('../helpers/tokenManager');
const mailManager = require('../utils/emailService');
const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');
const moment = require('moment');

exports.signUp = asyncHandler(async (req, res) => {
    let { name, username, email, password } = req.body;

    // generate otp code
    const OTP = otpGenerator(); 
    
    // check if the email or username already exist
    const isNotExist = await userRepo.isNotExist({email, username});
    if (!isNotExist.success) {
        return res.status(409).json(
            createResponse(false, "Email or Username already connect to an account", 409, isNotExist.error)
        )
    }

    // create user with the generated otp
    password = await passwordManager.hashPassword(password);
    const user = await userRepo.createUser({ name, username, email, password, OTP });
    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, user.message, user.statusCode, user.error)
        );
    }

    // generate message with otp then send it to email of the user
    await mailManager.sendOTPVerificationEmail({
        email: req.body.email,
        subject: 'OTP verification',
        OTP,
    })

    // response
    return res.status(user.statusCode).json(
        createResponse(user.success, "OTP code has been sent to your email", user.statusCode)
    );
});

exports.signIn = asyncHandler(async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    // check if the username or email exists
    const user = await userRepo.isExist({usernameOrEmail});
    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, user.message, user.statusCode, user.error)
        );
    }

    // compare passwords
    const matched = await passwordManager.comparePasswords(password, user.data.password);
    if (!matched) {
        return res.status(401).json(
            createResponse(false, "Invalid credentials", 401)
        );
    }

    // check if the account is verified
    if (!user.data.isVerified) {
        return res.status(401).json(
            createResponse(false, "Please verify your account first to login", 401)
        );
    }

    // create token for the user
    const token = tokenManager.generateToken(user.data);

    // return result
    return res.status(200).json(
        createResponse(true, "Login successfully", 200, null, {
            token,
            user: user.data
        })
    );
});

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    // get user 
    let user = await userRepo.getUser({ email });
    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success,"There are no account connected to this email", user.statusCode, user.error)
        );
    }
    
    // check OTP code
    const matched = (user.data.OTP === req.body.OTP);
    if (!matched) {
        return res.status(401).json(
            createResponse(false, "Incorrect OTP code", 401)
        );
    }

    // verify user
    user = await userRepo.findAndUpdate({ email }, {OTP: null, isVerified: true}, { new: true });
    if (!user.success) {
        return res.status(user.statusCode).json(
            createResponse(user.success, user.message, user.statusCode, user.error)
        );
    }

    // return results
    return res.status(user.statusCode).json(
        createResponse(user.success, "OTP has been verified correctly!", user.statusCode, null, user.data)
    );
});

exports.resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // generate otp code
    const OTP = otpGenerator(); 

    // get user and update
    user = await userRepo.findAndUpdate({ email }, { OTP });
    if (!user.success)
        return res.status(user.statusCode).json(
                createResponse(user.success, user.message, user.statusCode, user.error)
            );

    // send email to the user
    await mailManager.sendOTPVerificationEmail({
        email: user.data.email,
        subject: 'OTP verification',
        OTP
    });

    // send result
    return res.status(201).json(
        createResponse(true, "OTP has been sent to your email", 201)
    );
});

exports.forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // generate otp code
    const OTP = otpGenerator(); 

    // get user and update
    user = await userRepo.findAndUpdate({ email }, { OTP });
    if (!user.success)
        return res.status(user.statusCode).json(
                createResponse(user.success, user.message, user.statusCode, user.error)
            );

    // send email to the user
    await mailManager.sendForgetEmail({
        email: user.data.email,
        subject: 'Reset Your Password - OTP Verification',
        OTP
    });

    // send result
    return res.status(201).json(
        createResponse(true, "Please enter the OTP that has been sent to your email to reset your password", 201)
    );
});

exports.resetPassword = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    password = await passwordManager.hashPassword(password);

    // get user with email and otp is null then update password
    let user = await userRepo.findAndUpdate({ email, OTP: null }, { isVerified: true, password }, { new: true });
    if (!user.success) {
        return res.status(403).json(
            createResponse(user.success, "Unauthorized to preform this action", user.statusCode, user.error)
        );
    }

    // send email
    await mailManager.sendConfirmedResetPasswordEmail({
        email: user.data.email,
        subject: 'Password Reset Confirmation Email',
    });

    return res.status(201).json(
        createResponse(user.success, "Password has been changed successfully", 201)
    );
});
