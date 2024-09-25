const supertest = require("supertest");
const app = require("../app");
const userRepo = require("../models/user/user.repo");
const { otpGenerator } = require('../helpers/otp.helper');
const passwordManager = require('../helpers/password.helper');

jest.mock("../models/user/user.repo");
jest.mock("../helpers/otp.helper");
jest.mock('../helpers/password.helper');

describe("___User SignUp___", () => {
    it("should return status 400 when user sign up with invalid email address", async () => {
        const response = await supertest(app).post("/v1/auth/user/signIn").send({
            name: "emad",
            username: "3omd",
            email: "auvner1",
            password: "12345678",
            confirmPassword: "12345678"
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign up when password not equal confirm password", async () => {
        const response = await supertest(app).post("/v1/auth/user/signUp").send({
            name: "emad",
            username: "3omd",
            email: "auvner1@gmail.com",
            password: "12345678",
            confirmPassword: "1234567"
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 409 when email or username already exists", async () => {
        // Mock the isNotExist function to simulate "email already exists"
        userRepo.isNotExist.mockResolvedValue({
            success: false,
            message: "User already exist",
            statusCode: 409,
            error: null
        });
    
        // Make a sign-up request
        const response = await supertest(app).post("/v1/auth/user/signUp").send({
          name: "emad",
          username: "3omda",
          email: "samiemad567@gmail.com", // Simulate the email already exists
          password: "password123",
          confirmPassword: "password123"
        });
    
        expect(response.status).toBe(409); // Expect status 409
        expect(response.body.message).toBe("Email or Username already connect to an account"); 
    });
      
    it("should return status 201 when all credentials are vaild", async () => {
        // email and username are new
        userRepo.isNotExist.mockResolvedValue({
            success: true,
            message: "User not existed",
            statusCode: 200,
            error: null
        });

        // account created
        userRepo.createUser.mockResolvedValue({
            success: true,
            statusCode: 201,
            message: "User has been created Successfully"
        });
    
        // Make a sign-up request
        const response = await supertest(app).post("/v1/auth/user/signUp").send({
          name: "emad",
          username: "3omda",
          email: "samiemad567@gmail.com", 
          password: "password123",
          confirmPassword: "password123"
        });
    
        expect(response.status).toBe(201); 
        expect(response.body.message).toBe("OTP code has been sent to your email"); 
    });
});

describe("___User SignIn___", () => {
    it("should return status 400 when user sign in with invalid usernameOrEmail", async () => {
        const response = await supertest(app).post("/v1/auth/user/signIn").send({
            password: "12345678",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when user sign in when password length is less than 8 characters", async () => {
        const response = await supertest(app).post("/v1/auth/user/signIn").send({
            usernameOrEmail: "auvnet",
            password: "1234567",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when usernameOrEmail is incorrect", async () => {
        // usernameOrEmail doesn't exist
        userRepo.isExist.mockResolvedValue({
            success: false,
            statusCode: 401,
            message: "Invalid credentials",
            error: "can't find user with this ID !!"
        });
    
        // Make a sign-up request
        const response = await supertest(app).post("/v1/auth/user/signIn").send({
            usernameOrEmail: "auvnet",
            password: "12345678",
        });
    
        expect(response.status).toBe(401); // Expect status 409
        expect(response.body.message).toBe("Invalid credentials"); 
    });
      
    it("should return status 401 when passwords doesn't match", async () => {
        // usernameOrEmail exist 
        userRepo.isExist.mockResolvedValue({
            success: true,
            data: {
                isVerified: false
            },
            statusCode: 200,
        });

        // wrong password
        passwordManager.comparePasswords.mockResolvedValue(
            false
        );
    
        // Make a sign-in request
        const response = await supertest(app).post("/v1/auth/user/signIn").send({
            usernameOrEmail: "auvnet",
            password: "12345678",
        });
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Invalid credentials"); 
    });

    it("should return status 401 when user isn't verified", async () => {
        // usernameOrEmail exist but not verified yet
        userRepo.isExist.mockResolvedValue({
            success: true,
            data: {
                isVerified: false
            },
            statusCode: 200,
        });

        // correct password
        passwordManager.comparePasswords.mockResolvedValue(
            true
        );
    
        // Make a sign-in request
        const response = await supertest(app).post("/v1/auth/user/signIn").send({
            usernameOrEmail: "auvnet",
            password: "12345678",
        });
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Please verify your account first to login"); 
    });

    it("should return status 200 when all are correct", async () => {
        // usernameOrEmail exist and verified
        userRepo.isExist.mockResolvedValue({
            success: true,
            data: {
                isVerified: true
            },
            statusCode: 200,
        });

        // correct password
        passwordManager.comparePasswords.mockResolvedValue(
            true
        );
    
        // Make a sign-in request
        const response = await supertest(app).post("/v1/auth/user/signIn").send({
            usernameOrEmail: "auvnet",
            password: "12345678",
        });
    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Login successfully"); 
    });
});

describe("___verifyOTP___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).post("/v1/auth/user/verify-otp").send({
            email: "xd@example",
            OTP: "123456"
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 404 when email not found", async () => {
        // mock get user to be not found
        userRepo.getUser.mockResolvedValue({
            success: false,
            message: "No user has been found",
            statusCode: 404,
        })
        
        const response = await supertest(app).post("/v1/auth/user/verify-otp").send({
            email: "emad@gmail.com",
            OTP: "123456"
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("There are no account connected to this email");
    });

    it("should return status 401 when the otp is incorrect", async () => {
        // there are user with provided email address
        userRepo.getUser.mockResolvedValue({
            success: true,
            message: "User has been found",
            statusCode: 200,
            data: {
                OTP: "123456"
            }
        })
    
        // verify with wrong otp code
        const response = await supertest(app).post("/v1/auth/user/verify-otp").send({
            email: "emad@gmail.com",
            OTP: "123457"
        });
    
        expect(response.status).toBe(401); 
        expect(response.body.message).toBe("Incorrect OTP code"); 
    });
      
    it("should return status 200 when passwords doesn't match", async () => {
         // there are user with provided email address
         userRepo.getUser.mockResolvedValue({
            success: true,
            message: "User has been found",
            statusCode: 200,
            data: {
                OTP: "123456"
            }
        })

        // mock find and update
        userRepo.findAndUpdate.mockResolvedValue({
            success: true,
            message: "User has been found",
            statusCode: 200,
            data: {
                OTP: "123456"
            }
        })
    
        // verify with correct otp code
        const response = await supertest(app).post("/v1/auth/user/verify-otp").send({
            email: "emad@gmail.com",
            OTP: "123456"
        });
    
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("OTP has been verified correctly!"); 
    });

  
});

describe("___Reset Password___", () => {
    it("should return status 400 when invalid email address", async () => {
        const response = await supertest(app).put("/v1/auth/user/reset-password").send({
            email: "xd@example",
            password: "12345678",
            confirmPassword: "12345678"
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when passwords doesn't match", async () => {
        const response = await supertest(app).put("/v1/auth/user/reset-password").send({
            email: "emad@gmail.com",
            password: "123456789",
            confirmPassword: "12345678"
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 403 when OTP is not null", async () => {
        // mock get user to be not found
        userRepo.findAndUpdate.mockResolvedValue({
            success: false,
            message: "No user has been found",
            statusCode: 404,
        })
        
        const response = await supertest(app).put("/v1/auth/user/reset-password").send({
            email: "emad@gmail.com",
            password: "12345678",
            confirmPassword: "12345678"
        });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("Unauthorized to preform this action");
    });

    it("should return status 201 when email is found and otp is not null", async () => {
        // mock get user to be not found
        userRepo.findAndUpdate.mockResolvedValue({
            success: true,
            message: "User has been found",
            statusCode: 200,
            data: {
                email: "samiemad567@gmail.com"
            }
        })
        
        const response = await supertest(app).put("/v1/auth/user/reset-password").send({
            email: "emad@gmail.com",
            password: "12345678",
            confirmPassword: "12345678"
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Password has been changed successfully");
    });
});