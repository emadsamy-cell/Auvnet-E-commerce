const app = require("../../app");
const data = require("../Data");
const supertest = require("supertest");

describe("___Get Profile For Admin___", () => {
  it("should return status 401 when admin isn't authenticated", async () => {
    const response = await supertest(app)
      .get("/v1/admin/profile")
      .set("Authorization", `Bearer ${data.invalidAdminToken}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 200 when admin fetches his profile", async () => {
    const response = await supertest(app)
      .get("/v1/admin/profile")
      .set("Authorization", `Bearer ${data.validAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Admin profile fetched successfully");
  });
});

describe("___Update Profile For Admin___", () => {
  it("should return status 401 when admin isn't authenticated", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile")
      .set("Authorization", `Bearer ${data.invalidAdminToken}`)
      .send(data.validAdminProfileData);
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 409 when admin updates userName with existed one", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile")
      .set("Authorization", `Bearer ${data.validAdminToken}`)
      .send(Object.assign(data.validAdminProfileData, { userName: data.existedAdminUserName }));

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("should return status 409 when admin updates email with existed one", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile")
      .set("Authorization", `Bearer ${data.validAdminToken}`)
      .send(Object.assign(data.validAdminProfileData, { email: data.existedAdminEmail }));

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("should return status 200 when admin updates his profile", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile")
      .set("Authorization", `Bearer ${data.validAdminToken}`)
      .send(data.validAdminProfileData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Profile updated successfully");
    expect(response.body.data).toEqual(Object.assign(data.validAdminProfileData, { _id: response.body.data._id }));
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

  it("should return status 401 when admin enters wrong currentPassword", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile/password")
      .set("Authorization", `Bearer ${data.validMasterToken}`)
      .send({ currentPassword: data.newPassword, newPassword: data.newPassword });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 200 when admin enters correct currentPassword and updates with corrected format password", async () => {
    const response = await supertest(app)
      .patch("/v1/admin/profile/password")
      .set("Authorization", `Bearer ${data.validMasterToken}`)
      .send({ currentPassword: data.oldPassword, newPassword: data.newPassword });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Password has been changed successfully");
    const loginResponse = await supertest(app)
      .post("/v1/admin/auth/signIn")
      .send({ userName: "admin", password: data.newPassword });

    expect(loginResponse.status).toBe(200);

    await supertest(app)
      .patch("/v1/admin/profile/password")
      .set("Authorization", `Bearer ${data.validMasterToken}`)
      .send({ currentPassword: data.newPassword, newPassword: data.oldPassword });
  });
});

