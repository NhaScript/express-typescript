import { Request, Response, NextFunction } from 'express';

function sanitize(obj: any): void {
  if (typeof obj !== 'object' || obj === null) return;

  for (const key in obj) {
    // If the key contains MongoDB operators or prototype pollution
    if (key.includes('$') || key.includes('.') || key === '__proto__') {
      delete obj[key];
    } else {
      // Recursively sanitize nested objects
      sanitize(obj[key]);
    }
  }
}

export function sanitizeRequest(req: Request, res: Response, next: NextFunction) {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
}
