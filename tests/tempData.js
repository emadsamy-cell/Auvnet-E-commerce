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

// ########################### User ###########################

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


