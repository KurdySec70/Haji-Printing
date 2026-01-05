<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Thank you for contacting us</title>
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
        .message {
            background: white;
            padding: 20px;
            border-radius: 4px;
            border-left: 4px solid #6996EE;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
        .contact-info {
            background: #e8f2ff;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Contacting Us!</h1>
        <p>{{ $businessName }}</p>
    </div>
    
    <div class="content">
        <p>Dear {{ $name }},</p>
        
        <div class="message">
            <p>Thank you for reaching out to us! We have received your message regarding "<strong>{{ $subject }}</strong>" and will get back to you as soon as possible.</p>
            
            <p>We typically respond within 24 hours during business days. If you have any urgent inquiries, please don't hesitate to contact us directly.</p>
        </div>
        
        <div class="contact-info">
            <h3>Your Message Details:</h3>
            <p><strong>Subject:</strong> {{ $subject }}</p>
            <p><strong>Message:</strong> {{ $messageContent }}</p>
        </div>
        
        <p>Best regards,<br>
        The {{ $businessName }} Team</p>
    </div>
    
    <div class="footer">
        <p>This is an automated confirmation email.</p>
        <p>If you have any questions, please contact us at {{ $businessEmail }}</p>
    </div>
</body>
</html>
