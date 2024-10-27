const Collection = require('./collection.model');

/*
    @params filter: object
    @params update: object
    @params populate: object
    @params options: object
    @params select: string
    @params skip: number
    @params limit: number
    @params sort: string
    @params pipeline: array
*/

exports.aggregation = async(pipeline, limit) => {
    try {
        const result = await Collection.aggregate(pipeline);

        const count = result[0].totalCount.length ? result[0].totalCount[0].count : 1;

        const pages = Math.ceil(count / limit);

        return {
            success: true,
            statusCode: 200,
            message: "Collections Found",
            data: {
                collections: result[0].collections,
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
        }
    }
}

exports.getList = async (filter, select, populate, skip, limit, sort) => {
    try {
        const [ collections, collectionsCount ] = await Promise.all([
            Collection.find(filter).select(select).populate(populate).skip(skip).limit(limit).sort(sort),
            Collection.countDocuments(filter)
        ]);

        const pages = Math.ceil(collectionsCount / limit);

        return {
            success: true,
            statusCode: 200,
            message: "collections has been found!",
            data: {
                collections,
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
        const collection = await Collection.findOne(filter).select(select).populate(populate);
        if(collection) {
            return {
                success: true,
                statusCode: 200,
                message: 'Collection has been found!',
                data: collection,
                error: null
            }
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "Collection not found",
                data: null,
                error: `There are no Collection with this filter ${filter}!!`
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
        const collection = await Collection.create(data);

        return {
            success: true,
            statusCode: 201,
            message: "Collection has been created successfully",
            data: collection,
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

exports.updateCollection = async (filter, update, options) => {
    try {
        const result = await Collection.updateOne(filter, update, options);
        
        if (result.matchedCount === 1) {
            return {
                success: true,
                message: "Collection has been updated successfully",
                statusCode: 200,
                data: null,
                error: null
            };
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "Collection not found",
                data: null,
                error: `There are no Collection with this filter ${filter}!!`
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

exports.updateCollections = async (filter, update, options) => {
    try {
        const result = await Collection.updateMany(filter, update, options);
        
        if (result.matchedCount > 0) {
            return {
                success: true,
                message: "Collections has been updated successfully",
                statusCode: 200,
                data: null,
                error: null
            };
        } else {
            return {
                success: false,
                statusCode: 404,
                message: "Collections not found",
                data: null,
                error: `There are no Collections with this filter ${filter}!!`
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

exports.deleteCollection = async (filter) => {
    try {
        const result = await Collection.deleteOne(filter);

        if (result.deletedCount === 0) {
            return {
                success: false,
                statusCode: 404,
                message: "Collection not found",
                data: null,
                error: `There are no Collection with this filter ${filter}!!`
            }
        } else {
            return {
                success: true,
                statusCode: 204,
                message: "Collection successfully deleted",
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

exports.findAndUpdateCollection = async (filter, update, select, populate, options) => {
    try {
        const collection = await Collection.findOneAndUpdate(filter, update, options).select(select).populate(populate);
        if (collection) {
            return {
                success: true,
                statusCode: 200,
                message: "Collection has been updated successfully",
                data: collection,
                error: null
            };
        } else {
            return {
                success: false,
                status: 404,
                message: "No Collection has been found",
                data: null,
                error: `There are no Collection with this filter ${filter}!!`
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

exports.deleteCollections = async (filter) => {
    try {
        const result = await Collection.deleteMany(filter);

        if (result.deletedCount === 0) {
            return {
                success: false,
                statusCode: 404,
                message: "Collections not found",
                data: null,
                error: `There are no Collections with this filter ${filter}!!`
            }
        } else {
            return {
                success: true,
                statusCode: 204,
                message: "Collections successfully deleted",
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