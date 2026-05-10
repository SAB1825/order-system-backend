import { publishUserRegister } from "@/messaging/event-publishing";
import { userCredential } from "@/models";
import { AuthResponse, registerInput } from "@/types/auth";
import { hashPassword } from "@/utils/bcrypt";
import { logger } from "@/utils/logger";
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

  publishUserRegister({
    name: userRecord.name,
    email: userRecord.email,
    createdAt: userRecord.createdAt.toISOString(),
    id: userRecord.id,
  });

  return {
    user: userResponse,
  };
};
