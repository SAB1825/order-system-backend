import jwt from "jsonwebtoken";

interface Payload {
  userId: string;
  email: string;
}

export const generateTokens = (
  payload: Payload,
  secret: string,
  expiry: number,
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};

