const Category = require('./category.model');

/*
    @params filter: object
    @params update: object
    @params populate: object
    @params options: object
    @params select: string
    @params skip: number
    @params limit: number
    @params sort: string
*/

exports.getList = async (filter, select, populate, skip, limit, sort) => {
    try {
        const [ categories, categoriesCount ] = await Promise.all([
            Category.find(filter).select(select).populate(populate).skip(skip).limit(limit).sort(sort),
            Category.countDocuments(filter)
        ]);

        const pages = Math.ceil(categoriesCount / limit);

        return {
            success: true,
            statusCode: 200,
            message: "Categories has been found!",
            data: {
                categories,
                pages
            },
            error: null
        };
        
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

exports.isExist = async (filter, select, populate) => {
    try {
        const category = await Category.findOne(filter).select(select).populate(populate);
        if(category) {
            return {
                success: true,
                statusCode: 200,
                message: 'Category has been found!',
                data: category,
                error: null
            }
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "Category not found",
                data: null,
                error: `There are no Category with this filter ${filter}!!`
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
        const category = await Category.create(data);

        return {
            success: true,
            statusCode: 201,
            message: "Category has been created successfully",
            data: category,
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

exports.updateCategory = async (filter, update, options) => {
    try {
        const result = await Category.updateOne(filter, update, options);
        
        if (result.matchedCount === 1) {
            return {
                success: true,
                message: "Category has been updated successfully",
                statusCode: 200,
                data: null,
                error: null
            };
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "Category not found",
                data: null,
                error: `There are no Category with this filter ${filter}!!`
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

exports.updateCategories = async (filter, update, options) => {
    try {
        const result = await Category.updateMany(filter, update, options);
        
        if (result.matchedCount > 0) {
            return {
                success: true,
                message: "Category has been updated successfully",
                statusCode: 200,
                data: null,
                error: null
            };
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "Category not found",
                data: null,
                error: `There are no Category with this filter ${filter}!!`
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

exports.deleteCategory = async (filter) => {
    try {
        const result = await Category.deleteOne(filter);

        if (result.deletedCount === 0) {
            return {
                success: false,
                statusCode: 404,
                message: "Category not found",
                data: null,
                error: `There are no Category with this filter ${filter}!!`
            }
        } else {
            return {
                success: true,
                statusCode: 204,
                message: "Category successfully deleted",
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

exports.findAndUpdateCategory = async (filter, update, select, populate, options) => {
    try {
        const category = await Category.findOneAndUpdate(filter, update, options).select(select).populate(populate);
        if (category) {
            return {
                success: true,
                statusCode: 200,
                message: "Category has been updated successfully",
                data: category,
                error: null
            };
        } else {
            return {
                success: false,
                status: 404,
                message: "No Category has been found",
                data: null,
                error: `There are no Category with this filter ${filter}!!`
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

exports.deleteCategories = async (filter) => {
    try {
        const result = await Category.deleteMany(filter);

        if (result.deletedCount === 0) {
            return {
                success: false,
                statusCode: 404,
                message: "Category not found",
                data: null,
                error: `There are no Category with this filter ${filter}!!`
            }
        } else {
            return {
                success: true,
                statusCode: 204,
                message: "Category successfully deleted",
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