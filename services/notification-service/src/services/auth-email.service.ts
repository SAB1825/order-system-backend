import { logger } from "../utils/logger";
import { transporter } from "../utils/mailer";
import { env } from "../config/env.config";
import { generateOtpEmail } from "../templates/register.template";

export const registerOtpService = async (
  to: string,
  otp: string,
  recipientName: string,
) => {
  try {
    await transporter.sendMail({
      from: env.GMAIL_APP_USER,
      to,
      subject: `${otp} is your Swiftbite verification code`,
      html: generateOtpEmail({ otp, recipientName, expiresInMinutes: 10 }),
    });
  } catch (error) {
    logger.error({ error }, "Error sending register OTP");
  }
};
