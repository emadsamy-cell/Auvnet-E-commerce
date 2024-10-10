const userRepo = require("../models/user/user.repo");
const roles = require("../enums/roles");
const couponEnum = require("../enums/coupon");

const productRepo = require("../models/product/product.repo");
const categoryRepo = require("../models/category/category.repo");

exports.getCouponsForUser = async (req) => {
    const select = "couponType code discountType expireAt status"

    // Use the filterBuilder to construct the coupon filter for the user
    const couponFilter = await this.filterBuilder(req);

    return { couponFilter, select };
}

exports.getCouponsForVendor = async (req) => {
    const select = "code couponType discountType status expireAt isDeleted"

    // Use the filterBuilder to construct the coupon filter for the vendor
    const couponFilter = await this.filterBuilder(req);

    return { couponFilter, select };
}

exports.getCouponsForAdmin = async (req) => {
    const select = "code couponType discountType status expireAt isDeleted"

    // Use the filterBuilder to construct the coupon filter for the admin
    const couponFilter = await this.filterBuilder(req);

    return { couponFilter, select };
}

exports.filterBuilder = async (req) => {
    const filter = {};

    // Case single coupon
    if (req.params.id) filter._id = req.params.id;

    // Case list of coupons
    if (req.query.status) filter.status = req.query.status;
    if (req.query.code) filter.code = { $regex: req.query.code, $options: 'i' };
    if (req.query.date) filter.expireAt = { $lte: new Date(req.query.date) };

    switch (req.user.role) {
        case roles.USER:
            const user = await userRepo.findUser({ _id: req.user._id }, "country region city");
            filter.isDeleted = { $in: [false, null] };
            filter.$or = [
                { couponType: couponEnum.couponType.GLOBAL },
                { 'termsAndConditions.audienceLocation.type': 'country', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.country, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'region', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.region, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'city', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.city, 'i') } }
            ];
            break;

        case roles.VENDOR:
            filter.vendor = req.user._id;
            break;

        default:
            break;
    }
    return filter;
}

exports.checkProductsOwnership = async (req) => {
    const filter = req.user.role === roles.VENDOR ? { _id: { $in: req.body.products }, createdBy: req.user._id, isDeleted: false } : { _id: { $in: req.body.products }, isDeleted: false };
    const products = await productRepo.getList(filter, "_id");
    return products.data.products.length === req.body.products.length;
}

exports.checkCategoriesExistence = async (req) => {
    const categories = await categoryRepo.getList({ _id: { $in: req.body.categories }, isDeleted: false }, "_id");
    return categories.data.categories.length === req.body.categories.length;
}