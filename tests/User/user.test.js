const supertest = require("supertest");
const app = require("../../app");
const userRepo = require("../../models/user/user.repo");
const { comparePassword } = require("../../helpers/authHelpers");
const data = require('../tempData');

jest.mock("../../models/user/user.repo");
jest.mock('../../helpers/authHelpers');


describe("___User SignUp___", () => {
    it("should return status 400 when user sign up with invalid email address", async () => {
        const response = await supertest(app).post("/v1/user/auth/signUp").send({
            name: data.nameValid,
            userName: data.userNameValid,
            email: data.emailInvalid,
            password: data.passwordCorrect,
            confirmPassword: data.passwordCorrect
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign up when password not equal confirm password", async () => {
        const response = await supertest(app).post("/v1/user/auth/signUp").send({
            name: data.nameValid,
            userName: data.userNameValid,
            email: data.emailValid,
            password: data.passwordCorrect,
            confirmPassword: data.passwordIncorrect
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 409 when email or userName already exists", async () => {
        // Mock the findOne function to simulate "email already exists"
        userRepo.findOne.mockResolvedValue(data.exist(null));
    
        // Make a sign-up request
        const response = await supertest(app).post("/v1/user/auth/signUp").send({
            name: data.nameValid,
            userName: data.userNameValid,
            email: data.emailValid,
            password: data.passwordCorrect,
            confirmPassword: data.passwordCorrect
        });
    
        expect(response.status).toBe(409); // Expect status 409
        expect(response.body.message).toBe("Email or userName already connect to an account"); 
    });
      
    it("should return status 201 when all credentials are valid", async () => {
        // email and userName are new
        userRepo.findOne.mockResolvedValue(data.exist(null));

        // account created
        userRepo.createUser.mockResolvedValue(data.createUser);
    
        // Make a sign-up request
        const response = await supertest(app).post("/v1/user/auth/signUp").send(data.createUser);
    
        expect(response.status).toBe(201); 
        expect(response.body.message).toBe("OTP code has been sent to your email"); 
    });
});

describe("___User SignIn___", () => {
    it("should return status 400 when user sign in with no email or userName", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send({
            password: data.passwordCorrect,
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign in when password length is less than 8 characters", async () => {
        const response = await supertest(app).post("/v1/user/auth/signIn").send({
            email: data.emailValid,
            password: data.passwordIncorrect,
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when email is incorrect", async () => {
        // email doesn't exist
        userRepo.findOne.mockResolvedValue(data.notExist);
    
        // Make a sign-in request
        const response = await supertest(app).post("/v1/user/auth/signIn").send({
            email: data.emailValid,
            password: data.passwordCorrect
        });
    
        expect(response.status).toBe(401); // Expect status 401
        expect(response.body.message).toBe("Invalid credentials"); 
    });

    it("should return status 401 when userName is incorrect", async () => {
        // userName doesn't exist
        userRepo.findOne.mockResolvedValue(data.notExist);
    
        // Make a sign-in request
        const response = await supertest(app).post("/v1/user/auth/signIn").send({
            userName: data.userNameValid,
            password: data.passwordCorrect
        });
    
        expect(response.status).toBe(401); // Expect status 401
        expect(response.body.message).toBe("Invalid credentials"); 
    });
      
    it("should return status 401 when passwords doesn't match", async () => {
        // email exist 
        userRepo.findOne.mockResolvedValue(data.exist(null));

        // wrong password
        comparePassword.mockResolvedValue(data.notMatch);
    
        // Make a sign-in request
        const response = await supertest(app).post("/v1/user/auth/signIn").send({
            email: data.emailValid,
            password: data.passwordCorrect,
        });
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Invalid credentials"); 
    });

    it("should return status 401 when user isn't verified", async () => {
        // userNameOrEmail exist but not verified yet
        userRepo.findOne.mockResolvedValue(data.exist({
            isVerified: data.notVerified 
        }));

        // correct password
        passwordManager.comparePasswords.mockResolvedValue(data.match);
    
        // Make a sign-in request
        const response = await supertest(app).post("/v1/user/auth/signIn").send({
            email: data.emailValid,
            password: data.passwordCorrect,
        });
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Please verify your account first to login"); 
    });

    it("should return status 200 when all are correct", async () => {
        // userNameOrEmail exist and verified
        userRepo.findOne.mockResolvedValue(data.exist({
            isVerified: data.verified 
        }));

        // correct password
        passwordManager.comparePasswords.mockResolvedValue(data.match);
    
        // Make a sign-in request
        const response = await supertest(app).post("/v1/user/auth/signIn").send({
            email: data.emailValid,
            password: data.passwordCorrect,
        });
    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Login successfully"); 
    });
});

describe("___verifyOTP___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).post("/v1/user/auth/verify-otp").send({
            email: data.emailInvalid,
            OTP: data.OTPValid
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 404 when email not found", async () => {
        // mock get user to be not found
        userRepo.findOneAndUpdate.mockResolvedValue(data.notExist)
        
        const response = await supertest(app).post("/v1/user/auth/verify-otp").send({
            email: data.emailValid,
            OTP: data.OTPValid
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("There are no account connected to this email");
    });

    it("should return status 401 when the otp is incorrect", async () => {
        // there are user with provided email address
        userRepo.findOneAndUpdate.mockResolvedValue(data.exist({
            OTP: data.OTPValid
        }));
    
        // verify with wrong otp code
        const response = await supertest(app).post("/v1/user/auth/verify-otp").send({
            email: data.emailValid,
            OTP: data.OTPInvalid
        });
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Incorrect OTP code"); 
    });
      
    it("should return status 200 when passwords doesn't match", async () => {
         // there are user with provided email address
         userRepo.findOneAndUpdate.mockResolvedValue(data.exist({
            OTP: data.OTPValid
        }));
    
        // verify with correct otp code
        const response = await supertest(app).post("/v1/user/auth/verify-otp").send({
            email: data.emailValid,
            OTP: data.OTPInvalid
        });
    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("OTP has been verified correctly!"); 
    });

  
});

describe("___Reset Password___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).put("/v1/user/auth/reset-password").send({
            email: data.emailInvalid,
            password: data.passwordCorrect,
            confirmPassword: data.passwordCorrect
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when passwords doesn't match", async () => {
        const response = await supertest(app).put("/v1/user/auth/reset-password").send({
            email: data.emailValid,
            password: data.passwordIncorrect,
            confirmPassword: data.passwordCorrect
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 403 when OTP is not null", async () => {
        // mock get user to be not found
        userRepo.findOneAndUpdate.mockResolvedValue(data.notExist)
        
        const response = await supertest(app).put("/v1/user/auth/reset-password").send({
            email: data.emailValid,
            password: data.passwordCorrect,
            confirmPassword: data.passwordCorrect
        });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("Unauthorized to preform this action");
    });

    it("should return status 200 when email is found and otp is not null", async () => {
        // mock get user to be not found
        userRepo.findOneAndUpdate.mockResolvedValue(data.exist({
            email: data.emailValid
        }))
        
        const response = await supertest(app).put("/v1/user/auth/reset-password").send({
            email: data.emailValid,
            password: data.passwordCorrect,
            confirmPassword: data.passwordCorrect
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Password has been changed successfully");
    });
});