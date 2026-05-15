import { validateRequest } from "@backend/shared/src";
import { Router } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import {
  loginController,
  registerController,
} from "@/controllers/auth.controller";

export const authRoutes = Router();

authRoutes
  .post(
    "/register",
    validateRequest({ body: registerSchema.shape.body }),
    registerController,
  )
  .post(
    "/login",
    validateRequest({ body: loginSchema.shape.body }),
    loginController,
  );
