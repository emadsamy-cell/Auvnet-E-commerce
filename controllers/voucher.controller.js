const roles = require("../enums/roles");
const voucherEnum = require("../enums/voucher");
const { paginate } = require("../utils/pagination");
const { asyncHandler } = require("../utils/asyncHandler");
const { createResponse } = require("../utils/createResponse");
const filterAndSelectManager = require("../helpers/filterAndSelectManager");
const userRepo = require("../models/user/user.repo");

const voucherRepo = require("../models/voucher/voucher.repo");

exports.create = asyncHandler(async (req, res) => {
    req.body.createdBy = req.user._id;

    const result = await voucherRepo.create(req.body);
    return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode, result.error, result.data))
});

exports.getAll = asyncHandler(async (req, res) => {
    let user = null;
    if(req.user.role === roles.USER) {
        user = await userRepo.findUser({ _id: req.user._id }, "country region city coins");
    }
    const voucherOptions = { ...req.query, role: req.user.role, userCountry: user?.data?.country, userRegion: user?.data?.region, userCity: user?.data?.city };

    const { voucherFilter } = filterAndSelectManager.filterHandler(voucherOptions);
    const { voucherSelect } = filterAndSelectManager.selectHandler(voucherOptions);

    const { page, size, sortBy, sortOrder } = req.query;

    const options = paginate(page, size);
    options["sort"] = { [sortBy]: sortOrder === "asc" ? 1 : -1 }

    const vouchers = await voucherRepo.getList(voucherFilter, voucherSelect, options);
    return res.status(200).json(createResponse(true, "Vouchers are found", 200, null, vouchers))
});

exports.getById = asyncHandler(async (req, res) => {
    let user = null;
    if(req.user.role === roles.USER) {
        user = await userRepo.findUser({ _id: req.user._id }, "country region city coins");
    }
    const voucherOptions = { role: req.user.role, voucherId: req.params.id, userCountry: user?.data?.country, userRegion: user?.data?.region, userCity: user?.data?.city };

    const { voucherFilter } = filterAndSelectManager.filterHandler(voucherOptions);

    const select = req.user.role === roles.USER ? "-usedBy -numberOfVouchers -createdBy -__v -isDeleted" : "-__v";
    const populate = req.user.role === roles.USER ?
        null : [
            { "path": "createdBy", "select": "userName email phoneNumber" },
            { "path": "usedBy", "select": "userName email phoneNumber" }
        ];

    //Check if the voucher is exist
    const result = await voucherRepo.isExist(voucherFilter, select, populate);
    return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode, result.error, result.data))
});

exports.update = asyncHandler(async (req, res) => {
    const filter = { _id: req.params.id };

    const result = await voucherRepo.updateAndReturn(filter, req.body, "-__v", { new: true }, { path: "createdBy", select: "userName email phoneNumber" });
    return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode, result.error, result.data))
});

exports.delete = asyncHandler(async (req, res) => {
    const isDeleted = req.method === "DELETE" ? true : false;
    const statusCode = isDeleted ? 204 : 200;
    const message = isDeleted ? "Voucher is deleted" : "Voucher is restored";
    const filter = { _id: req.params.id };

    const result = await voucherRepo.update(filter, { isDeleted });
    if (!result.success) {
        return res.status(result.statusCode).json(createResponse(result.success, result.message, result.statusCode, result.error))
    }

    return res.status(statusCode).json(createResponse(result.success, message, statusCode))
});

