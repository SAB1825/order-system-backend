import { login, register } from "@/services/auth.service";
import { AsyncHandler } from "@backend/shared/src";

export const registerController: AsyncHandler = async (req, res) => {
  const payload = req.body;
  const response = await register(payload);
  res.status(200).json({
    status: "Success",
    response: response,
  });
};

export const loginController: AsyncHandler = async (req, res) => {
  const payload = req.body;
  const { accessToken, refreshToken } = await login(payload);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: "Success",
    response: {
      accessToken,
    },
  });
};
