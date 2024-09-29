const app = require("../../app");
const { validNewAccountData, invalidEmail, existedAdminUserName, existedAdminEmail, validAdminToken, validSuperAdminToken, newAccountDataWithInvalidUserName, newAccountDataWithInvalidEmail, validAdminId, validMasterToken, permaSuperAdminId } = require("../Data")
const supertest = require("supertest");

describe("___Create Admin Account___", () => {
    it("should return status 403 when admin tries to create admin account", async () => {
        const response = await supertest(app).post("/v1/admin")
            .set("Authorization", `Bearer ${validAdminToken}`)
            .send(validNewAccountData);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 400 when superAdmin creates admin account with invalid email address", async () => {
        const data = { ...validNewAccountData, email: invalidEmail };
        const response = await supertest(app).post("/v1/admin")
            .set("Authorization", `Bearer ${validSuperAdminToken}`)
            .send(data);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("validation error");
        expect(response.body.error[0].message).toBe("Email must be a valid email");
    });

    it("should return status 409 when superAdmin creates admin account with exist userName", async () => {
        const data = { ...validNewAccountData, userName: existedAdminUserName };
        const response = await supertest(app).post("/v1/admin")
            .set("Authorization", `Bearer ${validSuperAdminToken}`)
            .send(data);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("userName already exists. Please choose a different one.");
    });

    it("should return status 409 when superAdmin creates admin account with exist email", async () => {
        const data = { ...validNewAccountData, email: existedAdminEmail };

        const response = await supertest(app).post("/v1/admin")
            .set("Authorization", `Bearer ${validSuperAdminToken}`)
            .send(data);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("email already exists. Please choose a different one.");
    });

    it("should return status 201 when superAdmin creates admin account with valid data", async () => {
        const response = await supertest(app).post("/v1/admin")
            .set("Authorization", `Bearer ${validSuperAdminToken}`)
            .send(validNewAccountData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Admin account created successfully");
    });

});

describe("___Get Admins___", () => {
    it("should return status 401 when unauthenticated user tries to access admins endpoint", async () => {
        const response = await supertest(app).get("/v1/admin")

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when admin tries to access admins endpoint", async () => {
        const response = await supertest(app).get("/v1/admin")
            .set("Authorization", `Bearer ${validAdminToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 200 when superAdmin gets admin account with valid data", async () => {
        const response = await supertest(app).get("/v1/admin")
            .set("Authorization", `Bearer ${validSuperAdminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Admins fetched successfully");
    });

});

describe("___Update Admin Role___", () => {
    it("should return status 401 when unauthenticated user tries to update admin role", async () => {
        const response = await supertest(app).patch(`/v1/admin/${validAdminId}/role`)
            .send({ newRole: "admin" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when admin tries to update another admin role", async () => {
        const response = await supertest(app).patch(`/v1/admin/${validAdminId}/role`)
            .set("Authorization", `Bearer ${validAdminToken}`)
            .send({ newRole: "superAdmin" });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 400 when superAdmin updates admin role with invalid data passed", async () => {
        const response = await supertest(app).patch(`/v1/admin/${validAdminId}/role`)
            .set("Authorization", `Bearer ${validSuperAdminToken}`)
            .send({ newRole: "ADMIN" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 404 when superAdmin updates an admin who isn't exist", async () => {
        const response = await supertest(app).patch(`/v1/admin/66f96cc72cecfcdbd45b48bb/role`)
            .set("Authorization", `Bearer ${validSuperAdminToken}`)
            .send({ newRole: "superAdmin" });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Admin not found");
    });

    it("should return status 200 when superAdmin updates admin role with valid data passed", async () => {
        const response = await supertest(app).patch(`/v1/admin/${validAdminId}/role`)
            .set("Authorization", `Bearer ${validSuperAdminToken}`)
            .send({ newRole: "superAdmin" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Admin updated successfully");
    });

    it("should return status 403 when unMaster superAdmin tries to update another superAdmin role", async () => {
        await supertest(app).patch(`/v1/admin/${permaSuperAdminId}/role`).set("Authorization", `Bearer ${validMasterToken}`).send({ newRole: "superAdmin" });

        const response = await supertest(app).patch(`/v1/admin/${permaSuperAdminId}/role`)
            .set("Authorization", `Bearer ${validSuperAdminToken}`)
            .send({ newRole: "admin" });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("You are not master to perform this !");
        
    });

    it("should return status 200 when Master superAdmin tries to update another admin/superAdmin role", async () => {
        const response = await supertest(app).patch(`/v1/admin/${permaSuperAdminId}/role`)
            .set("Authorization", `Bearer ${validMasterToken}`)
            .send({ newRole: "admin" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Admin updated successfully");
    });

    it("should return status 200 when Master superAdmin tries to update another admin/superAdmin role", async () => {
        const response = await supertest(app).patch(`/v1/admin/${validAdminId}/role`)
            .set("Authorization", `Bearer ${validMasterToken}`)
            .send({ newRole: "superAdmin" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Admin updated successfully");
    });
});

describe("___Delete Admin___", () => {
    it("should return status 401 when unauthenticated user tries to delete admin", async () => {
        const response = await supertest(app).delete(`/v1/admin/${validAdminId}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when admin tries to delete another admin", async () => {
        const response = await supertest(app).delete(`/v1/admin/${validAdminId}`)
            .set("Authorization", `Bearer ${validAdminToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when unMaster superAdmin deletes an admin who isn't exist", async () => {
        const response = await supertest(app).delete(`/v1/admin/66f96cc72cecfcdbd45b48bb`)
            .set("Authorization", `Bearer ${validSuperAdminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Admin not found");
    });

    it("should return status 204 when unMaster superAdmin deletes an admin who is exist", async () => {
        await supertest(app).patch(`/v1/admin/${validAdminId}/role`).set("Authorization", `Bearer ${validMasterToken}`).send({ newRole: "admin" });
        
        const response = await supertest(app).delete(`/v1/admin/${validAdminId}`)
            .set("Authorization", `Bearer ${validSuperAdminToken}`);

        expect(response.status).toBe(204);
    });

    it("should return status 404 when unMaster superAdmin tries to delete another superAdmin", async () => {
        await supertest(app).patch(`/v1/admin/${permaSuperAdminId}/role`).set("Authorization", `Bearer ${validMasterToken}`).send({ newRole: "superAdmin" });
        
        const response = await supertest(app).delete(`/v1/admin/${permaSuperAdminId}`)
            .set("Authorization", `Bearer ${validSuperAdminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Admin not found");
    });

    it("should return status 204 when Master superAdmin tries to delete another admin/superAdmin", async () => {
        const response = await supertest(app).delete(`/v1/admin/${permaSuperAdminId}`)
            .set("Authorization", `Bearer ${validMasterToken}`);

        expect(response.status).toBe(204);
    });

    it("should return status 204 when Master superAdmin tries to delete another admin/superAdmin", async () => {    
        const response = await supertest(app).delete(`/v1/admin/${validAdminId}`)
            .set("Authorization", `Bearer ${validMasterToken}`);

        expect(response.status).toBe(204);
    });
})