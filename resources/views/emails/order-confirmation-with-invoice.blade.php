<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;font-family:'DejaVu Sans', Arial, sans-serif;background:#f4f4f4;">
    <table width="100%" style="background:#f4f4f4;padding:20px 0;">
        <tr>
            <td align="center">
                <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 8px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);color:white;padding:30px 20px;text-align:center;">
                            <h1 style="margin:0;font-size:24px;">Order Confirmed ✓</h1>
                            <p style="margin:10px 0 0;font-size:16px;opacity:0.9;">Haji Printing</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:30px 20px;">
                            <h2 style="color:#f97316;margin:0 0 15px 0;font-size:18px;">Dear {{ $orderData['customer_name'] ?? 'Customer' }},</h2>

                            <p style="margin:0 0 15px 0;color:#333;font-size:14px;line-height:1.6;">
                                Thank you for your order with Haji Printing! We're pleased to confirm that your order has been successfully processed.
                            </p>

                            <div style="background:#fef3c7;border:2px solid #f97316;border-radius:8px;padding:20px;margin:20px 0;">
                                <h3 style="margin:0 0 10px 0;color:#f97316;font-size:16px;">📄 Invoice Details</h3>
                                <p style="margin:0 0 8px 0;color:#333;font-size:14px;"><strong>Invoice:</strong> {{ $orderData['order_id'] ?? 'N/A' }}</p>
                                <p style="margin:0 0 8px 0;color:#333;font-size:14px;"><strong>Total Amount:</strong> {{ number_format($orderData['grand_total'] ?? 0, 0) }} IQD</p>
                                <p style="margin:0 0 8px 0;color:#333;font-size:14px;"><strong>Payment Status:</strong> {{ ucfirst($orderData['payment_status'] ?? 'pending') }}</p>
                                <p style="margin:0;color:#666;font-size:12px;font-style:italic;">
                                    📎 Your detailed invoice is attached as a PDF for your records.
                                </p>
                            </div>

                            <p style="margin:15px 0;color:#333;font-size:14px;line-height:1.6;">
                                Please find your detailed invoice attached to this email. If you have any questions or need assistance, feel free to contact us.
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
                            <h4 style="margin:0 0 8px;color:#f97316;font-size:16px;">Haji Printing</h4>
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