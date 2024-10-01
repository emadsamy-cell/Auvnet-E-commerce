const app = require("../../app");
const { validAdminToken, existedAdminEmail, existedAdminUserName, validAdminProfileData, invalidAdminToken, validMasterToken } = require("../Data")
const supertest = require("supertest");

describe("___Get Profile For Admin___", () => {
  it("should return status 401 when admin isn't authenticated", async () => {
    const response = await supertest(app)
      .get("/v1/admin/profile")
      .set("Authorization", `Bearer ${invalidAdminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 200 when admin fetches his profile", async () => {
    const response = await supertest(app)
      .get("/v1/admin/profile")
      .set("Authorization", `Bearer ${validAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Admin profile fetched successfully");
  });
});

describe("___Update Profile For Admin___", () => {
  it("should return status 401 when admin isn't authenticated", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile")
      .set("Authorization", `Bearer ${invalidAdminToken}`)
      .send(validAdminProfileData);
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 409 when admin updates userName with existed one", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile")
      .set("Authorization", `Bearer ${validAdminToken}`)
      .send(Object.assign(validAdminProfileData, { userName: existedAdminUserName }));

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("should return status 409 when admin updates email with existed one", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile")
      .set("Authorization", `Bearer ${validAdminToken}`)
      .send(Object.assign(validAdminProfileData, { email: existedAdminEmail }));

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("should return status 200 when admin updates his profile", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile")
      .set("Authorization", `Bearer ${validAdminToken}`)
      .send(validAdminProfileData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Profile updated successfully");
    expect(response.body.data).toEqual(Object.assign(validAdminProfileData, { _id: response.body.data._id }));
  });
});

describe("___Update Password For Admin___", () => {
  it("should return status 400 when inserted data is invalid", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile/password")
      .send({ currentPassword: "", newPassword: "" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return status 401 when admin isn't authenticated", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile/password")
      .set("Authorization", `Bearer ${invalidAdminToken}`)
      .send({ currentPassword: "admin", newPassword: "Admin@123" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 401 when admin enters wrong currentPassword", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile/password")
      .set("Authorization", `Bearer ${validMasterToken}`)
      .send({ currentPassword: "admin", newPassword: "Admin@123" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 200 when admin enters correct currentPassword and updates with corrected format password", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile/password")
      .set("Authorization", `Bearer ${validMasterToken}`)
      .send({ currentPassword: "Admin@1234", newPassword: "Admin@1233" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Password has been changed successfully");
    const loginResponse = await supertest(app)
      .post("/v1/admin/auth/signIn")
      .send({ userName: "admin", password: "Admin@123" });

    expect(loginResponse.status).toBe(200);
  });
});

