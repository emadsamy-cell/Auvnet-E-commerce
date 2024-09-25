const { generate } = require('otp-generator');

exports.otpGenerator = () => {
    const OTP = generate(6, {
        digits: true,
        alphabets: true,
        upperCase: false,
        specialChars: false,
    });

    return OTP;
}