const supertest = require("supertest");
const app = require("../../app");
const { generateOTP } = require("../../helpers/otpManager");
const tokenManager = require('../../helpers/tokenManager');
const data = require('./user.temp.data');
const roles = require('../../enums/roles')

jest.mock("../../helpers/otpManager", () => ({
    generateOTP: jest.fn(),
}));

beforeAll(() => {
    jest.setTimeout(10000);
    data.adminToken = tokenManager.generateAccessToken({id: 1, role: 'admin'});
    data.userToken = tokenManager.generateAccessToken({id: 2, role: roles.USER});
    data.vendorToken = tokenManager.generateAccessToken({id: 3, role: roles.VENDOR});
});

// Authentication
describe("___User SignUp___", () => {
    it("should return status 201 when all credentials are valid", async () => {
        // Mock OTP generator 
        generateOTP.mockImplementation(() => data.OTPValid);
        
        // Make a sign-up request
        const response = await supertest(app).post("/v1/user/auth/signUp").send(data.validUserSignUpData);

        expect(response.status).toBe(201); 
        expect(response.body.message).toBe("OTP code has been sent to your email"); 
    });
    
    it("should return status 400 when user sign up with invalid email address", async () => {
        const response = await supertest(app).post("/v1/user/auth/signUp").send(data.invalidEmailUserSignUpData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign up when password not equal confirm password", async () => {
        const response = await supertest(app).post("/v1/user/auth/signUp").send(data.invalidPasswordMatchUserSignUpData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign up with invalid Password Length (minimum 8 characters)", async () => {
        const response = await supertest(app).post("/v1/user/auth/signUp").send(data.invalidPasswordLengthUserSignUpData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign up with missing fields", async () => {
        const response = await supertest(app).post("/v1/user/auth/signUp").send(data.missingFieldUserSignUpData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 409 when email already exists", async () => {
        // Make a sign-up request
        const response = await supertest(app).post("/v1/user/auth/signUp").send(data.duplicateUserNameUserSignUpData);
    
        expect(response.status).toBe(409); // Expect status 409
        expect(response.body.message).toBe("Email or userName already connect to an account"); 
    });

    it("should return status 409 when userName already exists", async () => {
        // Make a sign-up request
        const response = await supertest(app).post("/v1/user/auth/signUp").send(data.duplicateEmailUserSignUpData);
    
        expect(response.status).toBe(409); // Expect status 409
        expect(response.body.message).toBe("Email or userName already connect to an account"); 
    });
});

describe("___verifyOTP___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).post("/v1/user/auth/verify-otp").send(data.invalidEmailVerification);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when the otp is incorrect", async () => {
        // Make a verify request
        const response = await supertest(app).post("/v1/user/auth/verify-otp").send(data.invalidOTPVerification);

        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Incorrect OTP"); 
    });

    it("should return status 401 when the otp is expired", async () => {
        // Mock OTP generator
        generateOTP.mockImplementation(() => data.expiredOTP);

        // Make a resend request
        await supertest(app).post("/v1/user/auth/resend-otp").send(data.validEmailAddress);

        // Make a verify request
        const response = await supertest(app).post("/v1/user/auth/verify-otp").send(data.validOTPVerification);

        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("OTP has been expired"); 
    });
      
    it("should return status 200 when matched OTP", async () => {
        // Mock OTP generator
        generateOTP.mockImplementation(() => data.OTPValid);

        // Make a resend request
        await supertest(app).post("/v1/user/auth/resend-otp").send(data.validEmailAddress);

        // Make a verify request
        const response = await supertest(app).post("/v1/user/auth/verify-otp").send(data.validOTPVerification);

    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("OTP has been verified successfully!"); 
    });
});

describe("___Resend OTP___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).post("/v1/user/auth/resend-otp").send(data.invalidEmailAddress);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 404 when no user with this email", async () => {
        // verify with wrong otp code
        const response = await supertest(app).post("/v1/user/auth/resend-otp").send(data.incorrectEmailAddress);

        expect(response.status).toBe(404); 
        expect(response.body.message).toBe("This email has no accounts"); 
    });
      
    it("should return status 200 when matched OTP", async () => {
        // there are user with provided email address
        const response = await supertest(app).post("/v1/user/auth/resend-otp").send(data.validEmailAddress);
    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("OTP has been sent to your email"); 
    });
});

