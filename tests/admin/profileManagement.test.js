const app = require("../../app");
const { validAdminToken, existedAdminEmail, existedAdminUserName, validAdminProfileData, invalidAdminToken } = require("../Data")
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

