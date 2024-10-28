const request = require('supertest');
const app = require('../../app');
const data = require('../Data');
const { status } = require('../../enums/ads');

describe('____Create Ad____', () => {
    // 1. Test: Unauthenticated User
    it('should return status 401 when unauthenticated user tries to access this endpoint', async () => {
        const res = await request(app)
            .post('/v1/ad')
            .send(data.adData);

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Invalid Authorization Token !');
    });

    // 2. Test: Unauthorized User (Vendor)
    it('should return status 403 when unauthorized vendor tries to access this endpoint', async () => {
        const res = await request(app)
            .post('/v1/ad')
            .set('Authorization', `Bearer ${data.validVendorToken}`)
            .send(data.adData);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe('Not allowed to perform this action !');
    });

    // 3. Test: Unauthorized User (Admin)
    it('should return status 403 when unauthorized admin tries to access this endpoint', async () => {
        const res = await request(app)
            .post('/v1/ad')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send(data.adData);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe('Not allowed to perform this action !');
    });

    // 4. Test: Start Date in the Past
    it('should return status 400 when start date is in the past', async () => {
        const adDataWithPastStartDate = { ...data.adData, startDate: data.invalidStartDate };

        const res = await request(app)
            .post('/v1/ad')
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(adDataWithPastStartDate);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('validation error');
        expect(res.body.error[0].message).toEqual('Start date cannot be in the past');
    });

    // 5. Test: End Date is Before Start Date
    it('should return status 400 when end date is before start date', async () => {
        const adDataWithEndDateBeforeStart = { ...data.adData, endDate: new Date(data.adData.startDate - 23 * 60 * 60 * 1000) };

        const res = await request(app)
            .post('/v1/ad')
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(adDataWithEndDateBeforeStart);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('validation error');
        expect(res.body.error[0].message).toEqual('End date should be greater than the start date');
    });

    // 6. Test: Target Audience with Invalid Type
    it('should return status 400 when target audience has invalid type', async () => {
        const adDataWithInvalidAudience = {
            ...data.adData,
            targetAudience: [{ type: 'invalidType', location: 'Unknown' }]
        };

        const res = await request(app)
            .post('/v1/ad')
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(adDataWithInvalidAudience);

        expect(res.statusCode).toEqual(400);
        expect(res.body.error[0].message).toEqual('Audience location type must be one of region, country, or city.');
    });

    // 7. Test: Success - Start Date is Today (Status should be Active)
    // it('should create ad successfully with active status if start date is today', async () => {
    //     const adDataWithTodayStart = {
    //         ...data.adData,
    //         startDate: Date.now()
    //     };

    //     const res = await request(app)
    //         .post('/v1/ad')
    //         .set('Authorization', `Bearer ${data.validMasterToken}`)
    //         .send(adDataWithTodayStart);

    //     expect(res.statusCode).toEqual(201);
    //     expect(res.body.data.ad.status).toBe(status.ACTIVE);
    // });

    // 8. Test: Success - Start Date in Future (Status should be Upcoming)
    it('should create ad successfully with upcoming status if start date is in future', async () => {
        const res = await request(app)
            .post('/v1/ad')
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(data.adData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.data.ad.status).toBe(status.UPCOMING);
        expect(res.body.data.ad).toHaveProperty('createdBy');
        data.adId = res.body.data.ad._id;
    });
});

