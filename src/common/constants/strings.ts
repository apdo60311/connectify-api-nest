export function getResetPasswordMailHtml(data: Record<string, any>): string {
    return ` <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #333;
    }
    .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    .header {
        background-color: #007BFF;
        padding: 20px;
        text-align: center;
        color: #ffffff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .header h1 {
        margin: 0;
        font-size: 24px;
    }
    .content {
        padding: 20px;
        text-align: center;
    }
    .content h2 {
        font-size: 20px;
        color: #333;
    }
    .content p {
        font-size: 16px;
        line-height: 1.5;
        margin: 20px 0;
    }
    .button {
        display: inline-block;
        background-color: #007BFF;
        color: #ffffff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        margin-top: 20px;
    }
    .button:hover {
        background-color: #0056b3;
    }
    .footer {
        padding: 10px 20px;
        background-color: #f4f4f4;
        text-align: center;
        color: #777;
        font-size: 14px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    .footer a {
        color: #007BFF;
        text-decoration: none;
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Password Reset Request</h1>
    </div>
    <div class="content">
        <h2>Hello,</h2>
        <p>
            We received a request to reset your password. Click the button below to reset it.
            If you did not request a password reset, please ignore this email.
        </p>
        <a href="http://localhost:3000/api/auth/reset-password/${data.token}" class="button">Reset Your Password</a>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p><a href="http://localhost:3000/api/auth/reset-password/${data.token}">http://localhost:3000/auth/reset-password/${data.token}</a></p>
    </div>
    <div class="footer">
        <p>If you have any questions, please contact our support team.</p>
        <p>&copy; {{current_year}} Connectify. All rights reserved.</p>
    </div>
</div>
</body>
</html>
    `.replace('{{current_year}}', new Date().getFullYear().toString());
}

export function getLoginAttemptsWarningEmailHtml(data: Record<string, any>): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Security Alert</h2>
        </div>
        <div class="content">
            <p>Dear {{Username}},</p>
            <p>We detected a suspicious login attempt to your account. For your security, the login has been blocked for one hour.</p>
            <p>If this was you, please wait an hour and try again. If you didn't attempt to log in, we recommend you secure your account by resetting your password and enabling two-factor authentication.</p>
            <p>Thank you for helping us keep your account safe.</p>
            <p>Best regards,<br>The Connectify Team</p>
            <p><strong>Details of the login attempt:</strong></p>
              <ul>
                <li><strong>IP Address:</strong> ${data.deviceInfo.ip}</li>
                <li><strong>Browser:</strong> ${data.deviceInfo.browser}</li>
                <li><strong>Operating System:</strong> ${data.deviceInfo.os}</li>
                <li><strong>Platform:</strong> ${data.deviceInfo.device}</li>
                <li><strong>Time:</strong> ${data.deviceInfo.time}</li>
            </ul>
            <p><strong>Details of the Location:</strong></p>
              <ul>
                <li><strong>Country:</strong> ${data.deviceInfo.location.country}</li>
                <li><strong>City:</strong> ${data.deviceInfo.location.city}</li>
                <li><strong>Region:</strong> ${data.deviceInfo.location.region}</li>
                <li><strong>Postal Code:</strong> ${data.deviceInfo.location.postal}</li>
                <li><strong>Time-zone:</strong> ${data.deviceInfo.location.timezone}</li>
            </ul>
        </div>
        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
`.replace('{{Username}}', data.username ?? 'User');
}
