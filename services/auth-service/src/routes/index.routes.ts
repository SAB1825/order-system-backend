import { Router } from "express";
import { authRoutes } from "./auth.routes";

export const registerRoutes = (app: Router) => {
  app.use("/auth", authRoutes);
};
