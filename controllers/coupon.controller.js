const { createResponse } = require("../utils/createResponse")
const couponRepo = require("../models/coupon/coupon.repo");
const userRepo = require("../models/user/user.repo");
const { asyncHandler } = require("../utils/asyncHandler");
const { paginate } = require("../utils/pagination");
const couponEnum = require("../enums/coupon");
const roles = require("../enums/roles");

const couponHelpers = require("../helpers/coupon")

exports.create = asyncHandler(async (req, res) => {
    const userRole = req.user.role;

    // If the coupon is targeted
    if (req.body.termsAndConditions?.audienceLocation) {
        req.body.couponType = couponEnum.couponType.TARGET
    } else {
        req.body.couponType = couponEnum.couponType.GLOBAL
    }

    // If the sender is vendor
    if (userRole === roles.VENDOR) {
        //TODO: check that products assigned belongs to the vendor
        if (req.products) {
            //from products collection, search for productId with vendorId for each product in array.
            //if not found, return error
        }
        req.body.vendor = req.user._id;
    }
    // If the sender is admin
    else {
        //TODO: check that products are exist
        if (req.products) {
            //from products collection, search for productId in products collection for each product in array.
            //if not found, return error
        }
        req.body.admin = req.user._id;
    }

    //TODO: check that the categories assigned are exist
    if (req.categories) {
        //from categories collection, search for categoryId in categories collection for each category in array.
        //if not found, return error
    }

    const result = await couponRepo.create(req.body);
    return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode, result.error, result.data))
});

exports.getAll = asyncHandler(async (req, res) => {
    let result = null;

    //If sender is user, return global coupons and targeted coupons for the user's location
    if (req.user.role === roles.USER) {
        result = await couponHelpers.getCouponsForUser(req)
    }

    //If sender is vendor, return coupons for the vendor's products
    else if (req.user.role === roles.VENDOR) {
        result = await couponHelpers.getCouponsForVendor(req)
    }

    //If sender is admin, return all coupons
    else {
        result = await couponHelpers.getCouponsForAdmin(req)
    }

    const { page, size, sortBy, sortOrder } = req.query;
    const options = paginate(page, size);
    options["sort"] = { [sortBy]: sortOrder === "asc" ? 1 : -1 }

    const coupons = await couponRepo.getList(result.couponFilter, result.select, options)
    return res.status(200).json(createResponse(true, "Coupons are found", 200, null, coupons))
});

exports.getById = asyncHandler(async (req, res) => {
    //filterBuilder function is used to build the filter based on the user role
    const filter = await couponHelpers.filterBuilder(req);

    const select = req.user.role === roles.USER ? "-used -vendor -couponUsage -couponType -isDeleted" : "";
    const populate = [
        { "path": "vendor", "select": "userName email primaryPhone" },
        { "path": "admin", "select": "userName email phoneNumber" },
        // { "path": "products", "select": "name" },
        // { "path": "categories", "select": "name" }
    ]

    //Check if the coupon is exist
    const coupon = await couponRepo.isExist(filter, select, populate);
    if (!coupon.success) {
        return res.status(coupon.statusCode).json(createResponse(coupon.success, coupon.message, coupon.statusCode, coupon.error))
    }

    return res.status(200).json(createResponse(true, "Coupon is found", 200, null, coupon.data))
});

exports.update = asyncHandler(async (req, res) => {
    if (req.body.termsAndConditions?.audienceLocation?.location) {
        req.body.couponType = couponEnum.couponType.TARGET
    }

    if (req.body.discountPercent) {
        req.body.discountValue = null
    } else if (req.body.discountValue) {
        req.body.discountPercent = null
    }

    if (req.body.couponUsage?.type === couponEnum.usageLimit.UNLIMITED) {
        req.body.couponUsage.count = null
    }

    if (req.body.userUsage?.type === couponEnum.usageLimit.UNLIMITED) {
        req.body.userUsage.count = null
    }

    if (req.body.products) {
        //TODO: check that products are exist
        //TODO: check that products assigned belongs to the vendor if the sender is vendor
    }

    if (req.body.categories) {
        //TODO: check that categories are exist
        //TODO: check that categories assigned belongs to the vendor if the sender is vendor
    }

    const filter = req.user.role === roles.VENDOR ?
        { _id: req.params.id, vendor: req.user._id } :
        { _id: req.params.id, vendor: { $exists: false } }
    const result = await couponRepo.updateAndReturn(filter, req.body, "", { new: true });
    return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode, result.error, result.data))
});

exports.delete = asyncHandler(async (req, res) => {
    const isDeleted = req.method === "DELETE" ? true : false;
    const statusCode = isDeleted ? 204 : 200;
    const message = isDeleted ? "Coupon is deleted" : "Coupon is restored";

    const filter = req.user.role === roles.VENDOR ?
        { _id: req.params.id, vendor: req.user._id } :
        { _id: req.params.id }
    const result = await couponRepo.update(filter, { isDeleted });
    if (!result.success) {
        return res.status(403).json(createResponse(result.success, "You aren't authorized to access this coupon", 403))
    }

    //TODO: when admin deletes a coupon, send notification to the vendor

    return res.status(statusCode).json(createResponse(result.success, message, statusCode))
});

exports.claim = asyncHandler(async (req, res) => {
    //filterBuilder function is used to build the filter based on the user role
    //Check that given coupon id is valid to the user based on: user's location, not deleted.
    const filter = await couponHelpers.filterBuilder(req);

    //Check if the coupon is exist
    const coupon = await couponRepo.isExist(filter, { usedBy: { $elemMatch: { userId: req.user._id } }, expireAt: 1, couponUsage: 1, userUsage: 1, totalUsed: 1 } );
    if (!coupon.success) {
        return res.status(coupon.statusCode).json(createResponse(coupon.success, coupon.message, coupon.statusCode, coupon.error))
    }

    const { userUsage, couponUsage, usedBy, expireAt, totalUsed } = coupon.data;

    //If the coupon is expired
    if (expireAt < new Date()) {
        return res.status(400).json(createResponse(false, "Coupon is expired", 400))
    }

    //If coupon has exceeded the coupon usage limit
    if (couponUsage.type === couponEnum.usageLimit.LIMITED && couponUsage.count <= totalUsed) {
        return res.status(400).json(createResponse(false, "Coupon has exceeded the usage limit", 400))
    }

    //If user has exceeded the user usage limit
    if (userUsage.type === couponEnum.usageLimit.LIMITED && usedBy.length && userUsage.count <= usedBy[0].count) {
        return res.status(400).json(createResponse(false, "You have exceeded the user usage limit", 400))
    }

    //Check if user isn't claiming a coupon now.
    const claimed = await userRepo.updateUser({ _id: req.user._id, couponClaimed: null }, { couponClaimed: req.params.id });
    if (!claimed.success) {
        return res.status(400).json(createResponse(false, "You are already claiming a coupon", 400))
    }

    return res.status(200).json(createResponse(true, "Coupon is claimed", 200))
});






