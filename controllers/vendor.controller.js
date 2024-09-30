const passwordManager = require("../helpers/passwordManager");
const otpManager = require('../helpers/otpManager');
const vendorRepo = require('../models/vendor/vendor.repo');
const tokenManager = require('../helpers/tokenManager');
const mailManager = require('../utils/emailService');
const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');

exports.signIn = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    // check if the userName or email exists
    const isExist = await vendorRepo.findVendor(
        { userName },
        "-OTP -OTPExpiresAt -location -__v"
    );

    if (!isExist.success) {
        return res.status(401).json(
            createResponse(isExist.success, "Incorrect userName", 401, isExist.error)
        );
    }

    // compare passwords
    const matched = await passwordManager.comparePassword(password, isExist.data.password);
    if (!matched) {
        return res.status(401).json(
            createResponse(false, "Incorrect password", 401)
        );
    }

    // check if the account is inactive
    if (isExist.data.status === "inactive") {
        return res.status(401).json(
            createResponse(false, "Your account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    // create token for the vendor
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
    
    // find the vendor and update the OTP to null
    const vendor = await vendorRepo.findVendor(
        { email },
        "status OTP OTPExpiresAt _id"
    )

    // email not found
    if (!vendor.success) {
        return res.status(vendor.statusCode).json(
            createResponse(vendor.success, "This email has no accounts", vendor.statusCode, vendor.error)
        );
    }

    // check if the account is inactive
    if (vendor.data.status === "inactive") {
        return res.status(401).json(
            createResponse(false, "Your account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    // if OTP is not equal to the vendor OTP
    if (vendor.data.OTP !== OTP) {
        return res.status(401).json(
            createResponse(false, "Incorrect OTP", 401)
        );
    }

    // check if the OTP is expired
    if (new Date() > vendor.data.OTPExpiresAt) {
        return res.status(401).json(
            createResponse(false, "OTP has been expired", 401)
        );
    }

    // update the vendor with the OTP to null
    const result = await vendorRepo.updateVendor(
        { _id: vendor.data._id },
        { OTP: null }
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
    const vendor = await vendorRepo.findVendor(
        { email },
        "status _id",
    );

    // email not found
    if (!vendor.success) {
        return res.status(vendor.statusCode).json(
                createResponse(vendor.success, "This email has no accounts", vendor.statusCode, vendor.error)
        );
    }

    // check if the account is inactive
    console.log(vendor.data)
    if (vendor.data.status === "inactive") {
        return res.status(401).json(
            createResponse(false, "Your account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    // update the vendor with the OTP
    await vendorRepo.updateVendor(
        { _id: vendor.data._id },
        { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
    );

    // send email to the vendor
    const result = await mailManager.emailSetup("OTPVerification", {
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
    const vendor = await vendorRepo.findVendor(
        { email },
        "status _id",
    );

    // email not found
    if (!vendor.success) {
        return res.status(vendor.statusCode).json(
                createResponse(vendor.success, "This email has no accounts", vendor.statusCode, vendor.error)
        );
    }

    // check if the account is inactive
    if (vendor.data.status === "inactive") {
        return res.status(401).json(
            createResponse(false, "Your account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    // update the vendor with the OTP
    await vendorRepo.updateVendor(
        { _id: vendor.data._id },
        { OTP: OTP.value, OTPExpiresAt: OTP.expiresAt }
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
    const vendor = await vendorRepo.findVendor(
        { email },
        "OTP OTPExpiresAt _id status"
    );


    // email not found
    if (!vendor.success) {
        return res.status(vendor.statusCode).json(
            createResponse(vendor.success, "This email has no accounts", vendor.statusCode, vendor.error)
        );
    }

    // check if the account is inactive
    if (vendor.data.status === "inactive") {
        return res.status(401).json(
            createResponse(false, "Your account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    // Update the vendor with new password
    let result = await vendorRepo.updateVendor(
        { _id: vendor.data._id },
        { password }
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, result.message, result.statusCode, result.error)
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
    const vendor = await vendorRepo.findVendor(
        { _id: req.user._id },
        "name country city region primaryPhone secondaryPhone gender profileImage coverImage _id "
    );
    console.log(vendor)
    if (!vendor.success) {
        return res.status(vendor.statusCode).json(
            createResponse(vendor.success, "This vendor is not found", vendor.statusCode, vendor.error)
        );
    }

    // send the result
    return res.status(200).json(
        createResponse(true, "vendor Found", 200, null, vendor.data)
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

    // check if the profileImage or coverImage are exist
    /*if (req.files.profileImage) {
        req.body.profileImage = req.files.profileImage[0];
    }

    if (req.files.coverImage) {
        req.body.coverImage = req.files.coverImage[0];
    }*/

    
    // update vendor with id
    const result = await vendorRepo.findAndUpdateVendor(
        { _id: req.user._id, status: "active" },
        req.body,
        "name country city region phoneNumbers gender profileImage coverImage _id",
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, "This vendor is not found", result.statusCode, result.error)
        );
    }

    // send the result
    return res.status(result.statusCode).json(
        createResponse(result.success, "Vendor updated successfully", result.statusCode, null, result.data)
    );
});

exports.changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // get the vendor with id 
    const vendor = await vendorRepo.findVendor(
        { _id: req.user._id },
        "password status"
    );

    if (!vendor.success) {
        return res.status(vendor.statusCode).json(
            createResponse(vendor.success, "This vendor is not found", vendor.statusCode, vendor.error)
        );
    }

    // check if the account is inactive
    if (vendor.data.status === "inactive") {
        return res.status(401).json(
            createResponse(false, "Your account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    // compare the old password with the current password
    const matched = await passwordManager.comparePassword(currentPassword, vendor.data.password);
    if (!matched) {
        return res.status(401).json(
            createResponse(false, "Incorrect password", 401)
        );
    }

    // update the password with the new password
    const password = await passwordManager.hashPassword(newPassword);
    const result = await vendorRepo.updateVendor(
        { _id: req.user._id },
        { password }
    );

    // send the result
    return res.status(result.statusCode).json(
        createResponse(result.success, "Password has been changed successfully", result.statusCode)
    );
});