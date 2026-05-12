import { getRedisClient } from "@/config/redis.config";
import crypto from "crypto";

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = 600;

export const generateOtp = (): string => {
  // cryptographically secure — never use Math.random() for OTPs
  return crypto
    .randomInt(0, 10 ** OTP_LENGTH)
    .toString()
    .padStart(OTP_LENGTH, "0");
};

export const storeOTP = async (userId: string, otp: string) => {
  const key = `otp:${userId}`;

  const hashed = crypto.createHash("sha256").update(otp).digest("hex");
  const redis = getRedisClient();

  await redis.set(key, hashed, "EX", OTP_TTL_SECONDS);
};
