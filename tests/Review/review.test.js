const supertest = require("supertest");
const app = require("../../app");
const data = require('./review.data')
const tokenManager = require('../../helpers/tokenManager');
const productRepo = require('../../models/product/product.repo');
const reviewRepo = require('../../models/review/review.repo');
const roles = require('../../enums/roles');

beforeAll(async () => {
    jest.setTimeout(() => {}, 10000);
    data.superAdminToken = tokenManager.generateAccessToken({_id: 5, role: "superAdmin"});
    data.adminToken = tokenManager.generateAccessToken({_id: data.validUserID, role: "admin"});
    data.vendorToken = tokenManager.generateAccessToken({_id: data.validVendorID, role: "vendor"});
    data.tempUserToken = tokenManager.generateAccessToken({_id: data.tempValidUserID, role: "user"});
    data.userToken = tokenManager.generateAccessToken({_id: data.validUserID, role: "user"});
    console.log(data.adminToken)
});

beforeEach(async () => {
    try {
        await reviewRepo.deleteReviews({author: data.tempValidUserID})
        await reviewRepo.createMany(data.reviews);
    } catch (error) {
        console.error(error)
    }
})

afterEach(async () => {
    try {
        for (review of data.reviews) {
            const result = await reviewRepo.deleteReview(
                {_id: review._id}
            )
        }
    } catch (error) {
        console.error(error);
    }
});

const CheckValidReview = (reviews, query, role) => {
    for (let review of reviews) {
        if (query.isVerified) {
            expect(review.isVerified).toBe(true);
        }

        if (query.search) {
            const regex = new RegExp(query.search, 'i');
            const test = (regex.test(review.title) || regex.test(review.description));
            expect(test).toBe(true);
        }

        if (query.filterByStar) {
            expect(review.rating).toBe(query.filterByStar);
        }
    }
}    


// CRUD Operation for reviews

describe("___Get Reviews___", () => {
    // query [page, size, isVerified, search, filterByStart]
    // params [productID]
    // auth [user, vendor, admin, superAdmin]
    
    // Validation
    it("should return status 400 when page is invalid", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.inValidQueryPage)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('page')
    });

    it("should return status 400 when size is invalid", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.inValidQuerySize)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('size');
    });

    it("should return status 400 when isVerified is invalid", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.inValidQueryVerified)
            .set("Authorization", `Bearer ${data.superAdminToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('isVerified');
    });

    it("should return status 400 when search is invalid", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.inValidQuerySearch)
            .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('search');
    });

    it("should return status 400 when filterByStart is invalid", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.inValidQueryFilterByStar)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('filterByStart');
    });

    it("should return status 400 when productID is invalid", async () => {
        const response = await supertest(app).get(`/v1/review/${data.inValidProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('productID');
    });

    // Auth
    it("should return status 401 when token isn't provided", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
        .set("Authorization", `Bearer ${data.inValidToken}`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Success
    it("should return status 200 with only verified reviews", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.getVerifiedReviews)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reviews has been found!",);
        CheckValidReview(response.body.data.reviews, data.getVerifiedReviews)
    });

    it("should return status 200 with only unverified reviews", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.getUnverifiedReviews)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reviews has been found!",);
        CheckValidReview(response.body.data.reviews, data.getUnverifiedReviews)
    });

    it("should return status 200 with all reviews that match search", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.getReviewsBySearch)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reviews has been found!",);
        CheckValidReview(response.body.data.reviews, data.getReviewsBySearch)
    });

    it("should return status 200 with all reviews that has 1 start", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.getReviewsOneStar)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reviews has been found!",);
        CheckValidReview(response.body.data.reviews, data.getReviewsOneStar)
    
    });

    it("should return status 200 with all reviews that has 2 start", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.getReviewsTwoStar)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reviews has been found!",);
        CheckValidReview(response.body.data.reviews, data.getReviewsTwoStar)
    });

    it("should return status 200 with all reviews that has 3 start", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.getReviewsThreeStar)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reviews has been found!",);
        CheckValidReview(response.body.data.reviews, data.getReviewsThreeStar)
    });
    
    it("should return status 200 with all reviews that has 4 start", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.getReviewsFourStar)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reviews has been found!",);
        CheckValidReview(response.body.data.reviews, data.getReviewsFourStar)
    });
    
    it("should return status 200 with all reviews that has 5 start", async () => {
        const response = await supertest(app).get(`/v1/review/${data.validProductID}`)
            .query(data.getReviewsFiveStar)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reviews has been found!",);
        CheckValidReview(response.body.data.reviews, data.getReviewsFiveStar)
    });
});

