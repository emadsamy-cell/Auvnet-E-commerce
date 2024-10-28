const adEnum = require("../enums/ads");
const { paginate } = require("../utils/pagination");
const { asyncHandler } = require("../utils/asyncHandler");
const { createResponse } = require("../utils/createResponse");
const filterAndSelectManager = require("../helpers/filterAndSelectManager");
const roles = require("../enums/roles");

const adRepo = require("../models/ads/ads.repo");
const userRepo = require("../models/user/user.repo");


exports.create = asyncHandler(async (req, res) => {
    if (req.files?.images) req.body.images = req.files.images.map(image => image.destination + image.filename);
    if (req.files?.video) req.body.video = req.files.video[0].destination + req.files.video[0].filename;
    req.body.status = new Date(req.body.startDate) > Date.now() ? adEnum.status.UPCOMING : adEnum.status.ACTIVE;
    req.body.createdBy = req.user._id;

    const newAd = await adRepo.create(req.body);

    return res.status(201).json(createResponse(true, "Ad created successfully", 201, null, newAd.data));
});

exports.getAll = asyncHandler(async (req, res) => {
    let user = null;
    if (req.user.role === roles.USER) {
        user = await userRepo.findUser({ _id: req.user._id }, "country region city");
    }
    const adsOptions = { ...req.query, role: req.user.role, userCountry: user?.data?.country, userRegion: user?.data?.region, userCity: user?.data?.city };

    const { adFilter } = filterAndSelectManager.filterHandler(adsOptions);
    const { adSelect } = filterAndSelectManager.selectHandler(adsOptions);

    const { page, size, sortBy, sortOrder } = req.query;

    const options = paginate(page, size);
    options["sort"] = { [sortBy]: sortOrder === "asc" ? 1 : -1, createdAt: -1 };

    const ads = await adRepo.getList(adFilter, adSelect, options);
    return res.status(200).json(createResponse(true, "Ads are found", 200, null, ads))
});

exports.update = asyncHandler(async (req, res) => {
    if (req.files?.images) req.body.images = req.files.images.map(image => image.destination + image.filename);
    if (req.files?.video) req.body.video = req.files.video[0].destination + req.files.video[0].filename;
    if (req.body.startDate && req.body.status !== adEnum.status.EXPIRED) req.body.status = new Date(req.body.startDate) > Date.now() ? adEnum.status.UPCOMING : adEnum.status.ACTIVE;

    const result = await adRepo.updateAndReturn({_id: req.params.id}, req.body, "", { new: true });
    if (!result.success)
        return res.status(result.statusCode).json(createResponse(false, result.message, result.statusCode, result.error));

    return res.status(200).json(createResponse(true, result.message, result.statusCode, null, result.data));
});

exports.delete = asyncHandler(async (req, res) => {
    const result = await adRepo.remove({ _id: req.params.id });
    if (!result.success)
        return res.status(result.statusCode).json(createResponse(false, result.message, result.statusCode, result.error));

    return res.status(204).json(createResponse(true, "Ad deleted successfully", 204));
});

