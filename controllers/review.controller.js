const reviewRepo = require('../models/review/review.repo');
const productRepo = require('../models/product/product.repo');
const { filterHandler, selectHandler } = require('../helpers/filterAndSelectManager');
const { paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');
const roles = require('../enums/roles')

exports.get = asyncHandler(async (req, res) => {
    const { limit, skip } = paginate(req.query.page * 1, req.query.size * 1);
    const { role } = req.user;
    const { productID } = req.params;  
    const { reviewFilter, vendorFilter, userFilter } = filterHandler({ role, ...req.query, productID });
    const { reviewSelect, vendorSelect, userSelect } = selectHandler({ role });

    const result = await reviewRepo.getList(
        reviewFilter,
        reviewSelect,
        [
            { path: 'author', select: userSelect, match: userFilter },
            { path: 'replies.vendor', select: vendorSelect, match: vendorFilter },
            { path: 'replies.user', select: userSelect, match: userFilter }
        ],
        skip,
        limit,
        { isVerified: -1, voteCount: -1, createdAt: -1 }
    );

    return res.status(result.statusCode).json(
        createResponse(result.success, result.message, result.statusCode, result.error, result.data)
    )
});

exports.create = asyncHandler(async (req, res) => {
    const { productID } = req.params;
    const reviewExist = await reviewRepo.isExist({ product: productID, author: req.user._id, isDeleted: false }, "_id");

    // Check if the user has already reviewed the product
    if (reviewExist.success) {
        return res.status(409).json(
            createResponse(false, 'You have already reviewed this product before.', 409)
        )
    }

    // Update product rating
    const rating = req.body.rating * 1;
    updateProductRating(productID, rating, 1);
    
    // TODO: Check if the user purchase the product to be verified
    
    // Create New Review
    const reviewData = {
        ...req.body,
        author: req.user._id,
        product: productID
    };
    const review = await reviewRepo.create(reviewData);

    return res.status(review.statusCode).json(
        createResponse(review.success, review.message, review.statusCode, review.error , review.data)
    )
});

exports.reply = asyncHandler(async (req, res) => {
    const { reviewID } = req.params;
    const { message } = req.body;
    const { role, _id } = req.user;

    const reply = {
        message,
        ...(role === roles.VENDOR ? { vendor: _id } : { user: _id }),
    }

    const result = await reviewRepo.updateReview(
        { _id: reviewID, isDeleted: false },
        { $push: { replies: reply } }
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, result.message, result.statusCode, result.error)
        )
    }

    return res.status(result.statusCode).json(
        createResponse(result.success, "Reply has been added successfully", result.statusCode, result.error, result.data)
    );
});

exports.update = asyncHandler(async (req, res) => {
    const { reviewID } = req.params;
    let reviewExist = await reviewRepo.isExist({ _id: reviewID, isDeleted: false }, "author createdAt rating product");

    if (!reviewExist.success) {
        return res.status(reviewExist.statusCode).json(
            createResponse(reviewExist.success, reviewExist.message, reviewExist.statusCode, reviewExist.error)
        )
    }

    // Check if the user is the author of the review
    if (reviewExist.data.author.toString() !== req.user._id) {
        return res.status(403).json(
            createResponse(false, 'You are not authorized to update this review', 403)
        )
    }

    // Check if the review reached the time limit
    const lockDate = new Date(reviewExist.data.createdAt);
    lockDate.setMonth(lockDate.getMonth() + 1);
    if (lockDate <= Date.now()) {
        return res.status(403).json(
            createResponse(false, 'You can not update this review after a month', 403)
        )
    }

    // Update product rating
    const oldRating = reviewExist.data.rating;
    const newRating = req.body.rating;
    const difference = (newRating ? newRating - oldRating : 0);
    if (difference) {
        updateProductRating(reviewExist.data.product, difference, 0);
    } 

    // Update Review
    const review = await reviewRepo.updateReview(
        { _id: reviewID },
        req.body
    );
    
    return res.status(review.statusCode).json(
        createResponse(review.success, review.message, review.statusCode, review.error, review.data)
    )
});

