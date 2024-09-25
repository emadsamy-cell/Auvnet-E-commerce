const User = require('./user.model');
const { hashPassword } = require('../../helpers/password.helper');

exports.isNotExist = async(filter) => {
    try {
        const user = await User.findOne({
            $or: [
                { email: filter.email },
                { username: filter.username }
            ]
        });

        if(user) {
            return {
                success: false,
                message: "This email or username already connected to an account",
                statusCode: 401
            }
        }
        else {
            return {
                success: true,
                statusCode: 200
            }
        }
    } catch (error) {
        return {
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
            error
        }
    }
}

exports.isExist = async(filter) => {
    try {
        const user = await User.findOne({
            $or: [
                { email: filter.usernameOrEmail },
                { username: filter.usernameOrEmail }
            ]
        });


        if(user) {
            return {
                success: true,
                data: user,
                statusCode: 200,
            }
        }
        else {
            return {
                success: false,
                statusCode: 401,
                message: "Invalid credentials",
                error: "can't find user with this ID !!"
            }
        }
    } catch (error) {
        return {
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
            error
        }
    }
}

exports.createUser = async (data) => {
    try {
        const user = await User.create(data);
        return {
            success: true,
            statusCode: 201,
            message: "User has been created Successfully",
            data:user
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Internal Server Error",
            error
        }
    }
};

exports.getUser= async(filter) => {
    try {
        const user = await User.findOne(filter);

        if (!user) {
            return {
                success: false,
                message: "No user has been found",
                statusCode: 401,
            };
        } else {
            return {
                success: true,
                message: "User has been found",
                statusCode: 200,
                data: user
            };
        }

    } catch (error) {
        return {
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
            error
        };
    }
};

exports.findAndUpdate = async (filter, update, options) => {
    try {
        const user = await User.findOneAndUpdate(filter, update, options);
        if (user) {
            return {
                success: true,
                message: "user has been updated successfully",
                statusCode: 200,
                data: user
            };
        } else {
            return {
                success: false,
                message: "No user has been found",
                status: 300,
                error: "no user with this email"
            }
        }
    } catch (error) {
        return {
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
            error
        };
    }
}

