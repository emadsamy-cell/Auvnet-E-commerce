const User = require('./user.model');

exports.findOne = async ({ filter = {}, populate = [], select = "" } = {}) => {
    try {
        const user = await User.findOne(filter).select(select).populate(populate);

        if(user) {
            return {
                success: true,
                statusCode: 200,
                message: 'User has been found!',
                data: user,
                error: null
            }
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "User not found",
                data: null,
                error: `There are no user with this filter ${filter}!!`
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

exports.create = async ({ data = {} } = {}) => {
    try {
        const user = await User.create(data);

        return {
            success: true,
            statusCode: 201,
            message: "User has been created successfully",
            data:user,
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

exports.updateOne = async ({ filter = {}, update = {}, options = {} } = {}) => {
    try {
        const result = await User.updateOne(filter, update, options);

        if (result.matchedCount === 1) {
            return {
                success: true,
                message: "user has been updated successfully",
                statusCode: 200,
                data: null,
                error: null
            };
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "User not found",
                data: null,
                error: `There are no user with this filter ${filter}!!`
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

exports.deleteOne = async ({ filter = {} } = {}) => {
    try {
        const result = await model.deleteOne(filter);

        if (result.deletedCount === 0) {
            return {
                success: false,
                statusCode: 404,
                message: "User not found",
                data: null,
                error: `There are no user with this filter ${filter}!!`
            }
        } else {
            return {
                success: true,
                statusCode: 204,
                message: "User successfully deleted",
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

exports.findOneAndUpdate = async ({ filter = {}, update = {}, options = {}, select = "", populate = [] } = {}) => {
    try {
        const user = await User.findOneAndUpdate(filter, update, options).select(select).populate(populate);
        if (user) {
            return {
                success: true,
                statusCode: 200,
                message: "user has been updated successfully",
                data: user,
                error: null
            };
        } else {
            return {
                success: false,
                status: 404,
                message: "No user has been found",
                data: null,
                error: `There are no user with this filter ${filter}!!`
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
