const Review = require('./review.model');

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
    const [ reviews, reviewCount ] = await Promise.all([
        Review.find(filter).select(select).populate(populate).skip(skip).limit(limit).sort(sort),
        Review.countDocuments(filter)
    ]);

    const pages = Math.ceil(reviewCount / limit);

    return {
        success: true,
        statusCode: 200,
        message: "Reviews has been found!",
        data: {
            reviews,
            pages
        },
        error: null
    };
}

exports.isExist = async (filter, select, populate) => {
    const review = await Review.findOne(filter).select(select).populate(populate);
    if(review) {
        return {
            success: true,
            statusCode: 200,
            message: 'Review has been found!',
            data: review,
            error: null
        }
    } else {
        return {
            success: false,
            statusCode: 404,
            message: "Review not found",
            data: null,
            error: `There are no review with this filter`
        }
    }
};

exports.create = async (data) => {
    const review = await Review.create(data);

    return {
        success: true,
        statusCode: 201,
        message: "review has been created successfully",
        data: review,
        error: null
    };
};

exports.updateReview = async (filter, update, options) => {
    const result = await Review.updateOne(filter, update, options);
    
    if (result.matchedCount === 1) {
        return {
            success: true,
            message: "Review has been updated successfully",
            statusCode: 200,
            data: null,
            error: null
        };
    } else {
        return {
            success: false,
            statusCode: 404,
            message: "Review not found",
            data: null,
            error: `There are no review with this filter`
        }
    }
};

exports.deleteReview = async (filter) => {
    const result = await Review.deleteOne(filter);

    if (result.deletedCount === 0) {
        return {
            success: false,
            statusCode: 404,
            message: "Review not found",
            data: null,
            error: `There are no review with this filter`
        }
    } else {
        return {
            success: true,
            statusCode: 204,
            message: "Review successfully deleted",
            data: null,
            error: null
        }
    }
}

exports.findAndUpdateReview = async (filter, update, select, populate, options) => {
    const review = await Review.findOneAndUpdate(filter, update, options).select(select).populate(populate);
    if (review) {
        return {
            success: true,
            statusCode: 200,
            message: "Review has been updated successfully",
            data: review,
            error: null
        };
    } else {
        return {
            success: false,
            statusCode: 404,
            message: "No review has been found",
            data: null,
            error: `There are no review with this filter`
        }
    }
};

exports.deleteReviews = async (filter) => {
    const result = await Review.deleteMany(filter);

    if (result.deletedCount === 0) {
        return {
            success: false,
            statusCode: 404,
            message: "Review not found",
            data: null,
            error: `There are no review with this filter`
        }
    } else {
        return {
            success: true,
            statusCode: 204,
            message: "Review successfully deleted",
            data: null,
            error: null
        }
    }
}

exports.createMany = async (arrayOfData) => {
    const review = await Review.insertMany(arrayOfData);

    return {
        success: true,
        statusCode: 201,
        message: "reviews has been created successfully",
        data: review,
        error: null
    };
};