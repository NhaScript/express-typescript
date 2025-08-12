import { NextFunction, Request, Response } from "express";
import z from "zod";

export enum ValidationType {
  Body = "body",
  Query = "query",
  Params = "params",
  Headers = "headers",
  Cookies = "cookies",
}

export const validator = (
  schema: z.ZodSchema<any>,
  source: ValidationType = ValidationType.Body
) => {
  return (req: Request, res: Response, next: NextFunction) => {
      const data = schema.parse(req[source] || {});
      Object.assign(req[source], data);
      next();
  };
};

