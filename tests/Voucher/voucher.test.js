const request = require('supertest');
const app = require('../../app');
const data = require('../Data');

describe('___ Create Voucher___', () => {
    //1. Test Case: Unauthenticated user should not be able to create a voucher
    it('should return status 401 if no authenticated user attempts to access the endpoint', async () => {
        const response = await request(app).post('/v1/voucher')
            .send(data.voucherData);

        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("Invalid Authorization Token !");
    });

    //2. Test Case: Unauthorized user should not be able to create a voucher
    it('should return 403 if not authorized user', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validUserToken}`).send(data.voucherData);

        expect(response.status).toBe(403);
        expect(response.body.message).toEqual("Not allowed to perform this action !");
    });

    //3. Test Case: Validation error should be returned if no body is sent
    it('should return 400 if no body is sent', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
    });

    //4. Test Case: Validation error should be returned if expiration date is in the past
    it('should return 400 if expiration date is in the past', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                ...data.voucherData,
                expireAt: new Date(Date.now() - 1000).toISOString(), // Past date
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
        expect(response.body.error).toEqual(expect.arrayContaining([
            expect.objectContaining({ path: "expireAt", message: "Expiration date must be in the future." })
        ]));
    });

    //5. Test Case: Validation error should be returned if number of vouchers is less than 0
    it('should return 400 if number of vouchers less than 0', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                ...data.voucherData,
                numberOfVouchers: -1,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
<<<<<<< HEAD
        expect(response.body.error[0]).toHaveProperty('message', 'Number of vouchers must be greater than or equal to 0.');
=======
        expect(response.body.error[0]).toHaveProperty('message', 'Number of vouchers must be greater than or equal to 1.');
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
    });

    //6. Test Case: Validation error should be returned if offer type is written with invalid format
    it('should return 400 if offer type is written with invalid format', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                ...data.voucherData,
                offerType: "diScount",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
        expect(response.body.error[0]).toHaveProperty('message', 'Offer type must be either coins or discount or subscription.');
    });

    //7. Test Case: Validation error should be returned if offer value is less than 0
    it('should return 400 if offer value less than 0', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                ...data.voucherData,
                offerValue: -1,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
        expect(response.body.error[0]).toHaveProperty('message', 'offerValue must be greater than or equal to 0');
    });

    //8. Test Case: Validation error should be returned if code is written with invalid format
    it('should return 400 if code is written with invalid format', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                ...data.voucherData,
                code: "$$SPOTIFY",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "validation error");
        expect(response.body.error[0]).toHaveProperty('message', 'Voucher code must be alphanumeric.');
    });

    //9. Test Case: Should return 201 and create voucher on success
    it('should return 201 and create voucher on success', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send(data.voucherData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Voucher is created successfully'); // Adjust based on your success message
    });

    //10. Test Case: Should return 409 if voucher code is duplicated
    it('should return 409 if voucher code is duplicated', async () => {
        const response = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send(data.voucherData);

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', "code already exists. Please choose a different one.");
    });

});

describe('___ Read Vouchers___', () => {
    // 1. Test case for unauthenticated access
    it('should return 401 for unauthenticated users', async () => {
        const response = await request(app).get('/v1/voucher');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2. User scenario
    describe('User Scenario', () => {
        it('should return status 200 with vouchers for a valid user', async () => {
            const response = await request(app)
                .get('/v1/voucher')
                .set('Authorization', `Bearer ${data.validUserToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data.vouchers)).toBe(true);
            expect(response.body.data.total).toBe(data.expectedVoucherCountForUser);
        });
    });

    // 3. Admin scenario
    describe('Admin Scenario', () => {
        it('should return all vouchers for admin and match count', async () => {
            const response = await request(app)
                .get('/v1/voucher')
                .set('Authorization', `Bearer ${data.validAdminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data.vouchers)).toBe(true);
            expect(response.body.data.total).toBe(data.expectedVoucherCountForAdmin);
        });
    });

    // 4. Vendor Scenario
    describe('Vendor Scenario', () => {
        it('should return 403 when vendors try to access this endpoint', async () => {
            const response = await request(app)
                .get('/v1/voucher')
                .set('Authorization', `Bearer ${data.validVendorToken}`);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Not allowed to perform this action !');
        });
    });
});

describe('___GET A VOUCHER___', () => {
    // 1) Unauthenticated User
    it('should return 401 for unauthenticated user', async () => {
        const res = await request(app)
            .get(`/v1/voucher/${data.validVoucherId}`);

        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // should return 403 if vendor try to access this endpoint
    it('should return 403 for unauthorized user', async () => {
        const res = await request(app)
            .get(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validVendorToken}`);

        expect(res.status).toEqual(403);
        expect(res.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 2) User Scenario
    describe('___User Scenario___', () => {
        // 2.1) Voucher does not exist
        it('should return 404 when voucher does not exist', async () => {
            const res = await request(app)
                .get(`/v1/voucher/${data.notValidVoucherId}`)
                .set('Authorization', `Bearer ${data.validUserToken}`);

            expect(res.status).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Voucher not found');
        });

        // 2.2) Voucher not valid for user (targeted but not matching user location)
        it('should return 404 when voucher is not valid for user', async () => {
            const res = await request(app)
                .get(`/v1/voucher/${data.unOwnedVoucherId}`)
                .set('Authorization', `Bearer ${data.validUserToken}`);

            expect(res.status).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Voucher not found');
        });

        // 2.3) Voucher valid for user (targeted and matches user location) but is deleted
        it('should return 404 when voucher is valid for user but is deleted', async () => {
            const res = await request(app)
                .get(`/v1/voucher/${data.deletedVoucherId}`)
                .set('Authorization', `Bearer ${data.validUserToken}`);

            expect(res.status).toEqual(404);
            expect(res.body.success).toBe(false);
            expect(res.body).toHaveProperty('message', 'Voucher not found');
        });

        // 2.4) Voucher valid for user and not deleted
        it('should return 200 when voucher is valid for user and not deleted', async () => {
            const res = await request(app)
                .get(`/v1/voucher/${data.validVoucherId}`)
                .set('Authorization', `Bearer ${data.validUserToken}`);

            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(data.validVoucherId);
        });
    });

    // 3) Admin Scenario
    describe('Admin Scenario', () => {
        // 3.1) Voucher does not exist
        it('should return 404 when voucher does not exist', async () => {
            const res = await request(app)
                .get(`/v1/voucher/${data.notValidVoucherId}`)
                .set('Authorization', `Bearer ${data.validAdminToken}`);

            expect(res.status).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Voucher not found');
        });

        // 3.2) Voucher exists
        it('should return 200 and voucher details when admin searches for existed voucher', async () => {
            const res = await request(app)
                .get(`/v1/voucher/${data.validVoucherId}`)
                .set('Authorization', `Bearer ${data.validAdminToken}`);

            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(data.validVoucherId);
        });

        // 3.3) Voucher exists 
        it('should return 200 and voucher details when admin searches for existed voucher even if it is deleted', async () => {
            const res = await request(app)
                .get(`/v1/voucher/${data.unOwnedVoucherId}`)
                .set('Authorization', `Bearer ${data.validAdminToken}`);

            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(data.unOwnedVoucherId);
        });

        // 3.4) Voucher exists even if it is deleted
        it('should return 200 and voucher details when admin searches for existed voucher even if it is deleted', async () => {
            const res = await request(app)
                .get(`/v1/voucher/${data.deletedVoucherId}`)
                .set('Authorization', `Bearer ${data.validAdminToken}`);

            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toEqual(data.deletedVoucherId);
        });
    });

});

describe('___ Update a VOUCHER ____', () => {
    // 1) Unauthenticated user
    it('should return status 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.validVoucherId}`)
            .send({ offerValue: 10 });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) Not authorized user
    it('should return status 403 if the user tries to access this endpoint', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validUserToken}`)
            .send({ offerValue: 10 });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 3) Not authorized user
    it('should return status 403 if the vendor tries to access this endpoint', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validVendorToken}`)
            .send({ offerValue: 10 });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 4) Admin tries to update not exist voucher
    it('should return status 404 when admin tries to update non-exist voucher', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.notValidVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                offerValue: 25
            });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body).toHaveProperty('error', 'Voucher not found');

    });

    // 5) Admin tries to exist voucher
    it('should return 200 when admin tries to update exist voucher', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                offerValue: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('offerValue', 10);
    });

    // 6) Admin tries to exist voucher by existing code
    it('should return 409 when admin tries to update exist voucher', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.deletedVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                code: data.existVoucherCode
            });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    });
});

