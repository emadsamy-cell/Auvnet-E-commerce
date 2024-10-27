const Voucher = require("./voucher.model");

// Create methods
const create = async (data) => {
    const newVoucher = await Voucher.create(data);
    if (!newVoucher) {
        return {
            success: false,
            message: "Failed to create the voucher",
            statusCode: 400,
            error: "Invalid data provided for the voucher",
        };
    }

    return {
        success: true,
        message: "Voucher is created successfully",
        statusCode: 201,
        data: {
            voucher: newVoucher,
        },
    };
};

// Get methods
const isExist = async (filter, select, populate) => {
    const voucher = await Voucher.findOne(filter).select(select).populate(populate);
    if (!voucher) {
        return {
            success: false,
            message: "Voucher not found",
            statusCode: 404,
            error: "There is no voucher with the provided filter options",
        };
    }

    return {
        success: true,
        message: "Voucher is found",
        statusCode: 200,
        data: voucher
    };
};
const getList = async (filter, select, options, populate) => {
    const [vouchers, totalVouchers] = await Promise.all([
        Voucher.find(filter)
            .limit(options.limit)
            .skip(options.skip)
            .select(select)
            .sort(options.sort)
            .populate(populate),
        Voucher.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalVouchers / options.limit);
    return { total: totalVouchers, totalPages, vouchers };
};

// Update methods
const update = async (filter, data) => {
    const result = await Voucher.updateOne(filter, data)

    if (!result.modifiedCount) {
        //In case of update with the same data
        const message = result.matchedCount ? "Voucher is updated successfully" : "Voucher not found"
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
        message: "Voucher is updated successfully",
        statusCode: 200
    }
}
const updateAndReturn = async (filter, data, select, options, populate) => {
    const result = await Voucher.findOneAndUpdate(filter, data, options).select(select).populate(populate)

    if (!result) {
        return {
            success: false,
            message: "Failed to update voucher",
            statusCode: 404,
            error: "Voucher not found"
        }
    }
    return {
        success: true,
        message: "Voucher is updated successfully",
        statusCode: 200,
        data: result
    }
}

// Delete methods
const remove = async (filter) => {
    const result = await Voucher.deleteOne(filter)
    if (!result.deletedCount) {
        return {
            success: false,
            message: "Failed to delete voucher",
            statusCode: 400,
            error: "Voucher not found"
        }
    }
    return {
        success: true,
        message: "Voucher is deleted successfully",
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