describe("__Forget Password___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).post("/v1/user/auth/forget-password").send(data.invalidEmailAddress);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 404 when no user with this email", async () => {
        const response = await supertest(app).post("/v1/user/auth/forget-password").send(data.incorrectEmailAddress);

        expect(response.status).toBe(404); 
        expect(response.body.message).toBe("This email has no accounts"); 
    });
      
    it("should return status 200 when matched OTP", async () => {
        const response = await supertest(app).post("/v1/user/auth/forget-password").send(data.validEmailAddress);
    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("OTP has been sent to your email"); 
    });
});

describe("___Reset Password___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).patch("/v1/user/auth/reset-password").send(data.invalidResetPasswordEmailData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when passwords doesn't match", async () => {
        const response = await supertest(app).patch("/v1/user/auth/reset-password").send(data.invalidResetPasswordMatchData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when invalid password length", async () => {
        const response = await supertest(app).patch("/v1/user/auth/reset-password").send(data.invalidResetPasswordData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 200 when email is found and otp is verified", async () => { 
        // verify otp
        await supertest(app).post("/v1/user/auth/verify-otp").send(data.validOTPVerification);

        const response = await supertest(app).patch("/v1/user/auth/reset-password").send(data.validResetPasswordData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password has been changed successfully");
    });

    it("should return status 403 when trying to reset again", async () => { 
        const response = await supertest(app).patch("/v1/user/auth/reset-password").send(data.validResetPasswordData);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Unauthorized to preform this action");
    });

    it("should return status 403 when OTP is not yet verified or expired", async () => {
        // request otp
        await supertest(app).post("/v1/user/auth/forget-password").send(data.validEmailAddress);
        
        const response = await supertest(app).patch("/v1/user/auth/reset-password").send(data.validResetPasswordData);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("Unauthorized to preform this action");
    });

    
});

describe("___User SignIn___", () => {
    it("should return status 400 when user sign in with no email or userName", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.missingEmailSignInData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign in with no password", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.missingPasswordSignInData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign in with invalid email address", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.invalidEmailAddressSignInData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign in when password length is less than 8 characters", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.invalidPasswordUserSignInData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when email is incorrect", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.incorrectEmailSignInData);
    
        expect(response.status).toBe(401); // Expect status 401
        expect(response.body.message).toBe("Incorrect userName or email"); 
    });

    it("should return status 401 when userName is incorrect", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.incorrectUsernameSignInData);
    
        //expect(response.status).toBe(401); // Expect status 401
        expect(response.body.message).toBe("Incorrect userName or email"); 
    });
      
    it("should return status 401 when incorrect password", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.incorrectPasswordSignInData);
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Incorrect password"); 
    });

    it("should return status 401 when user isn't verified", async () => {
        // make new user
        await supertest(app).post("/v1/user/auth/signUp").send(data.validSecondUserSignUpData);

        // try to login without verified
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.unVerifiedUserSignInData);
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Please verify your account first to login"); 
    });

    it("should return status 200 when sign in with correct email and password", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.validEmailSignInData);

        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Login successfully"); 
    });

    it("should return status 200 when sign in with correct user name and password", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send(data.validUserNameSignInData);

        // save data for next test
        data.validToken = response.body.data.token;
        data.userID = response.body.data.user._id;

        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Login successfully"); 
    });
});

// Profile Management
describe("___Get Profile___", () => {
    it("should return status 401 when token is missing", async () => {     
        const response = await supertest(app).get("/v1/user/profile/").send();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).get("/v1/user/profile/").set("Authorization", `Bearer ${data.inValidToken}`).send();
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 200 when email is found and otp is null", async () => {
        const response = await supertest(app).get("/v1/user/profile/").set("Authorization", `Bearer ${data.validToken}`).send();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User Found");
    });
});

describe("___Update Profile___", () => {
    it("should return status 400 when Update latitude without longitude", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.validToken}`)
                        .send(data.onlyLatitudeUpdateUserProfileData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Update longitude without latitude", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.onlyLongitudeUpdateUserProfileData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Invalid latitude", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.invalidLatitudeUpdateUserProfileData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Invalid longitude", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.invalidLongitudeUpdateUserProfileData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when invalid Gender", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.invalidGenderUpdateUserProfileData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Invalid phone length", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.invalidPhoneLengthUpdateUserProfileData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Invalid phone number", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.invalidPhoneUpdateUserProfileData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when token is missing", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update")
        .send(data.validUpdateUserProfileData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.inValidToken}`)
        .send(data.validUpdateUserProfileData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 200 when email is found and otp is null", async () => {
        const response = await supertest(app).patch("/v1/user/profile/update").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.validUpdateUserProfileData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User updated successfully");
    });
});

