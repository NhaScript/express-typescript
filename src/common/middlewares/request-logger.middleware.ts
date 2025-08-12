import { Request, Response, NextFunction } from "express";
import dayjs from "dayjs";
import log from "@common/core/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const userInfo = {
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    referer: req.headers['referer'] || req.headers['origin'],
    acceptLanguage: req.headers['accept-language'],
    contentType: req.headers['content-type'],
    accept: req.headers['accept'],
    encoding: req.headers['accept-encoding'],
    connection: req.headers['connection'],
    host: req.headers['host'],
    forwardedFor: req.headers['x-forwarded-for'],
  };

  log.info(userInfo);
  next();
};
