<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - {{ $business_name }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .verification-code {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }
        .code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #6c757d;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .email-container {
                padding: 20px;
            }
            .code {
                font-size: 28px;
                letter-spacing: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">📧 {{ $business_name }}</div>
            <p style="margin: 0; color: #6c757d;">Email Verification Required</p>
        </div>

        <h2 style="color: #2563eb; margin-bottom: 20px;">Hello {{ $name }}!</h2>

        <p>Thank you for contacting us. To ensure the security of our communication and prevent spam, please verify your email address by using the verification code below:</p>

        <div class="verification-code">
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your Verification Code</p>
            <div class="code">{{ $verification_code }}</div>
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">Valid for 10 minutes</p>
        </div>

        <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0;">
                <li>This code is valid for <strong>10 minutes only</strong></li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>You have 3 attempts to enter the correct code</li>
            </ul>
        </div>

        <p>Once verified, we'll process your message and get back to you as soon as possible.</p>

        <div style="text-align: center; margin: 30px 0;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
                Need help? Contact us directly via WhatsApp:
            </p>
            <a href="https://api.whatsapp.com/send?phone=9647514463959&text=Hello%20Haji%20Printing"
               style="display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                💬 WhatsApp Support
            </a>
        </div>

        <div class="footer">
            <p><strong>{{ $business_name }}</strong></p>
            <p>Erbil-Ehsa Street, Near Sarhad Stationery<br>
            Erbil, Kurdistan Region, Iraq</p>
            <p style="font-size: 12px; margin-top: 20px;">
                This is an automated email. Please do not reply to this email address.
            </p>
        </div>
    </div>
</body>
</html>