describe("___Create Review___", () => {
    // params [productID]
    // body [title, description, rating]
    // auth [user, vendor, admin, superAdmin]
    
    // Validation
    
    it("should return status 400 when productID is invalid", async () => {
        const response = await supertest(app).post(`/v1/review/${data.inValidProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReview)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('productID');
    });

    it("should return status 400 when title is missing", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReviewNoTitle)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('title');
    });

    it("should return status 400 when description is missing", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReviewNoDescription)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('description');
    });

    it("should return status 400 when rating is missing", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReviewNoRating)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('rating');
    });

    it("should return status 400 when rating is more than 5", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReviewInvalidRating)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('rating');
    });

    it("should return status 400 when rating is invalid", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReviewInvalidRatingType)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('rating');
    });

    // Auth
    it("should return status 401 when token isn't provided", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .send(data.createReview)    

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.inValidToken}`)
            .send(data.createReview)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Vendor
    it("should return status 403 when vendor trying to create review", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.vendorToken}`)
            .send(data.createReview)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Admin
    it("should return status 403 when admin trying to create review", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.adminToken}`)
            .send(data.createReview)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Super Admin
    it("should return status 403 when superAdmin trying to create review", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.superAdminToken}`)
            .send(data.createReview)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // User 
    it("should return status 409 when user trying to create more than one review", async () => {
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReview)

        expect(response.status).toBe(409)
        expect(response.body.message).toBe('You have already reviewed this product before.');
    });

    // Success
    it("should return status 201 when user create review", async () => {
        // Get rating of the product before review
        const productBefore = await productRepo.isExist({_id: data.validProductID}, "totalReviews totalRating averageRating")
        const totalRatingBefore = productBefore.data.totalRating;
        const totalReviewsBefore = productBefore.data.totalReviews;
        
        const response = await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.tempUserToken}`)
            .send(data.createReview)

        // Get rating of the product after review
        const productAfter = await productRepo.isExist({_id: data.validProductID}, "totalReviews totalRating averageRating")
        const totalRatingAfter = productAfter.data.totalRating;
        const totalReviewsAfter = productAfter.data.totalReviews;
        const averageRatingAfter = productAfter.data.averageRating;        

        // Check if the rating changed is correct
        expect(response.status).toBe(201)
        expect(response.body.message).toBe("review has been created successfully");
        expect(totalReviewsAfter).toBe(totalReviewsBefore + 1);
        expect(totalRatingAfter).toBe(totalRatingBefore + data.createReview.rating);
        expect(averageRatingAfter.toFixed(1)).toBe((totalRatingAfter / totalReviewsAfter).toFixed(1));
    });
});

