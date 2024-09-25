const supertest = require("supertest");
const app = require("../app");

describe("___Get Profile For Admin___", () => {
  const validToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmYyOGIwNGJjYWRhNTIwZWUwOTQ4YWYiLCJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZSI6InN1cGVyQWRtaW4iLCJpYXQiOjE3MjcyNjkyODgsImV4cCI6MTcyOTg2MTI4OH0.gdOS2Z3gbhO3kR13530vjXmSCBhn3nSuTYPWPyjsHaQ";

  it("should return status 401 when admin isn't authenticated", async () => {
    const response = await supertest(app)
      .get("/admins/profile")
      .set("Authorization", `Bearer ${(validToken[0] = "s")}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 200 when admin fetches his profile", async () => {
    const response = await supertest(app)
      .get("/admins/profile")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Admin profile fetched successfully");
  });
});

describe("___Update Profile For Admin___", () => {
  const validToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY0MTE4ZjM4MWE4OTcyZThmNGRjOTMiLCJ1c2VyTmFtZSI6ImFkbWluMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNzI3Mjc2OSwiZXhwIjoxNzI5ODY0NzY5fQ.p74QsQlN-I5IUQ-hPe_CTDxK8LoVm6zSPiUK0TvObiQ"
  const existedUserName = "testAdmin";
  const existedEmail = "ahmed.essam7722@gmail.com";
  const validProfileData = {
    userName: "newUserName",
    email: "newEmail@gmail.com",
    phoneNumber: "01000000000",
  }

  it("should return status 401 when admin isn't authenticated", async () => {
    const response = await supertest(app)
      .post("/admins/profile")
      .set("Authorization", `Bearer ${(validToken[0] = "s")}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return status 409 when admin updates userName with existed one", async () => {
    const response = await supertest(app)
      .post("/admins/profile")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        userName: existedUserName,
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("should return status 409 when admin updates email with existed one", async () => {
    const response = await supertest(app)
      .post("/admins/profile")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        email: existedEmail,
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("should return status 200 when admin updates his profile", async () => {
    const response = await supertest(app)
      .post("/admins/profile")
      .set("Authorization", `Bearer ${validToken}`)
      .send(validProfileData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Profile updated successfully");
      expect(response.body.data).toEqual(Object.assign(validProfileData, { _id: response.body.data._id }));
  });
});
