// ########################### User ###########################
const validPassword = "12345678";
const invalidPassword = "1234567";
const incorrectPassword = "notCorrectPassword"
const validEmail = "samiemad567@gmail.com";
const validSecondEmail = "auvnet1@gmail.com";
const invalidEmail = "emad.com";
const incorrectEmail = "notEmad@gamil.com"
const validOTPValue = "123456";
const invalidOTPValue = "123455";
const validUserName = "emad";
const validSecondUserName = "Auvnet";
const invalidUserName = "notEmad";
const validCity = "Cairo";
const validCountry = "Egypt";
const validRegion = "Maadi";
const validLatitude = '30.0444';
const validLongitude = '31.2357';
const invalidLatitude = '100';
const invalidLongitude = '200';
const validPhoneNumber = "01000000000";
const invalidPhoneNumber = "Text";
const invalidPhoneNumberLength = "0100000000";
const validGender = "Male";
const invalidGender = "notGender";

exports.validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5ODBkOWUwOWM3YTYwY2YwOTgyZmUiLCJ1c2VyTmFtZSI6ImVtYWQiLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNzYyNzYzMiwiZXhwIjoxNzMwMjE5NjMyfQ.Ufh0Qtnqik1-TO-sfU5UYfgZmxnGXCPVczru442ET38" 
exports.inValidToken = "invalid"

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

// ____________________ Sign Up _____________________________

exports.validUserSignUpData = {
    name: validUserName,
    userName: validUserName,
    email: validEmail,
    password: validPassword,
    confirmPassword: validPassword,
};

exports.validSecondUserSignUpData = {
    name: validUserName,
    userName: validSecondUserName,
    email: validSecondEmail,
    password: validPassword,
    confirmPassword: validPassword,
};

exports.invalidEmailUserSignUpData = {
    name: validUserName,
    userName: validUserName,
    email: invalidEmail,
    password: validPassword,
    confirmPassword: validPassword,
};

exports.invalidPasswordMatchUserSignUpData = {
    name: validUserName,
    userName: validUserName,
    email: validEmail,
    password: validPassword,
    confirmPassword: "123456788",
};

exports.invalidPasswordLengthUserSignUpData = {
    name: validUserName,
    userName: validUserName,
    email: validEmail,
    password: invalidPassword,
    confirmPassword: invalidPassword,
};

exports.missingFieldUserSignUpData = {
    name: validUserName,
    userName: validUserName,
    password: invalidPassword,
    confirmPassword: invalidPassword,
};

exports.duplicateUserNameUserSignUpData = {
    name: validUserName,
    userName: validUserName,
    email: "notEmad@gmail.com",
    password: validPassword,
    confirmPassword: validPassword,
};

exports.duplicateEmailUserSignUpData = {
    name: validUserName,
    userName: "notEmad",
    email: validEmail,
    password: validPassword,
    confirmPassword: validPassword,
};

// ____________________ Verification OTP _____________________________
exports.OTPValid = {
    value: validOTPValue,
    expiresAt: Date.now() + 300000
};

exports.expiredOTP = {
    OTP: validOTPValue,
    expiresAt: Date.now() - 300000
};

exports.invalidEmailVerification = {
    email: invalidEmail,
    OTP: validOTPValue
};

exports.invalidOTPVerification = {
    email: validEmail,
    OTP: invalidOTPValue
};

exports.validOTPVerification = {
    email: validEmail,
    OTP: validOTPValue
};

// ____________________ Send OTP Code To Email _____________________________
exports.validEmailAddress = {
    email: validEmail
};

exports.invalidEmailAddress = {
    email: invalidEmail
};

exports.incorrectEmailAddress = {
    email: incorrectEmail,
};

// ____________________ Reset Password _____________________________
exports.validResetPasswordData = {
    email: validEmail,
    password: validPassword,
    confirmPassword: validPassword
};

exports.invalidResetPasswordData = {
    email: validEmail,
    password: invalidPassword,
    confirmPassword: invalidPassword
};

exports.invalidResetPasswordMatchData = {
    email: validEmail,
    password: validPassword,
    confirmPassword: incorrectPassword
};

exports.invalidResetPasswordEmailData = {
    email: invalidEmail,
    password: validPassword,
    confirmPassword: validPassword
};

// ____________________ Sign In _____________________________

exports.validEmailSignInData = {
    email: validEmail,
    password: validPassword
};

exports.validUserNameSignInData = {
    userName: validUserName,
    password: validPassword
};

exports.invalidPasswordUserSignInData = {
    email: validEmail,
    password: invalidPassword
};

exports.invalidUserNameSignInData = {
    userName: invalidUserName,
    password: validPassword
};

exports.invalidEmailAddressSignInData = {
    email: invalidEmail,
    password: validPassword
};

exports.missingEmailSignInData = {
    password: validPassword
};

exports.missingPasswordSignInData = {
    email: validEmail
};

exports.incorrectEmailSignInData = {
    email: incorrectEmail,
    password: validPassword
};

exports.incorrectUsernameSignInData = {
    userName: incorrectEmail,
    password: validPassword
};

exports.incorrectPasswordSignInData = {
    email: validEmail,
    password: incorrectPassword
};

exports.unVerifiedUserSignInData = {
    email: validSecondEmail,
    password: validPassword
};

// ____________________ Update User Profile _____________________________
exports.validUpdateUserProfileData = {
    name: validUserName,
    phone: validPhoneNumber,
    city: validCity,
    country: validCountry,
    region: validRegion,
    latitude: validLatitude,
    longitude: validLongitude,
    gender: validGender
};

exports.invalidPhoneUpdateUserProfileData = {
    phone: invalidPhoneNumber,
};

exports.invalidPhoneLengthUpdateUserProfileData = {
    phone: invalidPhoneNumberLength,
};

exports.invalidGenderUpdateUserProfileData = {
    gender: invalidGender
};

exports.invalidLatitudeUpdateUserProfileData = {
    latitude: invalidLatitude,
    longitude: validLongitude
}

exports.invalidLongitudeUpdateUserProfileData = {
    latitude: validLatitude,
    longitude: invalidLongitude
};

exports.onlyLatitudeUpdateUserProfileData = {
    latitude: validLatitude
};

exports.onlyLongitudeUpdateUserProfileData = {
    longitude: validLongitude
};

// ____________________ Change Password _____________________________
exports.validChangePasswordData = {
    currentPassword: validPassword,
    newPassword: validPassword,
    confirmPassword: validPassword
};

exports.invalidCurrentPasswordChangePasswordData = {
    currentPassword: invalidPassword,
    newPassword: validPassword,
    confirmPassword: validPassword
};

exports.missingNewPasswordChangePasswordData = {
    currentPassword: validPassword,
    confirmPassword: validPassword
};

exports.invalidConfirmPasswordNewPasswordData = {
    currentPassword: validPassword,
    newPassword: validPassword,
    confirmPassword: incorrectPassword
};

exports.incorrectCurrentPasswordChangePasswordData = {
    currentPassword: incorrectPassword,
    newPassword: validPassword,
    confirmPassword: validPassword
};