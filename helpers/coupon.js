const userRepo = require("../models/user/user.repo");
const roles = require("../enums/roles");
const couponEnum = require("../enums/coupon");

exports.getCouponsForUser = async (req) => {
    const select = "couponType code discountType discountValue discountPercent status expireAt"

    // Use the filterBuilder to construct the coupon filter for the user
    const couponFilter = await this.filterBuilder(req);

    return { couponFilter, select };
}

exports.getCouponsForVendor = async(req) => {
    const select = "code discountType discountValue discountPercent status expireAt used vendor"

    // Use the filterBuilder to construct the coupon filter for the vendor
    const couponFilter = await this.filterBuilder(req);
    console.log(couponFilter)
    return { couponFilter, select };
}

exports.getCouponsForAdmin = async(req) => {
    const select = "code discountType discountValue discountPercent status expireAt used"

    // Use the filterBuilder to construct the coupon filter for the admin
    const couponFilter = await this.filterBuilder(req);

    return { couponFilter, select };
}

exports.filterBuilder = async (req) => {
    const filter = {};

    // Case single coupon
    if(req.params.id) filter._id = req.params.id;

    // Case list of coupons
    if (req.query.status) filter.status = req.query.status;
    if (req.query.code) filter.code = { $regex: req.query.code, $options: 'i' };
    if (req.query.date) filter.expireAt = { $lte: new Date(req.query.date) };

    switch (req.user.role) {
        case roles.USER:
            const user = await userRepo.findUser({ _id: req.user._id }, "country region city");
            filter.$or = [
                { couponType: couponEnum.couponType.GLOBAL },
                { couponType: 'global' },
                { 'termsAndConditions.audienceLocation.type': 'country', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.country, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'region', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.region, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'city', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.city, 'i') } }
            ];
            break;

        case roles.VENDOR:
            console.log(req.user.role)
            filter.vendor = req.user._id;
            break;

        default:
            break;
    }
    return filter;
}