exports.claim = asyncHandler(async (req, res) => {
    const user = await userRepo.findUser({ _id: req.user._id }, "country region city voucherClaimed coins");
    const voucherOptions = { role: req.user.role, voucherId: req.params.id, userCountry: user?.data?.country, userRegion: user?.data?.region, userCity: user?.data?.city };

    const { voucherFilter } = filterAndSelectManager.filterHandler(voucherOptions);

    //Check if user isn't claiming a voucher now.
    if (user.data.voucherClaimed) {
        return res.status(400).json(createResponse(false, "You are already claiming a voucher", 400))
    }

    //Check if the voucher is exist
    const voucher = await voucherRepo.isExist(voucherFilter, { usedBy: { $elemMatch: { $eq: req.user._id } }, numberOfVouchers: 1, termsAndConditions: 1, status: 1, expireAt: 1 });
    if (!voucher.success) {
        return res.status(voucher.statusCode).json(createResponse(voucher.success, voucher.message, voucher.statusCode, voucher.error))
    }

    const { numberOfVouchers, usedBy, termsAndConditions, status, expireAt } = voucher.data;

    //If the voucher is not active (expired, used)
    if (status !== voucherEnum.voucherStatus.ACTIVE) {
        return res.status(400).json(createResponse(false, `Voucher is ${status}`, 400))
    }

    //If the voucher is expired
    if (new Date() > new Date(expireAt)) {
        return res.status(400).json(createResponse(false, "Voucher is expired", 400))
    }

    //If user has already redeemed the voucher
    if (usedBy.length) {
        return res.status(400).json(createResponse(false, "You have redeemed this voucher before", 400))
    }

    //If number of vouchers is zero
    if (numberOfVouchers != null && !numberOfVouchers) {
        return res.status(400).json(createResponse(false, "Voucher has exceeded the usage limit", 400))
    }

    //If user has not enough coins
    if (termsAndConditions.minCoins && user.data.coins < termsAndConditions.minCoins) {
        return res.status(400).json(createResponse(false, "You don\'t have enough coins to claim this voucher", 400))
    }

    //Update the user's claimed voucher
    const claimed = await userRepo.updateUser({ _id: req.user._id, voucherClaimed: null }, { voucherClaimed: req.params.id });
    if (!claimed.success) {
        return res.status(400).json(createResponse(false, "You are already claiming a voucher", 400))
    }

    return res.status(200).json(createResponse(true, "Voucher is claimed", 200))
});

exports.redeem = asyncHandler(async (req, res) => {
    //Check if user has claimed a voucher
    const user = await userRepo.findUser({ _id: req.user._id, voucherClaimed: req.params.id }, "voucherClaimed");
    if (!user.success) {
        return res.status(400).json(createResponse(false, "You have not claimed this voucher", 400))
    }

    //Check if the voucher is exist
    const voucher = await voucherRepo.isExist(
        { _id: user.data.voucherClaimed, isDeleted: false },
        "status numberOfVouchers expireAt");
    if (!voucher.success) {
        return res.status(voucher.statusCode).json(createResponse(voucher.success, voucher.message, voucher.statusCode, voucher.error))
    }

    const { status, numberOfVouchers, expireAt } = voucher.data;

    //If the voucher is not active (expired, used)
    if (status !== voucherEnum.voucherStatus.ACTIVE) {
        return res.status(400).json(createResponse(false, `Voucher is ${status}`, 400))
    }

    //If the voucher is expired
    if (new Date() > new Date(expireAt)) {
        return res.status(400).json(createResponse(false, "Voucher is expired", 400))
    }

    //If number of vouchers is provided
    if (numberOfVouchers != null) {
        if (numberOfVouchers === 0)
            return res.status(400).json(createResponse(false, "Voucher has exceeded the usage limit", 400));

        else if (numberOfVouchers === 1) {
            await voucherRepo.remove({ _id: user.data.voucherClaimed });
        }
        else {
            await voucherRepo.update({ _id: user.data.voucherClaimed }, { $push: { usedBy: req.user._id }, numberOfVouchers: numberOfVouchers - 1 });
        }
    }
    //If number of vouchers is not provided
    else {
        await voucherRepo.update({ _id: user.data.voucherClaimed }, { $push: { usedBy: req.user._id } });
    }

    //Update user
    await userRepo.updateUser({ _id: req.user._id, voucherClaimed: req.params.id }, { voucherClaimed: null });

    return res.status(200).json(createResponse(true, "Voucher is redeemed", 200));
});
