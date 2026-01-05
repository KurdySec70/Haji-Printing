<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Quote Request - Haji Printing</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #6996EE 0%, #5A8BFF 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .quote-info {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #6996EE;
        }
        .info-row {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .info-label {
            font-weight: 600;
            color: #555;
            min-width: 120px;
            margin-right: 15px;
        }
        .info-value {
            flex: 1;
            color: #333;
        }
        .project-details {
            background-color: #ffffff;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .project-details h3 {
            margin: 0 0 15px 0;
            color: #6996EE;
            font-size: 18px;
            font-weight: 600;
        }
        .project-details p {
            margin: 0;
            line-height: 1.7;
            color: #555;
            white-space: pre-wrap;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        .timestamp {
            color: #999;
            font-size: 12px;
            margin-top: 10px;
        }
        .contact-info {
            background-color: #e3f2fd;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }
        .contact-info h4 {
            margin: 0 0 10px 0;
            color: #1976d2;
            font-size: 16px;
        }
        .contact-info p {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🖨️ New Quote Request</h1>
            <p>Haji Printing - Professional Printing Services</p>
        </div>
        
        <div class="content">
            <div class="quote-info">
                <h3 style="margin: 0 0 20px 0; color: #6996EE; font-size: 20px;">📋 Customer Information</h3>
                
                <div class="info-row">
                    <div class="info-label">👤 Name:</div>
                    <div class="info-value">{{ $quoteData['name'] }}</div>
                </div>
                
                <div class="info-row">
                    <div class="info-label">📧 Email:</div>
                    <div class="info-value">
                        <a href="mailto:{{ $quoteData['email'] }}" style="color: #6996EE; text-decoration: none;">
                            {{ $quoteData['email'] }}
                        </a>
                    </div>
                </div>
                
                @if(!empty($quoteData['phone']))
                <div class="info-row">
                    <div class="info-label">📞 Phone:</div>
                    <div class="info-value">
                        <a href="tel:{{ $quoteData['phone'] }}" style="color: #6996EE; text-decoration: none;">
                            {{ $quoteData['phone'] }}
                        </a>
                    </div>
                </div>
                @endif
                
                <div class="info-row">
                    <div class="info-label">📅 Date:</div>
                    <div class="info-value">{{ $quoteData['submitted_at'] }}</div>
                </div>
            </div>
            
            <div class="project-details">
                <h3>📝 Project Details</h3>
                <p>{{ $quoteData['message'] }}</p>
            </div>
            
            <div class="contact-info">
                <h4>💡 Next Steps</h4>
                <p>• Review the project requirements above</p>
                <p>• Contact the customer within 24 hours</p>
                <p>• Provide a detailed quote based on their needs</p>
                <p>• Follow up on the quote within 48 hours</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Haji Printing</strong> - Professional Printing Services</p>
            <p>📍 Erbil, Kurdistan Region, Iraq</p>
            <p>📞 +964 7514463959 | +964 7514473959</p>
            <p>📧 info@hajiprinting.com</p>
            <div class="timestamp">
                Quote request submitted on {{ $quoteData['submitted_at'] }}
            </div>
        </div>
    </div>
</body>
</html>
