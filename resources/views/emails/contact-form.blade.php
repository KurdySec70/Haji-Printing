<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #6996EE, #5A8BFF);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .field {
            margin-bottom: 15px;
        }
        .field-label {
            font-weight: bold;
            color: #555;
        }
        .field-value {
            background: white;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #6996EE;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ isset($verified) && $verified ? '✅ Verified' : '' }} Contact Form Submission</h1>
        <p>{{ $businessName }}</p>
        @if(isset($verified) && $verified)
            <p style="font-size: 14px; opacity: 0.9;">🔒 Email address verified by sender</p>
        @endif
    </div>

    <div class="content">
        <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">{{ $name }}</div>
        </div>

        @if(isset($phone))
        <div class="field">
            <div class="field-label">Phone:</div>
            <div class="field-value">{{ $phone }}</div>
        </div>
        @endif

        <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">
                {{ $email }}
                @if(isset($verified) && $verified)
                    <span style="color: #28a745; font-weight: bold; margin-left: 10px;">✅ Verified</span>
                @endif
            </div>
        </div>

        <div class="field">
            <div class="field-label">Subject:</div>
            <div class="field-value">{{ $subject }}</div>
        </div>

        <div class="field">
            <div class="field-label">Message:</div>
            <div class="field-value">{{ $messageContent }}</div>
        </div>

        @if(isset($ip_address) || isset($timestamp))
        <div class="field">
            <div class="field-label">Additional Information:</div>
            <div class="field-value" style="font-size: 12px; color: #666;">
                @if(isset($timestamp))
                    <strong>Time:</strong> {{ $timestamp }}<br>
                @endif
                @if(isset($ip_address))
                    <strong>IP Address:</strong> {{ $ip_address }}<br>
                @endif
                @if(isset($verified) && $verified)
                    <strong>Status:</strong> Email verified by sender
                @endif
            </div>
        </div>
        @endif
    </div>
    
    <div class="footer">
        <p>This message was sent from your website contact form.</p>
        <p>Reply directly to this email to respond to {{ $name }}.</p>
    </div>
</body>
</html>
