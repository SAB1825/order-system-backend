import { HttpError } from "@backend/shared";

import type { ErrorRequestHandler } from "express";
import { logger } from "@/utils/logger";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error({ err }, "Unhandled error occured");

  const error = err instanceof HttpError ? err : undefined;
  const statuCode = error?.statusCode ?? 500;
  const message =
    statuCode >= 500
      ? "Internal Server Error"
      : (error?.message ?? "Unkown Error");

  const payload = error?.details
    ? { message, details: error.details }
    : { message };

  res.status(statuCode).json(payload);

  void _next();
};