exports.upVote = asyncHandler(async (req, res) => {
    const { reviewID } = req.params;

    const review = await reviewRepo.findAndUpdateReview(
        { _id: reviewID, isDeleted: false },
        { 
            $addToSet: { upVotes: req.user._id }, 
            $pull: { downVotes: req.user._id } 
        },
        "upVotes downVotes",
        null,
        { new: true }
    )

    if (!review.success) {
        return res.status(review.statusCode).json(
            createResponse(review.success, review.message, review.statusCode, review.error)
        )
    }

    const upVoteCount = review.data.upVotes.length;
    const downVoteCount = review.data.downVotes.length;

    await reviewRepo.updateReview(
        { _id: reviewID },
        { voteCount: upVoteCount - downVoteCount }
    );

    review.data.voteCount = upVoteCount - downVoteCount;

    return res.status(review.statusCode).json(
        createResponse(review.success, "Thank you for your feedback", review.statusCode, review.error, review.data)
    )
});

exports.downVote = asyncHandler(async (req, res) => {
    const { reviewID } = req.params;

    const review = await reviewRepo.findAndUpdateReview(
        { _id: reviewID, isDeleted: false },
        { 
            $pull: { upVotes: req.user._id },
            $addToSet: { downVotes: req.user._id }, 
        },
        "upVotes downVotes",
        null,
        { new: true }
    )

    if (!review.success) {
        return res.status(review.statusCode).json(
            createResponse(review.success, review.message, review.statusCode, review.error)
        )
    }

    const upVoteCount = review.data.upVotes.length;
    const downVoteCount = review.data.downVotes.length;

    await reviewRepo.updateReview(
        { _id: reviewID },
        { voteCount: upVoteCount - downVoteCount }
    );

    review.data.voteCount = upVoteCount - downVoteCount;

    return res.status(review.statusCode).json(
        createResponse(review.success, "Thank you for your feedback", review.statusCode, review.error, review.data)
    )
});

exports.deleteVote = asyncHandler(async (req, res) => {
    const { reviewID } = req.params;

    const review = await reviewRepo.findAndUpdateReview(
        { _id: reviewID, isDeleted: false },
        { 
            $pull: { upVotes: req.user._id },
            $pull: { downVotes: req.user._id }, 
        },
        "upVotes downVotes",
        null,
        { new: true }
    )

    if (!review.success) {
        return res.status(review.statusCode).json(
            createResponse(review.success, review.message, review.statusCode, review.error)
        )
    }

    const upVoteCount = review.data.upVotes.length;
    const downVoteCount = review.data.downVotes.length;

    await reviewRepo.updateReview(
        { _id: reviewID },
        { voteCount: upVoteCount - downVoteCount }
    );

    review.data.voteCount = upVoteCount - downVoteCount;

    return res.status(review.statusCode).json(
        createResponse(review.success, "Vote has been deleted successfully", review.statusCode, review.error, review.data)
    )
});

exports.delete = asyncHandler(async (req, res) => {
    const { reviewID } = req.params;
    let reviewExist = await reviewRepo.isExist({ _id: reviewID, isDeleted: false }, "author createdAt rating product");

    if (!reviewExist.success) {
        return res.status(reviewExist.statusCode).json(
            createResponse(reviewExist.success, reviewExist.message, reviewExist.statusCode, reviewExist.error)
        )
    }

    // Check if the user is the author of the review
    if (req.user.role === roles.USER && reviewExist.data.author.toString() !== req.user._id) {
        return res.status(403).json(
            createResponse(false, 'You are not authorized to delete this review', 403)
        )
    }

    // Check if the review reached the time limit
    const lockDate = new Date(reviewExist.data.createdAt);
    lockDate.setMonth(lockDate.getMonth() + 1);
    if (req.user.role === roles.USER && lockDate <= Date.now()) {
        return res.status(403).json(
            createResponse(false, 'You can not delete this review after a month', 403)
        )
    }

    // Update product rating
    const oldRating = reviewExist.data.rating;
    updateProductRating(reviewExist.data.product, -oldRating, -1);

    // Delete Review
    const review = await reviewRepo.updateReview(
        { _id: reviewID },
        { isDeleted: true }
    );
    return res.status(review.statusCode).json(
        createResponse(review.success, "Review has been deleted successfully", review.statusCode, review.error, review.data)
    )
});

const updateProductRating = (productID, rating, isNew) => {
    productRepo.findAndUpdateProduct(
        { _id: productID },
        [
            {
              $set: {
                totalRating: { $add: ["$totalRating", rating] },
                totalReviews: { $add: ["$totalReviews", isNew] },
                averageRating: {
                  $cond: {
                    if : { $eq: [{ $add: ["$totalReviews", isNew] }, 0] },
                    then: 0,
                    else: {
                      $divide: [
                        { $add: ["$totalRating", rating] },
                        { $add: ["$totalReviews", isNew] }
                      ]
                    }
                  }
                }
              }
            }
        ],
        { _id: 1 }
    );
};