describe('____Get Ads____', () => {
    it('should return 401 for unauthenticated user', async () => {
        const response = await request(app).get('/v1/ad');

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid Authorization Token !');
    });

    it('should return 403 for unauthorized admin', async () => {
        const response = await request(app)
            .get('/v1/ad')
            .set('Authorization', `Bearer ${data.validAdminToken}`);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Not allowed to perform this action !'); // Adjust based on your implementation
    });

    it('should return 403 for unauthorized vendor', async () => {
        const response = await request(app)
            .get('/v1/ad')
            .set('Authorization', `Bearer ${data.validVendorToken}`);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Not allowed to perform this action !');
    });

    it('should return filtered ads for user role', async () => {
        const response = await request(app)
            .get('/v1/ad')
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.data.ads)).toBe(true);
        expect(response.body.data.ads.length).toBe(data.expectedAdsForUser);
    });

    it('should return all ads for master role', async () => {
        const response = await request(app)
            .get('/v1/ad')
            .set('Authorization', `Bearer ${data.validMasterToken}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.data.ads)).toBe(true);
        expect(response.body.data.ads.length).toBe(data.totalAds);
    });
});

describe('____Update Ad____', () => {
    // 1. Test: Unauthenticated User
    it('should return 401 when unauthenticated user tries to update ad', async () => {
        const response = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .send(data.adData);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid Authorization Token !');
    });

    // 2. Test: Unauthorized User
    it('should return 403 when unauthorized user tries to update ad', async () => {
        const response = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validUserToken}`)
            .send(data.adData);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Not allowed to perform this action !');
    });

    // 3. Test: Unauthorized Vendor
    it('should return 403 when unauthorized vendor tries to update ad', async () => {
        const response = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validVendorToken}`)
            .send(data.adData);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Not allowed to perform this action !');
    });

    // 4. Test: Invalid Ad ID
    it('should return 404 when authorized master tries to update un-exist ad', async () => {
        const response = await request(app)
            .patch(`/v1/ad/${data.invalidAdId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(data.adData);

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Ad not found');
    });

    // 5. Test: Start Date in the Past
    it('should return status 400 when master tries to update start date which is in the past', async () => {
        const adDataWithPastStartDate = { startDate: data.invalidStartDate };

        const res = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(adDataWithPastStartDate);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('validation error');
        expect(res.body.error[0].message).toEqual('Start date cannot be in the past');
    });

    // 6. Test: Target Audience with Invalid Type
    it('should return status 400 when target audience has invalid type', async () => {
        const adDataWithInvalidAudience = {
            targetAudience: [{ type: 'invalidType', location: 'Unknown' }]
        };

        const res = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(adDataWithInvalidAudience);

        expect(res.statusCode).toEqual(400);
        expect(res.body.error[0].message).toEqual('Audience location type must be one of region, country, or city.');
    });

    // 7. Test: Invalid Status
    it('should return status 400 when status has invalid value', async () => {
        const res = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send({ status: data.invalidStatus });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("validation error");
        expect(res.body.error[0].message).toEqual(`Status must be either ${status.ACTIVE} or ${status.UPCOMING} or ${status.EXPIRED}.`);
    });

    // 8. Test: Success - Update Title and Description
    it('should update ad successfully with valid data', async () => {
        const res = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send({ title: data.updateTitle, description: data.updateDescription });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.title).toEqual(data.updateTitle);
        expect(res.body.data.description).toEqual(data.updateDescription);
    });

    // 9. Test: Success - Start Date is Today (Status should be Active)
    it('should update ad successfully with active status if start date is today', async () => {
        const adDataWithTodayStart = {
            startDate: Date.now()
        };

        const res = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(adDataWithTodayStart);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toBe(status.ACTIVE);
    });

    // 10. Test: Success - Start Date in Future (Status should be Upcoming)
    it('should update ad successfully with upcoming status if start date is in future', async () => {
        const adDataWithFutureStart = {
            startDate: Date.now() + 24 * 60 * 60 * 1000
        };

        const res = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send(adDataWithFutureStart);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toBe(status.UPCOMING);
        expect(res.body.data).toHaveProperty('createdBy');
    });

    // 11. Test: Success - Update Status
    it('should update ad successfully with valid status', async () => {
        const res = await request(app)
            .patch(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`)
            .send({ status: data.updatedStatus });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual(data.updatedStatus);
    });
});

describe('____Delete Ad____', () => {
    it('should return 401 when unauthenticated user tries to delete ad', async () => {
        const response = await request(app).delete(`/v1/ad/${data.adId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid Authorization Token !');
    });

    it('should return 403 when unauthorized user tries to delete ad', async () => {
        const response = await request(app)
            .delete(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Not allowed to perform this action !');
    });

    it('should return 403 when unauthorized vendor tries to delete ad', async () => {
        const response = await request(app)
            .delete(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validVendorToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Not allowed to perform this action !');
    });

    it('should return 404 when authorized master tries to delete un-exist ad', async () => {
        const response = await request(app)
            .delete(`/v1/ad/${data.invalidAdId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Ad not found');
    });

    it('should return 204 when authorized master deletes ad', async () => {
        const response = await request(app)
            .delete(`/v1/ad/${data.adId}`)
            .set('Authorization', `Bearer ${data.validMasterToken}`);

        expect(response.statusCode).toBe(204);
    });
});