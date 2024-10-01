const Vendor = require('./vendor.model');

/*
    @params filter: object
    @params update: object
    @params populate: object
    @params options: object
    @params select: string
*/

exports.findVendor = async (filter, select, populate) => {
    try {
        const vendor = await Vendor.findOne(filter).select(select).populate(populate);

        if(vendor) {
            return {
                success: true,
                statusCode: 200,
                message: 'Vendor has been found!',
                data: vendor,
                error: null
            }
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "Vendor not found",
                data: null,
                error: `There are no Vendor with this filter ${filter}!!`
            }
        }

    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
            data: null,
            error
        }
    }
};

exports.create = async (data) => {
    try {
        const vendor = await Vendor.create(data);

        return {
            success: true,
            statusCode: 201,
            message: "Vendor has been created successfully",
            data: vendor,
            error: null
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
            data: null,
            error
        }
    }
};

exports.updateVendor = async (filter, update, options) => {
    try {
        const result = await Vendor.updateOne(filter, update, options);
        
        if (result.matchedCount === 1) {
            return {
                success: true,
                message: "Vendor has been updated successfully",
                statusCode: 200,
                data: null,
                error: null
            };
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "Vendor not found",
                data: null,
                error: `There are no Vendor with this filter ${filter}!!`
            }
        }
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
            data: null,
            error
        };
    }
};

exports.deleteVendor = async (filter) => {
    try {
        const result = await model.deleteOne(filter);

        if (result.deletedCount === 0) {
            return {
                success: false,
                statusCode: 404,
                message: "Vendor not found",
                data: null,
                error: `There are no Vendor with this filter ${filter}!!`
            }
        } else {
            return {
                success: true,
                statusCode: 204,
                message: "Vendor successfully deleted",
                data: null,
                error: null
            }
        }
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
            data: null,
            error
        };
    }
}

exports.findAndUpdateVendor = async (filter, update, select, populate, options) => {
    try {
        const vendor = await Vendor.findOneAndUpdate(filter, update, options).select(select).populate(populate);
        if (vendor) {
            return {
                success: true,
                statusCode: 200,
                message: "Vendor has been updated successfully",
                data: vendor,
                error: null
            };
        } else {
            return {
                success: false,
                status: 404,
                message: "No Vendor has been found",
                data: null,
                error: `There are no Vendor with this filter ${filter}!!`
            }
        }
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
            data: null,
            error
        };
    }
};