describe('___Delete A Voucher___', () => {
    // 1) Unauthenticated user
    it('should return status 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .delete(`/v1/voucher/${data.validVoucherId}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) Unauthorized user
    it('should return status 403 if the user tries to delete the voucher', async () => {
        const response = await request(app)
            .delete(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 3) Unauthorized vendor
    it('should return status 403 if a vendor tries to delete the voucher', async () => {
        const response = await request(app)
            .delete(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validVendorToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 4) Admin deletes non-exist voucher
    it('should return status 404 when admin tries to delete non exist voucher', async () => {
        const deleteResponse = await request(app)
            .delete(`/v1/voucher/${data.notValidVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(deleteResponse.status).toBe(404);
    });

    // 5) Admin tries to delete valid voucher
    it('should return status 204 when admin tries to delete a valid voucher', async () => {
        const response = await request(app)
            .delete(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(response.status).toBe(204);

        
        // Check if the voucher is marked as deleted by retrieving it
        const deletedResponse = await request(app)
            .get(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(deletedResponse.status).toBe(200);
        expect(deletedResponse.body.data.isDeleted).toBe(true);
    });
});

describe('___Restore A Voucher___', () => {
    // 1) Unauthenticated user
    it('should return status 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.validVoucherId}/restore`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) Unauthorized user
    it('should return status 403 if the user tries to restore the voucher', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.validVoucherId}/restore`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 3) Unauthorized vendor
    it('should return status 403 if a vendor tries to restore the voucher', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.validVoucherId}/restore`)
            .set('Authorization', `Bearer ${data.validVendorToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 4) Admin deletes non-exist voucher
    it('should return status 404 when admin tries to restore non exist voucher', async () => {
        const deleteResponse = await request(app)
            .patch(`/v1/voucher/${data.notValidVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(deleteResponse.status).toBe(404);
    });

    // 5) Admin tries to restore valid voucher
    it('should return status 200 when admin tries to restore a valid voucher', async () => {
        const response = await request(app)
            .patch(`/v1/voucher/${data.validVoucherId}/restore`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(response.status).toBe(200);
        
        // Check if the voucher is marked as deleted by retrieving it
        const deletedResponse = await request(app)
            .get(`/v1/voucher/${data.validVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(deletedResponse.status).toBe(200);
        expect(deletedResponse.body.data.isDeleted).toBe(false);
    });
});

describe('___Claim A Voucher___', () => {
    // 1) Unauthenticated user
    it('should return status 401 when unauthenticated user tries to access this endpoint', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.validVoucherId}/claim`)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) Unauthorized user
    it('should return status 403 when vendor tries to access this endpoint', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.validVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validVendorToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 3) Unauthorized user
    it('should return status 403 when admin tries to access this endpoint', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.validVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 4) User is claiming un-exist voucher
    it('should return status 404 when user tries to claim a non-exist voucher', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.notValidVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);
<<<<<<< HEAD
        
=======

>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Voucher not found');
    });

    // 5) User is claiming a voucher that is not valid for him
    it('should return status 404 when user tries to claim a voucher that is not valid for him', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.unOwnedVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Voucher not found');
    });

    // 6) User is claiming an owned but deleted voucher
    it('should return status 404 when user tries to claim a deleted voucher', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.deletedVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Voucher not found');
    });

    // 7) User is claiming an owned voucher but its status is expired
    it('should return status 400 when user tries to claim an expired voucher', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.expiredVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Voucher is expired');
    });

    // 8) User is claiming an owned voucher but its status is used
    it('should return status 400 when user tries to claim an used voucher', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.usedVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Voucher is used');
    });

    // 9) User is claiming an owned but finished voucher
    it('should return status 400 when user tries to claim a finished voucher', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.finishedVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Voucher has exceeded the usage limit');
    });

    // 10) User is claiming a voucher but not have enough coins
    it('should return status 400 when user tries to claim a voucher but not have enough coins', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.notEnoughCoinsVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'You don\'t have enough coins to claim this voucher');
    });

    // 11) User is claiming a voucher successfully
    it('should return status 200 when user tries to claim a voucher successfully', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.globalVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Voucher is claimed');
    });

    // 12) User is claiming a voucher but he is already claiming a one.
    it('should return status 400 when user tries to claim a voucher but he is claiming another voucher now', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.validVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'You are already claiming a voucher');
    });

    // 13) User is claiming a voucher but he has claimed it before
    it('should return status 400 when user tries to claim a voucher but he has claimed it before', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.claimedVoucherId}/claim`)
            .set('Authorization', `Bearer ${data.anotherUserToken}`);

        expect(response.status).toBe(400);
<<<<<<< HEAD
        expect(response.body).toHaveProperty('message', 'You have claimed this voucher before');
=======
        expect(response.body).toHaveProperty('message', 'You have redeemed this voucher before');
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
    });
});

describe('___Redeem A Voucher___', () => {
     // 1) Unauthenticated user
     it('should return status 401 when unauthenticated user tries to access this endpoint', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.validVoucherId}/redeem`)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid Authorization Token !');
    });

    // 2) Unauthorized user
    it('should return status 403 when vendor tries to access this endpoint', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.validVoucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validVendorToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 3) Unauthorized user
    it('should return status 403 when admin tries to access this endpoint', async () => {
        const response = await request(app)
            .post(`/v1/voucher/${data.validVoucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Not allowed to perform this action !');
    });

    // 5) User is redeeming an owned voucher but not the one he claimed
    it('should return status 400 when user tries to redeem a voucher that he did not claim', async () => {
        //Last claimed voucher for this user is globalVoucherId
        const response = await request(app)
            .post(`/v1/voucher/${data.validVoucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'You have not claimed this voucher');
    });

    // 6) User is redeeming claimed but deleted voucher
    it('should return status 404 when user tries to redeem a deleted voucher', async () => {
        // Make the last claimed voucher deleted
        await request(app)
            .delete(`/v1/voucher/${data.globalVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        const response = await request(app)
            .post(`/v1/voucher/${data.globalVoucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Voucher not found');
    });

    // 7) User is redeeming claimed but expired voucher
    it('should return status 400 when user tries to redeem an expired voucher', async () => {
        // Restore the last claimed voucher
        await request(app)
            .patch(`/v1/voucher/${data.globalVoucherId}/restore`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        // Make the last claimed voucher expired
        await request(app)
            .patch(`/v1/voucher/${data.globalVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({ status: 'expired' });

        const response = await request(app)
            .post(`/v1/voucher/${data.globalVoucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Voucher is expired');
    });

    // 8) User is redeeming claimed but used voucher
    it('should return status 400 when user tries to redeem a used voucher', async () => {
        // Make the last claimed voucher used
        await request(app)
            .patch(`/v1/voucher/${data.globalVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({ status: 'used' });

        const response = await request(app)
            .post(`/v1/voucher/${data.globalVoucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Voucher is used');
    });

    // 9) User is redeeming claimed voucher successfully
    it('should return status 200 when user tries to redeem a claimed voucher successfully', async () => {
        // Make the last claimed voucher used
        await request(app)
            .patch(`/v1/voucher/${data.globalVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`)
<<<<<<< HEAD
            .send({ status: status.INACTIVE });
=======
            .send({ status: 'active' });
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9

        // Redeem the voucher (globalVoucherId)
        const response = await request(app)
            .post(`/v1/voucher/${data.globalVoucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Voucher is redeemed');

        await request(app)
            .patch(`/v1/voucher/${data.globalVoucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({ usedBy: [] });
    });

    // 10) User is redeeming voucher which has only one remain.
    it('should return status 200 when user tries to redeem a voucher which has only one remain', async () => {
        // Create one-time used voucher.
        const result = await request(app)
            .post('/v1/voucher')
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({
                ...data.voucherData,
                code: 'ONE2TIME',
                numberOfVouchers: 1,
            });

        expect(result.status).toBe(201);

        const voucherId = result.body.data.voucher._id;

        // Claim the voucher
        const claimResponse = await request(app)
            .post(`/v1/voucher/${voucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);
        
        expect(claimResponse.status).toBe(200);

        // Redeem the voucher
        const response = await request(app)
            .post(`/v1/voucher/${voucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Voucher is redeemed');

        // Check if the voucher is removed automatically after being redeemed completely
        const getResponse = await request(app)
            .get(`/v1/voucher/${voucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(getResponse.status).toBe(404);
        expect(getResponse.body).toHaveProperty('message', 'Voucher not found');
    });

    // 11) User is redeeming voucher which is limited but has many remains.
    it('should return status 200 when user tries to redeem a voucher which has many remains', async () => {
        const voucherId = data.manyVouchersId;

        // Claim the voucher
        const claimResponse = await request(app)
            .post(`/v1/voucher/${voucherId}/claim`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(claimResponse.status).toBe(200);

        // Redeem the voucher
        const response = await request(app)
            .post(`/v1/voucher/${voucherId}/redeem`)
            .set('Authorization', `Bearer ${data.validUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Voucher is redeemed');

        // Check if the voucher is updated correctly after being redeemed
        const getResponse = await request(app)
            .get(`/v1/voucher/${voucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.data.numberOfVouchers).toBe(1);
<<<<<<< HEAD
        expect(getResponse.body.data.usedBy[0]).toEqual(data.validUserId);
=======
        expect(getResponse.body.data.usedBy[0]._id).toEqual(data.validUserId);
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9

        // Reset the voucher
        await request(app)
            .patch(`/v1/voucher/${voucherId}`)
            .set('Authorization', `Bearer ${data.validAdminToken}`)
            .send({ usedBy: [], numberOfVouchers: 2 });
    });
});