describe("___Reply Review___", () => {
    // params [reviewID]
    // body [message]
    // auth [user, vendor, admin, superAdmin]
    
    // Validation
    it("should return status 400 when reviewID is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.invalidReviewID}/reply`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.replyReview)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('reviewID');
    });

    it("should return status 400 when message is missing", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/reply`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.replyReviewNoMessage)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('message');
    });

    // Auth
    it("should return status 401 when token isn't provided", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/reply`)
            .send(data.replyReview)    

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/reply`)
            .set("Authorization", `Bearer ${data.inValidToken}`)
            .send(data.replyReview)    

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Admin
    it("should return status 403 when admin trying to reply on a review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/reply`)
            .set("Authorization", `Bearer ${data.adminToken}`)
            .send(data.replyReview)    

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Super Admin
    it("should return status 403 when superAdmin trying to reply on a review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/reply`)
            .set("Authorization", `Bearer ${data.superAdminToken}`)
            .send(data.replyReview)    

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Vendor
    it("should return status 200 when vendor replies on a review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/reply`)
            .set("Authorization", `Bearer ${data.vendorToken}`)
            .send(data.replyReview)    



        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reply has been added successfully");
    });

    // User
    it("should return status 200 when user replies on a review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/reply`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.replyReview)    

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Reply has been added successfully");
    });

    it("should return status 404 when user replies on a review not found", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}/reply`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.replyReview)    
        
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Review not found");
    });

});

describe("___Update Review___", () => {
    // params [reviewID]
    // body [title, description, rating] (optional)
    // auth [user, vendor, admin, superAdmin]
    
    // Validation
    it("should return status 400 when reviewID is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.invalidReviewID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.updateReview)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('reviewID');
    });

    it("should return status 400 when rating is more than 5", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReviewInvalidRating)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('rating');
    });

    it("should return status 400 when rating is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReviewInvalidRatingType)    

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('rating');
    });

    // Auth
    it("should return status 401 when token isn't provided", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .send(data.createReview)    

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .set("Authorization", `Bearer ${data.inValidToken}`)
            .send(data.createReview)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Vendor
    it("should return status 403 when vendor trying to update review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .set("Authorization", `Bearer ${data.vendorToken}`)
            .send(data.createReview)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Admin
    it("should return status 403 when admin trying to update review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .set("Authorization", `Bearer ${data.adminToken}`)
            .send(data.createReview)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Super Admin
    it("should return status 403 when superAdmin trying to update review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .set("Authorization", `Bearer ${data.superAdminToken}`)
            .send(data.createReview)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // User
    it("should return status 403 when not the author trying to update review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .set("Authorization", `Bearer ${data.tempUserToken}`)
            .send(data.createReview)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('You are not authorized to update this review');
    });

    it("should return status 403 when the review reach the time limit", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.oldReviewID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReview)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('You can not update this review after a month');
    });

    it("should return status 404 when the review doesn't exist", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReview)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Review not found");
    });

    // Success
    it("should return status 200 when user update review", async () => {
        // Get rating of the product before review
        const productBefore = await productRepo.isExist({_id: data.validProductID}, "totalReviews totalRating")
        const totalRatingBefore = productBefore.data.totalRating;
        const totalReviewsBefore = productBefore.data.totalReviews;
        
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.updateReview)

        // Get rating of the product after review
        const productAfter = await productRepo.isExist({_id: data.validProductID}, "totalReviews totalRating averageRating")
        const totalRatingAfter = productAfter.data.totalRating;
        const totalReviewsAfter = productAfter.data.totalReviews;
        const averageRatingAfter = productAfter.data.averageRating;        

        // Check if the rating changed is correct
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Review has been updated successfully");
        expect(totalReviewsAfter).toBe(totalReviewsBefore);
        expect(totalRatingAfter).toBe(totalRatingBefore - 4);
        expect(averageRatingAfter.toFixed(1)).toBe((totalRatingAfter / totalReviewsAfter).toFixed(1));
    });
});

describe("___Up Vote Review___", () => {
    // params [reviewID]
    // auth [user, vendor, admin, superAdmin]
    
    // Validation
    it("should return status 400 when review ID is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.invalidReviewID}/up-vote`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('reviewID');
    });

    // Auth
    it("should return status 401 when token isn't provided", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/up-vote`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/up-vote`)
            .set("Authorization", `Bearer ${data.inValidToken}`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Vendor
    it("should return status 403 when vendor trying to up-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/up-vote`)
            .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Admin
    it("should return status 403 when admin trying to up-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/up-vote`)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Super Admin
    it("should return status 403 when superAdmin trying to up-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/up-vote`)
            .set("Authorization", `Bearer ${data.superAdminToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // User
    it("should return status 404 when review not found", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}/up-vote`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Review not found");
    });

    it("should return status 200 when user up vote review", async () => {
        // Delete vote
        await supertest(app).patch(`/v1/review/${data.validReviewID}/delete-vote`)
                .set("Authorization", `Bearer ${data.userToken}`);

        // Get voteCount before
        const reviewBefore = await reviewRepo.isExist({_id: data.validReviewID}, "voteCount");

        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}/up-vote`)
                .set("Authorization", `Bearer ${data.userToken}`);
        
        // Get voteCount after
        const reviewAfter = await reviewRepo.isExist({_id: data.validReviewID}, "voteCount");
        
        // Check if it match
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Thank you for your feedback");
        expect(reviewAfter.data.voteCount).toBe(reviewBefore.data.voteCount + 1);
    });
});

describe("___Down Vote Review___", () => {
    // params [reviewID]
    // auth [user, vendor, admin, superAdmin]
    
    it("should return status 400 when review ID is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.invalidReviewID}/down-vote`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('reviewID');
    });

    // Auth
    it("should return status 401 when token isn't provided", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/down-vote`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/down-vote`)
            .set("Authorization", `Bearer ${data.inValidToken}`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Vendor
    it("should return status 403 when vendor trying to down-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/down-vote`)
            .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Admin
    it("should return status 403 when admin trying to down-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/down-vote`)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Super Admin
    it("should return status 403 when superAdmin trying to down-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/down-vote`)
            .set("Authorization", `Bearer ${data.superAdminToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // User
    it("should return status 404 when review not found", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}/down-vote`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Review not found");
    });

    it("should return status 200 when user down-vote review", async () => {
        // Delete vote
        await supertest(app).patch(`/v1/review/${data.validReviewID}/delete-vote`)
                .set("Authorization", `Bearer ${data.userToken}`);

        // Get voteCount before
        const reviewBefore = await reviewRepo.isExist({_id: data.validReviewID}, "voteCount");

        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}/down-vote`)
                .set("Authorization", `Bearer ${data.userToken}`);
        
        // Get voteCount after
        const reviewAfter = await reviewRepo.isExist({_id: data.validReviewID}, "voteCount");
        
        // Check if it match
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Vote has been deleted successfully");
        expect(reviewAfter.data.voteCount).toBe(reviewBefore.data.voteCount - 1);
    });
});

describe("___Delete Vote Review___", () => {
    // params [reviewID]
    // auth [user, vendor, admin, superAdmin]
    
    it("should return status 400 when review ID is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.invalidReviewID}/delete-vote`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('reviewID');
    });

    // Auth
    it("should return status 401 when token isn't provided", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete-vote`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete-vote`)
            .set("Authorization", `Bearer ${data.inValidToken}`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Vendor
    it("should return status 403 when vendor trying to delete-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete-vote`)
            .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Admin
    it("should return status 403 when admin trying to delete-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete-vote`)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // Super Admin
    it("should return status 403 when superAdmin trying to delete-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete-vote`)
            .set("Authorization", `Bearer ${data.superAdminToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // User
    it("should return status 404 when review not found", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}/delete-vote`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Review not found");
    });

    it("should return status 200 when user delete-vote review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}/delete-vote`)
                .set("Authorization", `Bearer ${data.userToken}`);
        
        // Check if it match
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Thank you for your feedback");
    });
});

describe("___Delete Review___", () => {
    // params [reviewID]
    // auth [user, vendor, admin, superAdmin]
    
    // Validation
    it("should return status 400 when reviewID is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.invalidReviewID}/delete`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].path).toBe('reviewID');
    });

    // Auth
    it("should return status 401 when token isn't provided", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // vendor
    it("should return status 403 when vendor trying to delete review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete`)
            .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // admin
    it("should return status 204 when admin trying to delete review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete`)
            .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(204)

        await supertest(app).post(`/v1/review/${data.validProductID}`)
            .set("Authorization", `Bearer ${data.userToken}`)
            .send(data.createReview)
    });
    
    // Super Admin
    it("should return status 204 when super admin trying to delete review", async () => {
        // Check Product rating before and after the delete
    });

    // User
    it("should return status 404 when review not found", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.incorrectReviewID}/delete`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Review not found");
    });

    it("should return status 403 when not the author of the review trying to delete review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete`)
            .set("Authorization", `Bearer ${data.tempUserToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('You are not authorized to delete this review');
    });

    it("should return status 403 when the review reaches the time limit", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.oldReviewID}/delete`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('You can not delete this review after a month');
    });

    it("should return status 200 when the author of the review trying to delete review", async () => {
        const response = await supertest(app).patch(`/v1/review/${data.validReviewID}/delete`)
            .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Review has been deleted successfully");
    });
});
