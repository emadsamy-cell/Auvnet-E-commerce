const userRepo = require('../models/user/user.repo');
const voucherEnum = require("../enums/voucher");
const roles = require("../enums/roles");

exports.getVouchersForUser = async (req) => {
    // const select = "code offerType description expireAt"
    const select = "code description offerType status expireAt"

    // Use the filterBuilder to construct the coupon filter for the user
    const { voucherFilter } = await this.filterBuilder(req);

    return { voucherFilter, select };
}

exports.getVouchersForAdmin = async (req) => {
    const select = "code description offerType status expireAt isDeleted"

    // Use the filterBuilder to construct the coupon filter for the admin
    const { voucherFilter } = await this.filterBuilder(req);

    return { voucherFilter, select };
}

exports.filterBuilder = async (req) => {
    const voucherFilter = {};
    let user;
    // Case single voucher
    if (req.params.id) voucherFilter._id = req.params.id;

    // Case list of vouchers
    if (req.query.status) voucherFilter.status = req.query.status;
    if (req.query.code) voucherFilter.code = { $regex: req.query.code, $options: 'i' };
    if (req.query.date) voucherFilter.expireAt = { $lte: new Date(req.query.date) };

    switch (req.user.role) {
        case roles.USER:
            user = await userRepo.findUser({ _id: req.user._id }, "country region city voucherClaimed coins");
            voucherFilter.isDeleted = { $in: [false, null] };
            voucherFilter.$or = [
                { 'termsAndConditions.audienceLocation.type': 'country', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.country, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'region', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.region, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'city', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(user.data.city, 'i') } },
                { 'termsAndConditions.audienceLocation': { $exists: false } }
            ];
            break;

        default:
            // In case of admin
            break;
    }
    return { voucherFilter, user };
}