const Ad = require("./ads.model");

// Create methods
const create = async (data) => {
    const newAd = await Ad.create(data);
    if (!newAd) {
        return {
            success: false,
            message: "Failed to create the ad",
            statusCode: 400,
            error: "Invalid data provided for the ad",
        };
    }

    return {
        success: true,
        message: "Ad is created successfully",
        statusCode: 201,
        data: {
            ad: newAd,
        },
    };
};

// Get methods
const isExist = async (filter, select, populate) => {
    const ad = await Ad.findOne(filter).select(select).populate(populate);
    if (!ad) {
        return {
            success: false,
            message: "Ad not found",
            statusCode: 404,
            error: "There is no ad with the provided filter options",
        };
    }

    return {
        success: true,
        message: "Ad is found",
        statusCode: 200,
        data: ad
    };
};
const getList = async (filter, select, options, populate) => {
    const [ads, totalAds] = await Promise.all([
        Ad.find(filter)
            .limit(options.limit)
            .skip(options.skip)
            .select(select)
            .sort(options.sort)
            .populate(populate),
        Ad.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalAds / options.limit);
    return { total: totalAds, totalPages, ads };
};

// Update methods
const update = async (filter, data) => {
    const result = await Ad.updateOne(filter, data)

    if (!result.modifiedCount) {
        //In case of update with the same data
        const message = result.matchedCount ? "Ad is updated successfully" : "Ad not found"
        const statusCode = result.matchedCount ? 200 : 404
        const success = result.matchedCount ? true : false

        return {
            success,
            message,
            statusCode
        }
    }
    return {
        success: true,
        message: "Ad is updated successfully",
        statusCode: 200
    }
}
const updateAndReturn = async (filter, data, select, options, populate) => {
    const result = await Ad.findOneAndUpdate(filter, data, options).select(select).populate(populate)

    if (!result) {
        return {
            success: false,
            message: "Failed to update ad",
            statusCode: 404,
            error: "Ad not found"
        }
    }
    return {
        success: true,
        message: "Ad is updated successfully",
        statusCode: 200,
        data: result
    }
}

// Delete methods
const remove = async (filter) => {
    const result = await Ad.deleteOne(filter)
    if (!result.deletedCount) {
        return {
            success: false,
            message: "Failed to delete ad",
            statusCode: 404,
            error: "Ad not found"
        }
    }
    return {
        success: true,
        message: "Ad is deleted successfully",
        statusCode: 204
    }
}

module.exports = {
    create,
    update,
    isExist,
    updateAndReturn,
    remove,
    getList
};
