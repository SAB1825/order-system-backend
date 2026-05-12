export interface OtpEmailProps {
  otp: string;
  recipientName?: string;
  expiresInMinutes?: number;
}

export const generateOtpEmail = ({
  otp,
  recipientName = "there",
  expiresInMinutes = 10,
}: OtpEmailProps): string => {
  const digits = otp.split("");

  const digitBoxes = digits
    .map(
      (d, i) => `
      <td style="padding: 0 5px;">
        <div style="
          width: 52px; height: 60px;
          background: ${i < 3 ? "#fff5f1" : "#f8f7f4"};
          border: 1.5px solid ${i < 3 ? "#FF6B35" : "#e0ddd5"};
          border-radius: 10px;
          text-align: center; line-height: 60px;
          font-size: 26px; font-weight: 600;
          color: ${i < 3 ? "#FF6B35" : "#1a1a1a"};
          font-family: 'Courier New', monospace;
        ">${d}</div>
      </td>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Swiftbite OTP</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="
        background:#ffffff;
        border-radius:16px;
        border:1px solid #e0ddd5;
        overflow:hidden;
      ">
        <!-- Header -->
        <tr>
          <td style="background:#1a1a1a;padding:28px 40px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="
                width:32px;height:32px;
                background:#FF6B35;border-radius:8px;
                text-align:center;line-height:32px;
                font-size:18px;color:#fff;
                font-weight:700;margin-right:10px;
              ">⚡</td>
              <td style="padding-left:10px;color:#ffffff;font-size:18px;font-weight:500;">
                Swiftbite
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="font-size:22px;font-weight:500;color:#1a1a1a;margin:0 0 8px;">
            Verify your account
          </p>
          <p style="font-size:14px;color:#6b6b68;line-height:1.6;margin:0 0 32px;">
            Hi ${recipientName}, use the one-time password below to complete
            your sign-in. This code confirms it's really you.
          </p>

          <!-- OTP block -->
          <div style="text-align:center;padding:24px 0;">
            <p style="
              font-size:11px;font-weight:500;
              letter-spacing:1.2px;color:#6b6b68;
              text-transform:uppercase;margin:0 0 12px;
            ">Your one-time password</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
              <tr>${digitBoxes}</tr>
            </table>
            <p style="font-size:13px;color:#6b6b68;margin:0;">
              &#x23F0; Expires in <strong>${expiresInMinutes} minutes</strong>
            </p>
          </div>

          <hr style="border:none;border-top:0.5px solid #e8e6e0;margin:0 0 28px;"/>

          <!-- Warning -->
          <table cellpadding="0" cellspacing="0" width="100%" style="
            background:#fffbf0;
            border:0.5px solid #f0d490;
            border-radius:10px;
            padding:14px 18px;
            margin-bottom:28px;
          ">
            <tr>
              <td width="28" valign="top" style="font-size:18px;padding-right:12px;">&#x1F6E1;</td>
              <td style="font-size:13px;color:#7a6010;line-height:1.5;">
                Never share this code with anyone. Swiftbite will never ask
                for your OTP via phone, chat, or email.
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <a href="https://swiftbite.app" style="
            display:block;background:#FF6B35;color:#ffffff;
            text-align:center;padding:14px;border-radius:10px;
            font-size:15px;font-weight:500;text-decoration:none;
            margin-bottom:28px;
          ">Open Swiftbite app</a>

          <hr style="border:none;border-top:0.5px solid #e8e6e0;margin:0 0 20px;"/>

          <!-- Footer -->
          <p style="text-align:center;margin:0 0 8px;">
            <a href="#" style="font-size:12px;color:#9b9993;margin:0 10px;text-decoration:none;">Help centre</a>
            <a href="#" style="font-size:12px;color:#9b9993;margin:0 10px;text-decoration:none;">Privacy policy</a>
            <a href="#" style="font-size:12px;color:#9b9993;margin:0 10px;text-decoration:none;">Unsubscribe</a>
          </p>
          <p style="text-align:center;font-size:12px;color:#b0ada6;margin:0;">
            &copy; 2025 Swiftbite Technologies. All rights reserved.<br/>
            123 Brigade Road, Bengaluru, KA 560001
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};
