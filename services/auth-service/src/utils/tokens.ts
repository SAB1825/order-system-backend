import jwt, { SignOptions } from "jsonwebtoken";

interface Payload {
  userId: string;
  email: string;
}

export const generateTokens = (
  payload: Payload,
  secret: string,
  expiry: SignOptions["expiresIn"],
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};
