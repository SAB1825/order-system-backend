import { register } from "@/services/auth.service";
import { AsyncHandler } from "@backend/shared/src";

export const registerController: AsyncHandler = async (req, res) => {
  const payload = req.body;
  const response = await register(payload);
  res.status(200).json({
    message: "Success",
    response: response,
  });
};
