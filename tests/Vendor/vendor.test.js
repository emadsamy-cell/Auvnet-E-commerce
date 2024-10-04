const supertest = require("supertest");
const app = require("../../app");
const data = require('./vendor.data');
const userData = require('../User/user.temp.data');
const { generateOTP } = require("../../helpers/otpManager");
const path = require('path')

jest.mock("../../helpers/otpManager", () => ({
    generateOTP: jest.fn(),
}));


// Authentication Testing
describe("___User SignIn___", () => {
    it("should return status 400 when vendor sign in with no userName", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.missingUserNameSignIn);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when vendor sign in with no password", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.missingPasswordSignIn);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when vendor sign in with invalid userName", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.invalidUserNameSignIn);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when vendor sign in when password length is less than 8 characters", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.invalidPasswordSignIn);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when User Name is incorrect", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.inCorrectUserNameSignIn);
    
        expect(response.status).toBe(401); // Expect status 401
        expect(response.body.message).toBe("Incorrect userName"); 
    });
      
    it("should return status 401 when incorrect password", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.inCorrectPasswordSignIn);
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Incorrect password"); 
    });

    it("should return status 401 when vendor account is inactive", async () => {
        // try to login with Inactive Account
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.inactiveAccountSignIn);
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Your account has been suspended. Please contact support for further assistance."); 
    });

    it("should return status 401 when vendor account is deleted", async () => {
        // try to login with Inactive Account
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.deletedAccountSignIn);
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Incorrect userName"); 
    });

    it("should return status 200 when sign in with correct userName and password", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/signIn").send(data.validSignIn);

        // save token for next test
        data.accessToken = response.body.data.token;

        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Login successfully"); 
    });
});

describe("___verifyOTP___", () => {
    it("should return status 400 when Email is missing", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.missingEmailVerifyOTP);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when OTP is missing", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.missingOTPVerifyOTP);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Email is invalid", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.invalidEmailVerifyOTP);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when OTP is invalid", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.invalidOTPVerifyOTP);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 404 when the Email is incorrect", async () => {
        // Make a verify request
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.inCorrectEmailVerifyOTP);

        expect(response.status).toBe(404); 
        expect(response.body.message).toBe("This email has no accounts"); 
    });

    it("should return status 401 when the Email is inactive", async () => {
        // Make a verify request
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.inactiveAccountVerifyOTP);

        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Your account has been suspended. Please contact support for further assistance."); 
    });

    it("should return status 404 when the Email is Deleted", async () => {
        // Make a verify request
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.deletedAccountVerifyOTP);

        expect(response.status).toBe(404); 
        expect(response.body.message).toBe("This email has no accounts"); 
    });

    it("should return status 401 when the OTP is incorrect", async () => {
        // Mock OTP generator
        generateOTP.mockImplementation(() => data.OTPValid);

        // Make a resend request
        let response = await supertest(app).post("/v1/vendor/auth/forget-password").send(data.validForgetPassword);
        
        // Make a verify request
        response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.inCorrectOTPVerifyOTP);

        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Incorrect OTP"); 
    });

    it("should return status 401 when the otp is expired", async () => {
        // Mock OTP generator
        generateOTP.mockImplementation(() => data.expiredOTP);

        // Make a resend request
        await supertest(app).post("/v1/vendor/auth/forget-password").send(data.validForgetPassword);

        // Make a verify request
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.validVerifyOTP);

        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("OTP has been expired"); 
    });
      
    it("should return status 200 when matched OTP", async () => {
        // Mock OTP generator
        generateOTP.mockImplementation(() => data.OTPValid);

        // Make a resend request
        await supertest(app).post("/v1/vendor/auth/forget-password").send(data.validForgetPassword);

        // Make a verify request
        const response = await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.validVerifyOTP);

    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("OTP has been verified successfully!"); 
    });
});

describe("__Forget Password___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/forget-password").send(data.invalidEmailForgetPassword);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when missing email address", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/forget-password").send(data.missingEmailForgetPassword);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when vendor account is inactive", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/forget-password").send(data.inactiveAccountForgetPassword);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Your account has been suspended. Please contact support for further assistance.");
    });

    it("should return status 404 when no vendor with this email", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/forget-password").send(data.inCorrectEmailForgetPassword);

        expect(response.status).toBe(404); 
        expect(response.body.message).toBe("This email has no accounts"); 
    });

    it("should return status 404 when this email is deleted", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/forget-password").send(data.deletedAccountForgetPassword);

        expect(response.status).toBe(404); 
        expect(response.body.message).toBe("This email has no accounts"); 
    });
      
    it("should return status 200 when valid email vendor", async () => {
        const response = await supertest(app).post("/v1/vendor/auth/forget-password").send(data.validForgetPassword);
    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("OTP has been sent to your email"); 
    });
});

