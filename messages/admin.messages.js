//OTP sms message which is sent to admin phone
exports.verificationOtp = (value) => {
    return `Your OTP is: ${value}. Please enter this code to proceed with login. The code will expire in 5 minutes. Do not share this OTP with anyone.`
}

//Success message after sending OTP to admin phone
exports.successfulLogin = (phoneNumber) => {
    return `An OTP has been sent to your registered phone number ending in \"${phoneNumber.slice(-4)}\". Please check your phone and enter the code to proceed with the login.`
}


