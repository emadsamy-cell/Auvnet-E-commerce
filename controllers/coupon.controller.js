const { createResponse } = require("../utils/createResponse")
const couponRepo = require("../models/coupon/coupon.repo");
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

    const select = req.user.role === roles.USER ? "-used -vendor -couponUsage -couponType" : "";
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







