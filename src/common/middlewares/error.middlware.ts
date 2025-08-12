import { ApiError } from "@common/core/api-error";
import log from "@common/core/logger";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    log.error(`[${err.type}] ${err.message}`);
    res.status(err.statusCode).json({
      error: err.type,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "ValidationError",
      message: "Validation failed",
      details: err.issues.map((e) => ({
        field: e.path.filter(p => p !== 0).join('.') ?? 'unknow',
        message: e.message,
      })),
    });
    return;
  }
  
  log.error(`[Internal] ${err.stack || err}`);
  // log.error(`[Internal] ${err.message || err}`);
  res.status(500).json({
    error: "Internal",
    message: "Something went wrong",
  });
}
