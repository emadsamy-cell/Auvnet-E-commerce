const ObjectId = require('mongoose').Types.ObjectId;

exports.inValidToken = "Bearer inValidToken";
exports.adminToken;
exports.superAdminToken;
exports.vendorToken;
exports.userToken;
exports.validReviewID = "671e2b43a557c41f68efc5aa"
exports.invalidReviewID = "123";
exports.incorrectReviewID = "671e2b43a557c41f68efc511"
exports.validUserID = "12345616f138d890379fb060";
exports.tempValidUserID = "82345616f138d890379fb060"
exports.validVendorID = "12115616f138d890379fb061";
exports.validProductID = "670a64344a723992dd4ec2ea";
exports.inValidProductID = "Invalid Product ID";
exports.oldReviewID = "12345716f138d890379fb060"
exports.reviews = [
    {
        "_id": new ObjectId("12345716f138d890379fb060"),
        "title" : "Review 1",
        "description": "very bad, its the worse!!!",
        "rating": 1,
        "product": new ObjectId(this.validProductID),
        "author": new ObjectId(this.validUserID),
        "isVerified": true,
        "createdAt": new Date("2021-09-01T00:00:00.000Z"),
    },
    {
        "_id": new ObjectId("12315716f138d890379fb060"),
        "title" : "Broken",
        "description": "I don't like this product, Don't buy!!!",
        "rating": 2,
        "product": new ObjectId(this.validProductID),
        "author": new ObjectId(this.validUserID),
        "isVerified": false
    },
    {
        "_id": new ObjectId("32315716f138d890379fb060"),
        "title" : "Good but ..",
        "description": "The product is good but, it broke after 10 years :(",
        "rating": 3,
        "product": new ObjectId(this.validProductID),
        "author": new ObjectId(this.validUserID),
        "isVerified": true,
        "createdAt": new Date("2021-09-01T00:00:00.000Z"),
    },
    {
        "_id": new ObjectId("22315716f138d890379fb060"),
        "title" : "Very Good",
        "description": "Guys, this product is the best. I love it.",
        "rating": 4,
        "product": new ObjectId(this.validProductID),
        "author": new ObjectId(this.validUserID),
        "isVerified": false
    },
    {
        "_id": new ObjectId("21315716f138d890379fb060"),
        "title" : "Perfect",
        "description": "Just buy it",
        "rating": 5,
        "product": new ObjectId(this.validProductID),
        "author": new ObjectId(this.validUserID),
        "isVerified": true,
        "createdAt": new Date("2021-09-01T00:00:00.000Z"),
    },
]

// _______________________________________________Validation_______________________________________________
exports.inValidQueryPage = {
    page: -1
}

exports.inValidQuerySize = {
    size: -1
}

exports.inValidQueryVerified = {
    isVerified: "invalid"
}

exports.inValidQueryFilterByStar = {
    filterByStart: 1.2
}

exports.inValidQuerySearch = {
    search: null
}

// _______________________________________________GET_______________________________________________
exports.getVerifiedReviews = {
    page: 1,
    size: 5,
    isVerified: true
}

exports.getUnverifiedReviews = {
    page: 1,
    size: 5,
    isVerified: false
}

exports.getReviewsBySearch = {
    page: 1,
    size: 5,
    search: "bRokE"
}

exports.getReviewsOneStar = {
    page: 1,
    size: 5,
    filterByStar: 1
}

exports.getReviewsTwoStar = {
    page: 1,
    size: 5,
    filterByStar: 2
}

exports.getReviewsThreeStar = {
    page: 1,
    size: 5,
    filterByStar: 3
}

exports.getReviewsFourStar = {
    page: 1,
    size: 5,
    filterByStar: 4
}

exports.getReviewsFiveStar = {
    page: 1,
    size: 5,
    filterByStar: 5
}
// _______________________________________________Create_______________________________________________
exports.createReview = {
    title: "Very Good",
    description: "I love this product, it's the best",
    rating: 5
}

exports.createReviewNoTitle = {
    description: "I love this product, it's the best",
    rating: 5
}

exports.createReviewNoDescription = {
    title: "Very Good",
    rating: 5
}

exports.createReviewNoRating = {
    title: "Very Good",
    description: "I love this product, it's the best",
}

exports.createReviewInvalidRating = {
    title: "Very Good",
    description: "I love this product, it's the best",
    rating: 6
}

exports.createReviewInvalidRatingType = {
    title: "Very Good",
    description: "I love this product, it's the best",
    rating: 1.5
}

// _______________________________________________REPLY_______________________________________________
exports.replyReview = {
    message: "Thank you for your review, we are glad you liked our product"
}

exports.replyReviewNoMessage = {
}

// _______________________________________________UPDATE_______________________________________________
exports.updateReview = {
    title: "Very Good",
    description: "I love this product, it's the best",
    rating: 1
}

