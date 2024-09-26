//OTP sms message which is sent to admin phone
exports.OTPSentForVerificationFormat = (value) => {
    return `Your OTP is: ${value}. Please enter this code to proceed with login. The code will expire in 5 minutes. Do not share this OTP with anyone.`
}

//Success message after sending OTP to admin phone
exports.successLoginResponseFormat = (phoneNumber) => {
    return `An OTP has been sent to your registered phone number ending in \"${phoneNumber.slice(-4)}\". Please check your phone and enter the code to proceed with the login.`
}

exports.emailSentToAdminForAccountCredentials = (userName, password, phoneNumber) => {
    return {
        title: `Your Admin Account Credentials for ${process.env.COMPANY_NAME}`,
        body: `<h3>Welcome to ${process.env.COMPANY_NAME}!</h3> <p>Your admin account has been created. Please find your login details below:</p> <h4>Username: ${userName}</h4> <h4>Password: ${password}</h4> <h4>Phone Number: ${phoneNumber}</h4> <p>Make sure to change your password after your first login for security purposes.</p> <p>If you have any issues, please contact our support team at [Support Email].</p> <hr> <p>Best regards,</p> <p>${process.env.COMPANY_NAME} Team</p>`
    }
}
