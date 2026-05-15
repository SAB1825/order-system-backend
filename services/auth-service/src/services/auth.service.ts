import { env } from "@/config/env.config";
import { publishUserRegister } from "@/messaging/event-publishing";
import { userCredential } from "@/models";
import { AuthResponse, loginInput, registerInput } from "@/types/auth";
import { checkPasword, hashPassword } from "@/utils/bcrypt";
import { generateOtp, storeOTP } from "@/utils/otp";
import { generateTokens } from "@/utils/tokens";
import { HttpError } from "@backend/shared";

export const register = async (input: registerInput): Promise<AuthResponse> => {
  const existingUser = await userCredential.findOne({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new HttpError(400, "User with this email already exists.");
  }

  const hashedPassword = await hashPassword(input.password);

  const userRecord = await userCredential.create({
    name: input.name,
    email: input.email,
    password_hash: hashedPassword,
  });

  const userResponse = {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    email_verified: userRecord.email_verified,
  };

  const otp = generateOtp();
  await storeOTP(userRecord.id, otp);

  publishUserRegister({
    name: userRecord.name,
    email: userRecord.email,
    createdAt: userRecord.createdAt.toISOString(),
    otp: otp,
    id: userRecord.id,
  });

  return {
    user: userResponse,
  };
};

export const login = async (input: loginInput) => {
  const user = await userCredential.findOne({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new HttpError(404, "User with this email not found");
  }

  const isPassCorrect = checkPasword(input.password, user.password_hash);

  if (!isPassCorrect) {
    throw new HttpError(401, "Incorrect Password.");
  }

  //TODO: IMPLEMENT TOKEN GENERATION

  const accessToken = generateTokens(
    {
      userId: user.id,
      email: user.email,
    },
    env.ACCESS_TOKEN_SECRET,
    "15m",
  );

  const refreshToken = generateTokens(
    {
      userId: user.id,
      email: user.email,
    },
    env.REFRESH_TOKEN_SECRET,
    "7d",
  );

  return {
    refreshToken,
    accessToken,
  };
};
