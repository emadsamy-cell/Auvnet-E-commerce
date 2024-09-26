// ____________________ Admin Data _____________________________
exports.validAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY1NDU2ODMxYWMxZmJiNmUzZGEzYzgiLCJ1c2VyTmFtZSI6InRlc3R0dGFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI3MzU5MDIxLCJleHAiOjE3Mjk5NTEwMjF9._7oSlUkU2LfZ2iWwrF73WL-DVQC7hwl2378aIOlODzA";
exports.invalidAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY0MTE4ZjM4MWE4OTcyZThmNGRjOTMiLCJ1c2VyTmFtZSI6ImFkbWluMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNzI3Mjc2OSwiZXhwIjoxNzI5ODY0NzY5fQ.p74QsQlN-I5IUQ-hPe_CTDxK8LoVm6zSPiUK0TvObis";
exports.existedAdminUserName = "testAdmin";
exports.notExistedAdminUserName = "notExistAdmin";
exports.existedAdminEmail = "ahmed.essam7722@gmail.com";
exports.validAdminProfileData = {
    userName: "testttadmins",
    email: "newAccountttt@gmail.com",
    phoneNumber: "01000000000",
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


