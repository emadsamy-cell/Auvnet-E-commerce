const request = require('supertest');
const app = require('../../app'); // Adjust according to your app file
const {
    validMasterToken,
    invalidToken,
    couponBody,
    vendorId,
    validUserToken,
    validVendorToken,
    validUserTargetCoupon,
    globalCoupon,
    validVendorCoupon,
    inValidVendorCoupon,
    invalidUserTargetCoupon,
    userCredentials,
    adminCouponId,
    vendorCredentials,
    anotherVendorCoupon,
    expiredCouponId,
    usedCouponId,
    finishedCouponId,
    validCouponId,
} = require('../Data');

describe('___ Create Coupon___', () => {
    it('should return status 401 if no authenticated user attempts to access the endpoint', async () => {
        const response = await request(app).post('/v1/coupon')
        .send(couponBody);

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("Invalid Authorization Token !");
    });

    it('should return 403 if not authorized user', async () => {
        const response = await request(app)
            .post('/v1/coupon')
            .set('Authorization', `Bearer ${validUserToken}`).send(couponBody);
        expect(response.status).toBe(403);
        expect(response.body.message).toEqual("Not allowed to perform this action !");
    });

    it('should return 400 if no body is sent', async () => {
        const response = await request(app)
            .post('/v1/coupon')
            .set('Authorization', `Bearer ${validMasterToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
    });

    it('should return 400 if both discount value and discount percent are provided', async () => {
        const response = await request(app)
            .post('/v1/coupon')
            .set('Authorization', `Bearer ${validMasterToken}`)
            .send({
                ...couponBody,
                discountValue: 10,
                discountPercent: 20,
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
        expect(response.body.error).toEqual(expect.arrayContaining([
            expect.objectContaining({ message: "Either discount value or discount percent must be provided." })
        ]));
    });

    it('should return 400 if expiration date is in the past', async () => {
        const response = await request(app)
            .post('/v1/coupon')
            .set('Authorization', `Bearer ${validMasterToken}`)
            .send({
                ...couponBody,
                expireAt: new Date(Date.now() - 1000).toISOString(), // Past date
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
        expect(response.body.error).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: "expireAt", message: "Expiration date must be in the future." })
        ]));
    });

    it('should return 400 if couponUsage count is provided for unlimited usage', async () => {
        const response = await request(app)
            .post('/v1/coupon')
            .set('Authorization', `Bearer ${validMasterToken}`)
            .send({
                ...couponBody,
                couponUsage: {
                    type: "unlimited",
                    count: 100,
                },
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
        expect(response.body.error).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: "couponUsage", message: "Usage count for coupon cannot be provided for UNLIMITED usage type." })
        ]));
    });

    it('should return 400 if products array is empty', async () => {
        const response = await request(app)
            .post('/v1/coupon')
            .set('Authorization', `Bearer ${validMasterToken}`)
            .send({
                ...couponBody,
                products: [],
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
        expect(response.body.error).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: "products", message: "Products array cannot be empty if provided." })
        ]));
    });

    it('should return 201 and create coupon on success', async () => {
        const response = await request(app)
            .post('/v1/coupon')
            .set('Authorization', `Bearer ${validMasterToken}`)
            .send(couponBody);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Coupon is created successfully'); // Adjust based on your success message
    });

    it('should return 409 if coupon is duplicated', async () => {
        const response = await request(app)
            .post('/v1/coupon')
            .set('Authorization', `Bearer ${validMasterToken}`)
            .send(couponBody);
        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', "code already exists. Please choose a different one.");
    });
});

describe('___ Read Coupons___', () => {
    // 1. Test case for unauthenticated access
    it('should return 401 for unauthenticated users', async () => {
        const response = await request(app).get('/v1/coupon'); 
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2. User scenario
    describe('User Scenario', () => {
        it('should return status 200 with coupons for a valid user', async () => {
            const response = await request(app)
                .get('/v1/coupon')
                .set('Authorization', `Bearer ${validUserToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data'); 
            expect(Array.isArray(response.body.data.coupons)).toBe(true); 
        });
    });

    // 3. Vendor scenario
    describe('Vendor Scenario', () => {
        it('should return coupons for a valid vendor and match vendor ID', async () => {
            const response = await request(app)
                .get('/v1/coupon')
                .set('Authorization', `Bearer ${validVendorToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data.coupons)).toBe(true);

            // Ensure all returned coupons belong to the vendor
            response.body.data.coupons.forEach(coupon => {
                expect(coupon.vendor.toString()).toBe(vendorId.toString());
            });
        });
    });

    // 4. Admin scenario
    describe('Admin Scenario', () => {
        it('should return all coupons for admin and match count', async () => {
            const response = await request(app)
                .get('/v1/coupon')
                .set('Authorization', `Bearer ${validMasterToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data.coupons)).toBe(true);

            // Ensure the returned coupons count matches expected count
            const expectedCouponCount = 20; // Replace with the actual expected count
            expect(response.body.data.total).toBe(expectedCouponCount);
        });
    });
});

