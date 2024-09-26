const supertest = require("supertest");
const app = require("../../app");
const { generateOTP } = require("../../helpers/otpManager");
const { generateToken } = require("../../helpers/tokenManager");
const { loginAdminDataWithInvalidUserName, loginAdminDataWithInvalidPassword, validAdminLoginData, notExistedAdminUserName, existedAdminUserName, knownAdminOTP, token } = require("../Data")

describe("___Admin Login___", () => {
  it("should return status 400 when admin logins with userName less than 3 letters", async () => {
    const response = await supertest(app).post("/v1/admin/auth/signIn").send({
      userName: "ad",
      password: "admin123",
    });
    console.log(response.body)
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.message).toBe("validation error");
  });

  it("should return status 400 when admin logins with password less than 5 letters", async () => {
    const response = await supertest(app).post("/v1/admin/auth/signIn").send({
      userName: "ad",
      password: "admi",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.message).toBe("validation error");
  });

  it("should return status 401 when admin logins with invalid userName", async () => {
    const response = await supertest(app).post("/v1/admin/auth/signIn").send(loginAdminDataWithInvalidUserName);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.message).toBe("Invalid userName");
  });

  it("should return status 401 when admin logins with invalid password", async () => {
    const response = await supertest(app).post("/v1/admin/auth/signIn").send(loginAdminDataWithInvalidPassword);
    console.log(response.body)
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.message).toBe("Invalid password");
  });

  it("should return status 200 when admin logins with valid credentials", async () => {
    const response = await supertest(app).post("/v1/admin/auth/signIn").send(validAdminLoginData);

    expect(response.status).toBe(200);
    expect(response.body.success).toEqual(true);
  });
});

describe("___Request OTP From Admin___", () => {
  it("should return status 404 when admin requests OTP", async () => {
    const response = await supertest(app).get("/v1/admin/auth/request-otp").send({
      userName: notExistedAdminUserName,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toEqual(false);
  });

  it("should return status 200 when admin requests OTP", async () => {
    const response = await supertest(app).get("/v1/admin/auth/request-otp").send({
      userName: existedAdminUserName,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toEqual(true);
  });
});

//mocking generateOTP and generateToken
jest.mock("../../helpers/otpManager", () => ({
  generateOTP: jest.fn(),
}));
jest.mock("../../helpers/tokenManager", () => ({
  generateToken: jest.fn(),
}));

describe("___Verify Admin OTP___", () => {
  //constants
  const knownOTP = knownAdminOTP;
  const userName = existedAdminUserName;

  //mock functions
  generateOTP.mockImplementation(() => knownOTP);
  generateToken.mockImplementation(() => token);

  it("should return status 403 when admin enters invalid OTP", async () => {
    //request OTP with known value
    await supertest(app).get("/v1/admin/auth/request-otp").send({
      userName,
    });
    //verify OTP
    const response = await supertest(app).post("/v1/admin/auth/verify-otp").send({
      userName,
      OTP: "111111",
    });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Invalid OTP or OTP is expired");
  });

  it("should return status 200 when admin enters valid OTP", async () => {
    //request OTP with known value
    await supertest(app).get("/v1/admin/auth/request-otp").send({
      userName,
    });
    //verify OTP
    const response = await supertest(app).post("/v1/admin/auth/verify-otp").send({
      userName,
      OTP: knownOTP.value.toString(),
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successfully");
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data.token).toEqual(token);
  });
});
