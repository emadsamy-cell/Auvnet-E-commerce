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
} = require('../Data');

describe('___ Create Coupon___', () => {
    it('should return 401 if no authenticated user attempts to access the endpoint', async () => {
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
            console.log("token ===========>", validMasterToken)
            const response = await request(app)
                .get('/v1/coupon')
                .set('Authorization', `Bearer ${validMasterToken}`);
            console.log(response.body)
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