describe("___Reset Password___", () => {
    it("should return status 400 when Email is missing", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.missingEmailForgetPassword);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Password is missing", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.missingPasswordResetPassword);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Confirm Password is missing", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.missingConfirmPasswordResetPassword);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.invalidEmailResetPassword);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when passwords doesn't match", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.inCorrectMatchResetPassword);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when invalid password length", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.invalidPasswordResetPassword);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when Account is inactive", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.inactiveAccountResetPassword);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Your account has been suspended. Please contact support for further assistance.");
    });

    it("should return status 403 when OTP is not yet verified", async () => {
         // Mock OTP generator
        generateOTP.mockImplementation(() => data.OTPValid);
        
        // request otp
        await supertest(app).post("/v1/vendor/auth/forget-password").send(data.validForgetPassword);

        // Try to reset password without verify
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.validResetPassword);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Unauthorized to preform this action");
    });

    it("should return status 404 when Email is Deleted", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.deletedAccountResetPassword);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("This email has no accounts");
    });

    it("should return status 404 when Email is incorrect", async () => {
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.inCorrectEmailResetPassword);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("This email has no accounts");
    });

    it("should return status 200 when Email is valid and OTP is verified", async () => { 
        // Mock OTP generator
        generateOTP.mockImplementation(() => data.OTPValid);

        // Make a Forget request
        await supertest(app).post("/v1/vendor/auth/forget-password").send(data.validForgetPassword);

        // Verify the request
        await supertest(app).post("/v1/vendor/auth/verify-otp").send(data.validVerifyOTP);

        // Make a reset request
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.validResetPassword);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password has been changed successfully");
    });

    it("should return status 403 when Trying to reset password again ", async () => {
        // Try to reset password again
        const response = await supertest(app).patch("/v1/vendor/auth/reset-password").send(data.validResetPassword);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Unauthorized to preform this action");
    });
});

// Profile Testing
describe("___Get Profile___", () => {
    it("should return status 401 when token is missing", async () => {     
        const response = await supertest(app).get("/v1/vendor/profile/").send();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).get("/v1/vendor/profile/").set("Authorization", `Bearer ${data.inValidToken}`).send();
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 200 when email is found and otp is null", async () => {
        const response = await supertest(app).get("/v1/vendor/profile/").set("Authorization", `Bearer ${data.accessToken}`).send();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("vendor Found");
    });
});

describe("___Update Profile___", () => {
    it("should return status 200 when all data is valid", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/update")
        .set("Authorization", `Bearer ${data.accessToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('profileImage', path.join(__dirname, '../../test.png'))
        .attach('coverImage', path.join(__dirname, '../../test.png'))

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Vendor has been updated successfully");
    });

    it("should return status 401 when token is missing", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/update")
        .set('Content-Type', 'multipart/form-data')
        .attach('profileImage', path.join(__dirname, '../../test.png'))
        .attach('coverImage', path.join(__dirname, '../../test.png'))

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/update")
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('profileImage', path.join(__dirname, '../../test.png'))
        .attach('coverImage', path.join(__dirname, '../../test.png'))

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 500 when Too Many Images", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/update")
        .set("Authorization", `Bearer ${data.accessToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('profileImage', path.join(__dirname, '../../test.png'))
        .attach('profileImage', path.join(__dirname, '../../test.png'))

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Unexpected field");
    });
});

describe("___Change Password___", () => {
    it("should return status 400 when invalid password length less than 8 characters", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/change-password").set("Authorization", `Bearer ${userData.validToken}`)
        .send(userData.invalidCurrentPasswordChangePasswordData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when new passwords doesn't match", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/change-password").set("Authorization", `Bearer ${userData.validToken}`)
        .send(userData.invalidConfirmPasswordNewPasswordData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when missing fields", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/change-password").set("Authorization", `Bearer ${userData.validToken}`)
        .send(userData.missingNewPasswordChangePasswordData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when incorrect current password", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/change-password").set("Authorization", `Bearer ${data.accessToken}`)
        .send(userData.incorrectCurrentPasswordChangePasswordData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Incorrect password");
    });

    it("should return status 401 when token is missing", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/change-password")
        .send(userData.validChangePasswordData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/change-password").set("Authorization", `Bearer ${userData.inValidToken}`)
        .send(userData.validChangePasswordData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 200 when all fields and token are valid", async () => {
        const response = await supertest(app).patch("/v1/vendor/profile/change-password").set("Authorization", `Bearer ${data.accessToken}`)
        .send(userData.validChangePasswordData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password has been changed successfully");
    });
});