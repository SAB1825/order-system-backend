import { validateRequest } from "@backend/shared/src";
import { Router } from "express";
import { registerSchema } from "./auth.schema";
import { registerController } from "@/controllers/auth.controller";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  validateRequest({ body: registerSchema.shape.body }),
  registerController,
);
