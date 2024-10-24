const roles = require("../enums/roles");
const couponEnum = require("../enums/coupon");
const { paginate } = require("../utils/pagination");
const { asyncHandler } = require("../utils/asyncHandler");
const { createResponse } = require("../utils/createResponse")
const filterAndSelectManager = require("../helpers/filterAndSelectManager");

const userRepo = require("../models/user/user.repo");
const couponRepo = require("../models/coupon/coupon.repo");

const couponHelpers = require("../helpers/coupon")

exports.create = asyncHandler(async (req, res) => {
    const userRole = req.user.role;

    // If the coupon is targeted
    if (req.body.termsAndConditions?.audienceLocation) {
        req.body.couponType = couponEnum.couponType.TARGET
    } else {
        req.body.couponType = couponEnum.couponType.GLOBAL
    }

    if (req.body.products) {
        const result = await couponHelpers.checkProductsOwnership(req);
        if (!result) {
            return res.status(400).json(createResponse(false, "One or more products are not found", 400))
        }
    }

    //Check that the categories assigned are exist
    if (req.body.categories) {
        const result = await couponHelpers.checkCategoriesExistence(req);
        if (!result) {
            return res.status(400).json(createResponse(false, "One or more categories are not found", 400))
        }
    }

    userRole === roles.VENDOR ? req.body.vendor = req.user._id : req.body.admin = req.user._id;
    const result = await couponRepo.create(req.body);
    return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode, result.error, result.data))
});

exports.getAll = asyncHandler(async (req, res) => {
    let user = null;
    if (req.user.role === roles.USER) {
        user = await userRepo.findUser({ _id: req.user._id }, "country region city coins");
    }
    const couponOptions = { role: req.user.role, userId: req.user._id, userCountry: user?.data?.country, userRegion: user?.data?.region, userCity: user?.data?.city };
    const { couponFilter } = filterAndSelectManager.filterHandler(couponOptions);
    const { couponSelect } = filterAndSelectManager.selectHandler(couponOptions);

    const { page, size, sortBy, sortOrder } = req.query;
    const options = paginate(page, size);
    options["sort"] = { [sortBy]: sortOrder === "asc" ? 1 : -1 }

    const coupons = await couponRepo.getList(couponFilter, couponSelect, options)
    return res.status(200).json(createResponse(true, "Coupons are found", 200, null, coupons))
});

exports.getById = asyncHandler(async (req, res) => {
    let user = null;
    if (req.user.role === roles.USER) {
        user = await userRepo.findUser({ _id: req.user._id }, "country region city couponClaimed coins");
    }
    const couponOptions = { role: req.user.role, couponId: req.params.id, userId: req.user._id, userCountry: user?.data?.country, userRegion: user?.data?.region, userCity: user?.data?.city };
    const { couponFilter } = filterAndSelectManager.filterHandler(couponOptions);

    const select = req.user.role === roles.USER ? "-used -admin -couponUsage -couponType -isDeleted -updatedAt -createdAt" : "";
    const populate = [
        { path: "vendor", select: "userName email primaryPhone" },
        { path: "admin", select: "userName email phoneNumber" },
        { path: "products", select: "name" },
        { path: "categories", select: "name" }
    ]

    //Check if the coupon is exist
    const coupon = await couponRepo.isExist(couponFilter, select, populate);
    if (!coupon.success) {
        return res.status(coupon.statusCode).json(createResponse(coupon.success, coupon.message, coupon.statusCode, coupon.error))
    }

    return res.status(200).json(createResponse(true, "Coupon is found", 200, null, coupon.data))
});

exports.update = asyncHandler(async (req, res) => {
    if (req.body.termsAndConditions?.audienceLocation?.location) {
        if (req.body.couponType === couponEnum.couponType.GLOBAL) {
            return res.status(422).json(createResponse(false, "Coupon type can't be changed to GLOBAL with audienceLocation provided", 400))
        }
        req.body.couponType = couponEnum.couponType.TARGET
    }

    if (req.body.discountValue || req.body.discountPercent) {
        req.body.discountPercent ? req.body.discountValue = null : req.body.discountPercent = null;
    }

    if (req.body.couponUsage?.type === couponEnum.usageLimit.UNLIMITED) {
        req.body.couponUsage.count = null
    }

    if (req.body.userUsage?.type === couponEnum.usageLimit.UNLIMITED) {
        req.body.userUsage.count = null
    }

    if (req.body.products) {
        const result = await couponHelpers.checkProductsOwnership(req);
        if (!result) {
            return res.status(400).json(createResponse(false, "One or more products are not found", 400))
        }
    }

    if (req.body.categories) {
        const result = await couponHelpers.checkCategoriesExistence(req);
        if (!result) {
            return res.status(400).json(createResponse(false, "One or more categories are not found", 400))
        }
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
    const user = await userRepo.findUser({ _id: req.user._id }, "country region city couponClaimed coins");
    const couponOptions = { role: req.user.role, couponId: req.params.id, userId: req.user._id, userCountry: user?.data?.country, userRegion: user?.data?.region, userCity: user?.data?.city };

    const { couponFilter } = filterAndSelectManager.filterHandler(couponOptions);

    //Check if the coupon is exist
    const coupon = await couponRepo.isExist(couponFilter, { usedBy: { $elemMatch: { userId: req.user._id } }, expireAt: 1, couponUsage: 1, userUsage: 1, totalUsed: 1 });
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
        return res.status(400).json(createResponse(false, "You have exceeded the user usage limit for this coupon", 400))
    }

    //Check if user isn't claiming a coupon now.
    const claimed = await userRepo.updateUser({ _id: req.user._id, couponClaimed: null }, { couponClaimed: req.params.id });
    if (!claimed.success) {
        return res.status(400).json(createResponse(false, "You are already claiming a coupon", 400))
    }

    return res.status(200).json(createResponse(true, "Coupon is claimed", 200))
});






