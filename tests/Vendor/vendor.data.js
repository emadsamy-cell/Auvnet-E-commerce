const activeValidUserName = "3omda";
const inactiveValidUserName = "inActiveAccount";
const deletedAccountUserName = 'deletedAccount';
const inCorrectUserName = "Incorrect User Name";
const invalidUserName = null;
const activeEmailAddress = "samiemad567@gmail.com";
const inactiveEmailAddress = "auvnet1@gmail.com";
const deletedAccountEmailAddress = "deleted@gmail.com";
const invalidEmailAddress = "emad.com";
const incorrectEmailAddress = "Incorrect_Email@gmail.com";
const validPassword = "12345678";
const invalidPassword = "123456";
const inCorrectPassword = "Incorrect Password";
const validConfirmPassword = "12345678"
const inValidConfirmPassword = "123456";
const validOTP = "123456";
const invalidOTP = "1";
const inCorrectOTP = "12345";
const newAccountUsername = "newVendor";
const newAccountPassword = "Vendor@123";
const newAccountEmail = "a.essam192000@gmail.com";
const newAccountName = "Ahmed Essam";

exports.accessToken;
exports.inValidToken = "Invalid_Token";
exports.validMasterToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NGU3NDg1OGMzNmM4NzlkMTZmMmIiLCJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZSI6InN1cGVyQWRtaW4iLCJtYXN0ZXIiOnRydWUsImlhdCI6MTcyODI0NTc3MywiZXhwIjoxNzI4Mjc0NTczfQ.V15Dm_dd5qX3BnlwnVdE5HsnqkGYfCj5hGZNfffNp-Y";
exports.validAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NGY2NjE2ZmQwMjI5YzQxZWQ3ZDMiLCJ1c2VyTmFtZSI6ImFkbWluMyIsInJvbGUiOiJzdXBlckFkbWluIiwibWFzdGVyIjpmYWxzZSwiaWF0IjoxNzI4Mjk2Mjk3LCJleHAiOjE3MjgzMjUwOTd9.EVvO_WsYIt4Slkk4_o89yVj5NuDtYebeSDhTa4QRw64";
exports.existUsername = "vendor";
exports.existEmail = "vendor@gmail.com";
exports.vendorId = "6703cf5d5ad8ede415368389"

// ____________________________________Sign In____________________________________
exports.validSignIn = {
    userName: activeValidUserName,
    password: validPassword
};

exports.missingUserNameSignIn = {
    password: validPassword
}

exports.missingPasswordSignIn = {
    userName: activeValidUserName
}

exports.invalidUserNameSignIn = {
    userName: invalidUserName,
    password: validPassword
}

exports.invalidPasswordSignIn = {
    userName: activeValidUserName,
    password: invalidPassword
}

exports.inCorrectUserNameSignIn = {
    userName: inCorrectUserName,
    password: validPassword
}

exports.inCorrectPasswordSignIn = {
    userName: activeValidUserName,
    password: inCorrectPassword
}


exports.inactiveAccountSignIn = {
    userName: inactiveValidUserName,
    password: validPassword
}

exports.deletedAccountSignIn = {
    userName: deletedAccountUserName,
    password: validPassword
}

// ____________________________________Verify OTP____________________________________
exports.validVerifyOTP = {
    email: activeEmailAddress,
    OTP: validOTP
}

exports.missingEmailVerifyOTP = {
    OTP: validOTP
}

exports.missingOTPVerifyOTP = {
    email: activeEmailAddress
}

exports.invalidEmailVerifyOTP = {
    email: invalidEmailAddress,
    OTP: validOTP
}

exports.invalidOTPVerifyOTP = {
    email: activeEmailAddress,
    OTP: invalidOTP
}

exports.inCorrectEmailVerifyOTP = {
    email: incorrectEmailAddress,
    OTP: validOTP
}

exports.inCorrectOTPVerifyOTP = {
    email: activeEmailAddress,
    OTP: inCorrectOTP
}

exports.inactiveAccountVerifyOTP = {
    email: inactiveEmailAddress,
    OTP: validOTP
}

exports.deletedAccountVerifyOTP = {
    email: deletedAccountEmailAddress,
    OTP: validOTP
}

exports.expiredOTP = {
    value : validOTP,
    expiresAt: Date.now() - 300000
}

exports.OTPValid = {
    value: validOTP,
    expiresAt: Date.now() + 300000
}

// ____________________________________Forget Password____________________________________
exports.validForgetPassword = {
    email: activeEmailAddress
}

exports.missingEmailForgetPassword = {
}

exports.invalidEmailForgetPassword = {
    email: invalidEmailAddress
}

exports.inCorrectEmailForgetPassword = {
    email: incorrectEmailAddress
}

exports.inactiveAccountForgetPassword = {
    email: inactiveEmailAddress
}

exports.deletedAccountForgetPassword = {
    email: deletedAccountEmailAddress
}


// ____________________________________Reset Password____________________________________
exports.validResetPassword = {
    email: activeEmailAddress,
    password: validPassword,
    confirmPassword: validConfirmPassword
}

exports.missingEmailResetPassword = {
    password: validPassword,
    confirmPassword: validConfirmPassword
}

exports.missingPasswordResetPassword = {
    email: activeEmailAddress,
    confirmPassword: validConfirmPassword
}

exports.missingConfirmPasswordResetPassword = {
    email: activeEmailAddress,
    password: validPassword
}

exports.invalidEmailResetPassword = {
    email: invalidEmailAddress,
    password: validPassword,
    confirmPassword: validConfirmPassword
}

exports.invalidPasswordResetPassword = {
    email: activeEmailAddress,
    password: invalidPassword,
    confirmPassword: validConfirmPassword
}

exports.inCorrectEmailResetPassword = {
    email: incorrectEmailAddress,
    password: validPassword,
    confirmPassword: validConfirmPassword
}

exports.inCorrectMatchResetPassword = {
    email: activeEmailAddress,
    password: validPassword,
    confirmPassword: inValidConfirmPassword
}

exports.inactiveAccountResetPassword = {
    email: inactiveEmailAddress,
    password: validPassword,
    confirmPassword: validConfirmPassword
}

exports.deletedAccountResetPassword = {
    email: deletedAccountEmailAddress,
    password: validPassword,
    confirmPassword: validConfirmPassword
}

// ____________________________________Create Account____________________________________
exports.validNewAccountData = {
    name: newAccountName,
    userName: newAccountUsername,
    email: newAccountEmail,
    password: newAccountPassword,
}