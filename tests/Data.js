// ____________________ Admin Data _____________________________
exports.validMasterToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NGU3NDg1OGMzNmM4NzlkMTZmMmIiLCJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZSI6InN1cGVyQWRtaW4iLCJtYXN0ZXIiOnRydWUsImlhdCI6MTcyNzYyMzg0MiwiZXhwIjoxNzMwMjE1ODQyfQ.yyVvLa81mG-Xkr2o_CeDD0baK4GiKJoKAiREQoGUeyg";
exports.permaSuperAdminId = "66f96cc72cecfcdbd45b48b4"
exports.validAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NTE4OGVlNDRiMmViNTM1MmE4YzIiLCJ1c2VyTmFtZSI6InBlcm1hQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJtYXN0ZXIiOmZhbHNlLCJpYXQiOjE3Mjc2MjE3NzEsImV4cCI6MTczMDIxMzc3MX0.45UhnuFiKlTlmwIgHHUHU9w8p1aMHCweNlTSv_zkHwY"
exports.validSuperAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NGY2NjE2ZmQwMjI5YzQxZWQ3ZDMiLCJ1c2VyTmFtZSI6ImFkbWluMyIsInJvbGUiOiJzdXBlckFkbWluIiwibWFzdGVyIjpmYWxzZSwiaWF0IjoxNzI3NjIzNDM2LCJleHAiOjE3MzAyMTU0MzZ9.6cOQNljb_yNQGoXgTiXqdB1ErKCGvlOElUK9FvVJRvM"
exports.invalidAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY0MTE4ZjM4MWE4OTcyZThmNGRjOTMiLCJ1c2VyTmFtZSI6ImFkbWluMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNzI3Mjc2OSwiZXhwIjoxNzI5ODY0NzY5fQ.p74QsQlN-I5IUQ-hPe_CTDxK8LoVm6zSPiUK0TvObis";
exports.existedAdminUserName = "admin3";
exports.notExistedAdminUserName = "notExistAdmin";
exports.existedAdminEmail = "ahmed.essam7722@gmail.com";
exports.validAdminProfileData = {
    userName: "admin3",
    email: "admin3@gmail.com",
    phoneNumber: "+201115377974"
}
exports.loginAdminDataWithInvalidUserName = {
    userName: "notExistAdmin",
    password: "admin",
}
exports.loginAdminDataWithInvalidPassword = {
    userName: "admin",
    password: "admin123",
}
exports.validAdminLoginData = {
    userName: "admin",
    password: "admin",
}
exports.knownAdminOTP = { value: 123456, expiresAt: Date.now() + 300000 }
exports.token = "sample_token";
exports.validNewAccountData = {
    userName: "newAccount",
    email: "newAccount@gmail.com",
    phoneNumber: "+201115377974",
    password: "Admin@123"
}
exports.newAccountDataWithInvalidEmail = {
    userName: "newAccount",
    email: "ahmed.essam7722@gmail.com",
    phoneNumber: "+201115377974",
    password: "Admin@123"
}
exports.newAccountDataWithInvalidUserName = {
    userName: "admin",
    email: "ahmed.essam7722@gmail.com",
    phoneNumber: "+201115377974",
    password: "Admin@123"
}
exports.invalidEmail = "invalidEmail";
exports.validAdminId = "66f95188ee44b2eb5352a8c2";

// ########################### User ###########################
exports.passwordCorrect = "12345678";
exports.passwordIncorrect = "1234567";
exports.emailValid = "emad@gmail.com";
exports.emailInvalid = "emad@example";
exports.nameValid = "emad";
exports.userNameValid = "kolayr";
exports.notMatch = false;
exports.match = true;
exports.OTPValid = "123456";
exports.OTPInvalid = "1234567";
exports.verified = true;
exports.notVerified = false;


exports.exist = (data) => { 
    return {
        success: true,
        statusCode: 200,
        message: 'User has been found!',
        error: null,
        data
    }
};

exports.notExist = { 
    success: false,
    statusCode: 404,
    message: "User not found",
    data: null,
    error: null
};

exports.createUser = { 
    success: true,
    statusCode: 201,
    message: "User has been created Successfully"
};


