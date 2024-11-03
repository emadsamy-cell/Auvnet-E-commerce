const roles = require('../enums/roles');
const passwordManager = require("../helpers/passwordManager");
const otpManager = require('../helpers/otpManager');
const vendorRepo = require('../models/vendor/vendor.repo');
const tokenManager = require('../helpers/tokenManager');
const mailManager = require('../utils/emailService');
const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');
const { paginate } = require("../utils/pagination");
const { selectHandler } = require('../helpers/filterAndSelectManager');

exports.signIn = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    // check if the userName exists
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
    // check if the account is deleted
    if (isExist.data.isDeleted) {
        return res.status(401).json(
            createResponse(false, "Your account has been deleted. Please contact support for further assistance.", 401)
        );
    }

    // check if the account is inactive
    if (isExist.data.status === "inactive") {
        return res.status(401).json(
            createResponse(false, "Your account has been suspended. Please contact support for further assistance.", 401)
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
            vendor: isExist.data
        })
    );
});

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { email, OTP } = req.body;

    // find the vendor with this email
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

    // check if the account is deleted
    if (vendor.data.isDeleted) {
        return res.status(401).json(
            createResponse(false, "Your account has been deleted. Please contact support for further assistance.", 401)
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

exports.forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // generate otp code
    const OTP = otpManager.generateOTP();

    // Find vendor with this email
    const vendor = await vendorRepo.findVendor(
        { email, isDeleted: false },
        "status _id",
    );

    // email not found
    if (!vendor.success) {
        return res.status(vendor.statusCode).json(
            createResponse(vendor.success, "This email has no accounts", vendor.statusCode, vendor.error)
        );
    }

    // check if the account is deleted
    if (vendor.data.isDeleted) {
        return res.status(401).json(
            createResponse(false, "Your account has been deleted. Please contact support for further assistance.", 401)
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

    // Find Vendor with this Email
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

    // check if the account is deleted
    if (vendor.data.isDeleted) {
        return res.status(401).json(
            createResponse(false, "Your account has been deleted. Please contact support for further assistance.", 401)
        );
    }

    // check if the account is inactive
    if (vendor.data.status === "inactive") {
        return res.status(401).json(
            createResponse(false, "Your account has been suspended. Please contact support for further assistance.", 401)
        );
    }

    if (vendor.data.OTP !== null) {
        return res.status(403).json(
            createResponse(vendor.success, "Unauthorized to preform this action", vendor.statusCode, vendor.error)
        );
    }

    // Update the vendor with new password and OTP to 1
    password = await passwordManager.hashPassword(password);
    let result = await vendorRepo.updateVendor(
        { _id: vendor.data._id },
        { password, OTP: "Not Verified OTP" }
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
        const { latitude, longitude } = req.body;
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
    const result = await vendorRepo.updateVendor(
        { _id: req.user._id },
        req.body,
    );

    // send the result
    return res.status(result.statusCode).json(
        createResponse(result.success, result.message, result.statusCode, null, result.data)
    );
});

exports.changePassword = asyncHandler(async (req, res) => {
    const {  newPassword } = req.body;

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

//______________________________________________Vendor Management______________________________________________________

// Create vendor account
exports.createAccount = asyncHandler(async (req, res) => {
    const { name, userName, email, password } = req.body;
    // Hash password
    const hashedPassword = await passwordManager.hashPassword(password);

    // Save vendor details to database
    const result = await vendorRepo.create({ name, userName, email, password: hashedPassword, createdBy: req.user._id });
    if (!result.success) {
        return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode));
    }

    // Send email to vendor with credentials
    const emailSent = await sendEmailWithCredentials({ name, userName, email, password });
    if (!emailSent.success) {
        return res.status(emailSent.status).json(createResponse(emailSent.success, emailSent.message, emailSent.statusCode, emailSent.error));
    }

    return res.status(201).json(createResponse(true, "Vendor account created successfully", 201, null, { name, userName, email }));
});

// Send email to vendor with credentials
const sendEmailWithCredentials = async (vendor) => {
    const emailOptions = {
        name: vendor.name,
        email: vendor.email,
        subject: "Vendor Account Credentials",
        userName: vendor.userName,
        password: vendor.password,
        role: "Vendor"
    };

    const emailSent = await mailManager.emailSetup("accountCredentials", emailOptions);
    return emailSent;
};

// Get all vendors
exports.getVendors = asyncHandler(async (req, res) => {
    const filter = {}
    if (req.user.role !== roles.USER) {
        if (req.query.status) filter.status = req.query.status;
        if (req.query.isDeleted) filter.isDeleted = req.query.isDeleted;
    } else {
        filter.isDeleted = false;
        filter.status = "active";
    }

    const { vendorSelect } = selectHandler({ role: req.user.role });

    const { page, size } = req.query;
    const options = paginate(page, size);

    const vendors = await vendorRepo.getList(
        filter,
        vendorSelect,
        [{ path: "createdBy", select: "userName email" }],
        options.skip,
        options.limit,
        { createdAt: -1 }
    );
    return res.status(200).json(createResponse(true, "Vendors fetched successfully", 200, null, vendors.data));
});

// Update vendor status
exports.updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { vendorId } = req.params;

    // Update vendor status
    const result = await vendorRepo.updateVendor({ _id: vendorId }, { status });
    if (!result.success) {
        return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode));
    }

    return res.status(200).json(createResponse(true, "Vendor status updated successfully", 200));
});

// Delete/unDelete vendor
exports.delete = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    const isDeleted = req.method === "DELETE" ? true : false;

    //TODO: if to delete vendor, check if there are any products or orders related to this vendor.

    const result = await vendorRepo.updateVendor(
        { _id: vendorId },
        { isDeleted }
    );
    if (!result.success) {
        return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode));
    }

    return req.method === "DELETE" ?
        res.status(204).json(createResponse(result.success, result.message, 204))
        :
        res.status(200).json(createResponse(result.success, "Vendor is restored successfully", 200))
})