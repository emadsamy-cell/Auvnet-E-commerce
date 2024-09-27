exports.otpTemplate = (otp) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .content {
            font-size: 16px;
            color: #333333;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF; /* Blue color scheme */
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.logodesign.net/logo/line-art-buildings-in-swoosh-1273ld.png?nwm=1&nws=1&industry=company&sf=&txt_keyword=All" alt="Company Logo" style="max-width: 100%; height: auto;">
        </div>
        <div class="content">
            <p>Dear user,</p>
            <p>Your OTP code is <span class="otp-code">${otp.value}</span>.</p>
            <p>Please enter this code to complete your verification.</p>
            <p>This OTP is valid for 5 minutes.</p>
        </div>
        <div class="footer">
            <p>Thank you for using our service!</p>
        </div>
    </div>
</body>
</html>
`

exports.forgetTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hi <strong>User</strong>,</p>
        <p>We received a request to reset the password for your account associated with this email address.</p>
        <p>Please use the following One-Time Password (OTP) to complete the password reset process:</p>
        <p class="otp">${otp.value}</p>
        <p>This OTP is valid for the next 5 minutes. If you did not request a password reset, please ignore this email.</p>
        <p>For security reasons, please do not share this OTP with anyone.</p>
        <p>Thank you,<br>The <strong>Auvnet</strong> Team</p>
        <div class="footer">
            <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:[support email]">[support email]</a>.</p>
        </div>
    </div>
</body>
</html>

`;

exports.confirmResetPassword = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Successfully Reset</h2>
        <p>Hi <strong>User</strong>,</p>
        <p>Your password has been successfully reset for your account.</p>
        <p>If you did not initiate this password reset, please contact our support team immediately at <a href="mailto:[support email]">[support email]</a>.</p>
        <p>For security reasons, please ensure your account information is up-to-date and that your password is unique.</p>
        <p>Thank you,<br>The <strong>Auvnet</strong> Team</p>
        <div class="footer">
            <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:[support email]">[support email]</a>.</p>
        </div>
    </div>
</body>
</html>
`