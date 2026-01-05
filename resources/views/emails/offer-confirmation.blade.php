<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Price Offer</title>
</head>
<body style="margin:0;padding:0;font-family:'DejaVu Sans', Arial, sans-serif;background:#f4f4f4;">
    <table width="100%" style="background:#f4f4f4;padding:20px 0;">
        <tr>
            <td align="center">
                <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 8px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#F59E0B 0%,#D97706 100%);color:white;padding:30px 20px;text-align:center;">
                            <h1 style="margin:0;font-size:24px;">Price Offer 💰</h1>
                            <p style="margin:10px 0 0;font-size:16px;opacity:0.9;">Haji Printing</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:30px 20px;">
                            <h2 style="color:#F59E0B;margin:0 0 15px 0;font-size:18px;">Dear {{ $orderData['customer_name'] ?? 'Customer' }},</h2>

                            <p style="margin:0 0 15px 0;color:#333;font-size:14px;line-height:1.6;">
                                Thank you for your interest in our printing services! We're pleased to provide you with a detailed price offer for your requirements.
                            </p>

                            <div style="background:#fef3c7;border:2px solid #F59E0B;border-radius:8px;padding:20px;margin:20px 0;">
                                <h3 style="margin:0 0 10px 0;color:#F59E0B;font-size:16px;">📊 Offer Details</h3>
                                <p style="margin:0 0 8px 0;color:#333;font-size:14px;"><strong>Offer #:</strong> {{ $orderData['order_id'] ?? 'N/A' }}</p>
                                <p style="margin:0 0 8px 0;color:#333;font-size:14px;"><strong>Total Amount:</strong> {{ number_format($orderData['grand_total'] ?? 0, 0) }} IQD</p>
                                <p style="margin:0 0 8px 0;color:#333;font-size:14px;"><strong>Status:</strong> Pending Approval</p>
                                <p style="margin:0;color:#666;font-size:12px;font-style:italic;">
                                    📎 Detailed price breakdown is attached as a PDF for your review.
                                </p>
                            </div>

                            <div style="background:#e0f2fe;border-left:4px solid #0ea5e9;padding:15px;margin:20px 0;">
                                <h4 style="margin:0 0 8px 0;color:#0369a1;font-size:14px;">📞 Next Steps:</h4>
                                <ul style="margin:0;padding-left:18px;color:#333;font-size:13px;line-height:1.5;">
                                    <li>Review the attached price breakdown</li>
                                    <li>Contact us to discuss any modifications</li>
                                    <li>Confirm your order to proceed with production</li>
                                </ul>
                            </div>

                            <p style="margin:15px 0;color:#333;font-size:14px;line-height:1.6;">
                                This offer is valid for 30 days from the date of issue. Please don't hesitate to contact us if you have any questions or would like to discuss the details.
                            </p>

                            <p style="margin:20px 0 0 0;color:#333;font-size:14px;line-height:1.6;">
                                <strong>Best regards,</strong><br>
                                The Haji Printing Team
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#fef3c7;padding:20px;text-align:center;border-top:1px solid #e2e8f0;">
                            <h4 style="margin:0 0 8px;color:#F59E0B;font-size:16px;">Haji Printing</h4>
                            <p style="margin:0;color:#666;font-size:12px;">📞 0751 446 39 59 | ✉️ info@hajiprinting.com</p>
                            <p style="margin:5px 0 0;color:#666;font-size:12px;">📍 Erbil-Ehsa Street, Near Sarhad Stationery</p>
                            <p style="margin:8px 0 0;color:#999;font-size:11px;">"Quality Printing Solutions for Your Business Success"</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>