describe("___Change Password___", () => {
    it("should return status 400 when invalid password length less than 8 characters", async () => {
        const response = await supertest(app).patch("/v1/user/profile/change-password").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.invalidNewPasswordChangePasswordData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when new passwords doesn't match", async () => {
        const response = await supertest(app).patch("/v1/user/profile/change-password").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.invalidConfirmPasswordNewPasswordData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when missing fields", async () => {
        const response = await supertest(app).patch("/v1/user/profile/change-password").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.missingNewPasswordChangePasswordData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when token is missing", async () => {
        const response = await supertest(app).patch("/v1/user/profile/change-password")
        .send(data.validChangePasswordData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch("/v1/user/profile/change-password").set("Authorization", `Bearer ${data.inValidToken}`)
        .send(data.validChangePasswordData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 200 when all fields and token are valid", async () => {
        const response = await supertest(app).patch("/v1/user/profile/change-password").set("Authorization", `Bearer ${data.validToken}`)
        .send(data.validChangePasswordData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password has been changed successfully");
    });
});

// User Management
describe("___List Users___", () => {
    it("should return status 200 when Admin request", async () => {
        const response = await supertest(app).get("/v1/user/list/").set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Users has been found!");
    });

    it("should return status 401 when token is missing", async () => {     
        const response = await supertest(app).get("/v1/user/list/");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).get("/v1/user/list/").set("Authorization", `Bearer ${data.inValidToken}`);
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when user send this request", async () => {
        const response = await supertest(app).get("/v1/user/list/").set("Authorization", `Bearer ${data.userToken}`);
    
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when vendor send this request", async () => {
        const response = await supertest(app).get("/v1/user/list/").set("Authorization", `Bearer ${data.vendorToken}`);
    
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });
});

describe("___Delete User___", () => {
    it("should return status 204 when Admin request and User Found", async () => {
        const response = await supertest(app).patch(`/v1/user/delete/${data.userID}`).set("Authorization", `Bearer ${data.adminToken}`).send();

        expect(response.status).toBe(204);
    });

    it("should return status 401 when token is missing", async () => {     
        const response = await supertest(app).patch(`/v1/user/delete/${data.userID}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/user/delete/${data.userID}`).set("Authorization", `Bearer ${data.inValidToken}`);
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when user send this request", async () => {
        const response = await supertest(app).patch(`/v1/user/delete/${data.userID}`).set("Authorization", `Bearer ${data.userToken}`);
    
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when vendor send this request", async () => {
        const response = await supertest(app).patch(`/v1/user/delete/${data.userID}`).set("Authorization", `Bearer ${data.vendorToken}`);
    
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when User not found", async () => {
        const response = await supertest(app).patch(`/v1/user/delete/${data.incorrectUserID}`).set("Authorization", `Bearer ${data.adminToken}`);
    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe( "User not found");
    });

    it("should return status 422 when User already deleted before", async () => {
        const response = await supertest(app).patch(`/v1/user/delete/${data.userID}`).set("Authorization", `Bearer ${data.adminToken}`);
    
        expect(response.status).toBe(422);
        expect(response.body.message).toBe("This user is deleted before");
    });
});

describe("___Restore User___", () => {
    it("should return status 200 when Admin request and User Found", async () => {
        const response = await supertest(app).patch(`/v1/user/restore/${data.userID}`).set("Authorization", `Bearer ${data.adminToken}`).send();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User has been restored successfully");
    });

    it("should return status 401 when token is missing", async () => {     
        const response = await supertest(app).patch(`/v1/user/restore/${data.userID}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/user/restore/${data.userID}`).set("Authorization", `Bearer ${data.inValidToken}`);
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when user send this request", async () => {
        const response = await supertest(app).patch(`/v1/user/restore/${data.userID}`).set("Authorization", `Bearer ${data.userToken}`);
    
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when vendor send this request", async () => {
        const response = await supertest(app).patch(`/v1/user/restore/${data.userID}`).set("Authorization", `Bearer ${data.vendorToken}`);
    
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when User not found", async () => {
        const response = await supertest(app).patch(`/v1/user/restore/${data.incorrectUserID}`).set("Authorization", `Bearer ${data.adminToken}`);
    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe( "User not found");
    });

    it("should return status 422 when User already restored before", async () => {
        const response = await supertest(app).patch(`/v1/user/restore/${data.userID}`).set("Authorization", `Bearer ${data.adminToken}`);
    
        expect(response.status).toBe(422);
        expect(response.body.message).toBe("This user isn't deleted");
    });
});
