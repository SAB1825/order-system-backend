import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { HttpError } from "../error/http-error";

type Schema = ZodTypeAny;
type ParamsRecord = Record<string, string>;
type QueryRecode = Record<string, unknown>;

export interface RequestValidationSchema {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

const formatedError = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

export const validateRequest = (schemas: RequestValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const parseBody = schemas.body.parse(req.body) as unknown;
        req.body = parseBody;
      }
      if (schemas.params) {
        const parsedParams = schemas.params.parse(req.params) as ParamsRecord;
        req.params = parsedParams as Request["params"];
      }
      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query) as QueryRecode;
        req.query = parsedQuery as Request["query"];
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new HttpError(400, "Validation error", {
            issues: formatedError(error),
          }),
        );
        return;
      }
    }
  };
};