const generateRandomId = "66fc561edcbf215e8bfb22fd";

describe('___GET A COUPON___', () => {

    // 1) Unauthenticated User
    it('should return 401 for unauthenticated user', async () => {
        const res = await request(app)
            .get(`/v1/coupon/${validUserTargetCoupon}`);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) User Scenario
    describe('___User Scenario___', () => {

        // 2.1) Coupon does not exist
        it('should return 404 when coupon does not exist', async () => {
            const randomId = generateRandomId;
            const res = await request(app)
                .get(`/v1/coupon/${randomId}`)
                .set('Authorization', `Bearer ${validUserToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Coupon not found');
        });

        // 2.2) Coupon not valid for user (targeted but not matching user location)
        it('should return 404 when coupon is targeted but not valid for user', async () => {
            const res = await request(app)
                .get(`/v1/coupon/${invalidUserTargetCoupon}`)
                .set('Authorization', `Bearer ${validUserToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Coupon not found');
        });

        // 2.3) Coupon valid for user (targeted and matches user location)
        it('should return 200 and coupon details when coupon is valid for user', async () => {
            const res = await request(app)
                .get(`/v1/coupon/${validUserTargetCoupon}`)
                .set('Authorization', `Bearer ${validUserToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(validUserTargetCoupon);
        });

        // 2.4) Global coupon (valid for everyone)
        it('should return 200 and coupon details when coupon is global', async () => {
            const res = await request(app)
                .get(`/v1/coupon/${globalCoupon}`)
                .set('Authorization', `Bearer ${validUserToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(globalCoupon);
        });
    });

    // 3) Vendor Scenario
    describe('Vendor Scenario', () => {

        // 3.1) Coupon does not exist
        it('should return 404 when coupon does not exist for vendor', async () => {
            const randomId = generateRandomId;
            const res = await request(app)
                .get(`/v1/coupon/${randomId}`)
                .set('Authorization', `Bearer ${validVendorToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Coupon not found');
        });

        // 3.2) Coupon does not belong to vendor
        it('should return 404 when coupon does not belong to the vendor', async () => {
            const res = await request(app)
                .get(`/v1/coupon/${inValidVendorCoupon}`)
                .set('Authorization', `Bearer ${validVendorToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Coupon not found');
        });

        // 3.3) Coupon belongs to vendor
        it('should return 200 and coupon details when coupon belongs to the vendor', async () => {
            const res = await request(app)
                .get(`/v1/coupon/${validVendorCoupon}`)
                .set('Authorization', `Bearer ${validVendorToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(validVendorCoupon);
        });
    });

    // 4) Admin Scenario
    describe('Admin Scenario', () => {

        // 4.1) Coupon does not exist
        it('should return 404 when coupon does not exist for admin', async () => {
            const randomId = generateRandomId;
            const res = await request(app)
                .get(`/v1/coupon/${randomId}`)
                .set('Authorization', `Bearer ${validMasterToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Coupon not found');
        });

        // 4.2) Global coupon (admin access)
        it('should return 200 and coupon details when admin searches for global coupon', async () => {
            const res = await request(app)
                .get(`/v1/coupon/${globalCoupon}`)
                .set('Authorization', `Bearer ${validMasterToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(globalCoupon);
        });

        // 4.3) Targeted coupon (admin access)
        it('should return 200 and coupon details when admin searches for targeted coupon', async () => {
            const res = await request(app)
                .get(`/v1/coupon/${validUserTargetCoupon}`)
                .set('Authorization', `Bearer ${validMasterToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(validUserTargetCoupon);
        });
    });

});

describe('___ Update a Coupon ____', () => {

    // 1) Unauthenticated user
    it('should return status 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${adminCouponId}`)
            .send({ discountValue: 10 });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) Not authorized user
    it('should return status 403 if the user is unauthorized to update the coupon', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${adminCouponId}`)
            .set('Authorization', `Bearer ${validUserToken}`)
            .send({ discountValue: 10 });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 3) Vendor with owned coupon, trying to update discountValue and discountPercent together
    it('should return status 400 if vendor tries to update discountValue and discountPercent together', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`)
            .send({
                discountValue: 10,
                discountPercent: 20
            });

        expect(response.status).toBe(400);
        expect(response.body.error[0].message).toBe('Either discount value or discount percent can be provided.');
    });

    // 4) Vendor with owned coupon, trying to update expireAt with past date
    it('should return status 400 if vendor tries to update coupon expireAt with a past date', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`)
            .send({
                expireAt: '2020-01-01'
            });

        expect(response.status).toBe(400);
        expect(response.body.error[0].message).toBe('Expiration date must be in the future.');
    });

    // 5) Vendor with owned coupon, setting couponUsage to unlimited but providing count
    it('should return status 400 if vendor sets couponUsage to unlimited but provides a count', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`)
            .send({
                couponUsage: {
                    type: 'unlimited',
                    count: 100
                }
            });

        expect(response.status).toBe(400);
        expect(response.body.error[0].message).toBe('Usage count for coupon cannot be provided for UNLIMITED usage type.');
    });

    // 6) Vendor updates with valid coupon data
    it('should update coupon successfully for the vendor', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`)
            .send({ ...couponBody, code: "UpdatedCode" });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Coupon is updated successfully');
        expect(response.body.data).toHaveProperty('code', 'UpdatedCode');
    });

    // 7) Vendor tries to update another vendor's coupon
    it('should return status 404 if vendor tries to update a coupon that does not belong to them', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${anotherVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`)
            .send({
                discountValue: 15
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Coupon not found');
    });

    // 8) Admin tries to update vendor's coupon
    it('should return status 404 when admin tries to update a vendor’s coupon', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validMasterToken}`)
            .send({
                discountValue: 25
            });
        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body).toHaveProperty('error', 'Coupon not found');

    });

    // 9) Admin tries to update their own coupon
    it('should allow admin to update their own coupon', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${adminCouponId}`)
            .set('Authorization', `Bearer ${validMasterToken}`)
            .send({
                discountPercent: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('discountPercent', 10);
    });
});

describe('___Delete A Coupon___', () => {
    // 1) Unauthenticated user
    it('should return status 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .delete(`/v1/coupon/${validVendorCoupon}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) Unauthorized user
    it('should return status 403 if the user is unauthorized to delete the coupon', async () => {
        const response = await request(app)
            .delete(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validUserToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 3) Vendor tries to delete another vendor's coupon
    it('should return status 403 if a vendor tries to delete another vendor\'s coupon', async () => {
        const response = await request(app)
            .delete(`/v1/coupon/${anotherVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'You aren\'t authorized to access this coupon');
    });

    // 4) Vendor deletes their own coupon, and checks if it's marked as deleted
    it('should return status 204 when vendor tries to delete their own coupon and mark it as deleted', async () => {
        // Vendor deletes their own coupon
        const deleteResponse = await request(app)
            .delete(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`);

        expect(deleteResponse.status).toBe(204);

        // Check if the coupon is marked as deleted by retrieving it
        const getResponse = await request(app)
            .get(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.data.isDeleted).toBe(true);
    });

    // 5) Admin tries to delete vendor's coupon
    it('should return status 204 when admin tries to delete a vendor’s coupon', async () => {
        const response = await request(app)
            .delete(`/v1/coupon/${anotherVendorCoupon}`)
            .set('Authorization', `Bearer ${validMasterToken}`);

        expect(response.status).toBe(204);
    });

    // 6) Admin tries to delete their own coupon
    it('should return status 204 when admin tries to delete their own coupon', async () => {
        const response = await request(app)
            .delete(`/v1/coupon/${adminCouponId}`)
            .set('Authorization', `Bearer ${validMasterToken}`);

        expect(response.status).toBe(204);
    });
});

describe('___Restore A Coupon___', () => {
    // 1) Unauthenticated user
    it('should return status 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${validVendorCoupon}/restore`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) Unauthorized user
    it('should return status 403 if the user is unauthorized to restore the coupon', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${validVendorCoupon}/restore`)
            .set('Authorization', `Bearer ${validUserToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 3) Vendor tries to restore another vendor's coupon
    it('should return status 403 if a vendor tries to restore another vendor\'s coupon', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${anotherVendorCoupon}/restore`)
            .set('Authorization', `Bearer ${validVendorToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'You aren\'t authorized to access this coupon');
    });

    // 4) Vendor restores their own coupon and checks if it is no longer marked as deleted
    it('should return status 200 when vendor tries to restore their own coupon and unmark it as deleted', async () => {
        // Vendor restores their own coupon
        const restoreResponse = await request(app)
            .patch(`/v1/coupon/${validVendorCoupon}/restore`)
            .set('Authorization', `Bearer ${validVendorToken}`);

        expect(restoreResponse.status).toBe(200);

        // Check if the coupon is no longer marked as deleted by retrieving it
        const getResponse = await request(app)
            .get(`/v1/coupon/${validVendorCoupon}`)
            .set('Authorization', `Bearer ${validVendorToken}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.data.isDeleted).toBe(false);
    });

    // 5) Admin tries to restore a vendor's coupon
    it('should return status 200 when admin tries to restore a vendor’s coupon', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${anotherVendorCoupon}/restore`)
            .set('Authorization', `Bearer ${validMasterToken}`);

        expect(response.status).toBe(200);
    });

    // 6) Admin tries to restore their own coupon
    it('should return status 200 when admin tries to restore their own coupon', async () => {
        const response = await request(app)
            .patch(`/v1/coupon/${adminCouponId}/restore`)
            .set('Authorization', `Bearer ${validMasterToken}`);

        expect(response.status).toBe(200);
    });
});


describe('___Claim A Coupon___', () => {
    const randomCouponId = '66fedfe25a0f834d9fbe82fb'; // Use a valid random ID format for MongoDB

    // 1) Claim a coupon not exist (random ID)
    it('should return status 404 when trying to claim a non-existent coupon', async () => {
        const response = await request(app)
            .post(`/v1/coupon/${randomCouponId}/claim`)
            .set('Authorization', `Bearer ${validUserToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Coupon not found');
    });

    // 2) Claim an expired coupon
    it('should return status 400 when trying to claim an expired coupon', async () => {
        const response = await request(app)
            .post(`/v1/coupon/${expiredCouponId}/claim`)
            .set('Authorization', `Bearer ${validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Coupon is expired');
    });

    // 3) Claim a finished coupon (all uses have been used)
    it('should return status 400 when trying to claim a finished coupon', async () => {
        const response = await request(app)
            .post(`/v1/coupon/${finishedCouponId}/claim`)
            .set('Authorization', `Bearer ${validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Coupon has exceeded the usage limit');
    });

    // 4) Claim a coupon where user has already reached their usage limit
    it('should return status 400 when user tries to claim a coupon after reaching the usage limit', async () => {
        const response = await request(app)
            .post(`/v1/coupon/${usedCouponId}/claim`)
            .set('Authorization', `Bearer ${validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'You have exceeded the user usage limit');
    });

    // 5) Claim a valid coupon successfully
    it('should return status 200 when a user successfully claims a valid coupon', async () => {
        const response = await request(app)
            .post(`/v1/coupon/${validCouponId}/claim`)
            .set('Authorization', `Bearer ${validUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Coupon is claimed');
    });

    // 6) Claim a valid coupon again, but should return an error for claiming another coupon
    it('should return status 400 if the user tries to claim another coupon while already claiming one', async () => {
        const response = await request(app)
            .post(`/v1/coupon/${validCouponId}/claim`)
            .set('Authorization', `Bearer ${validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'You are already claiming a coupon');
    });
});