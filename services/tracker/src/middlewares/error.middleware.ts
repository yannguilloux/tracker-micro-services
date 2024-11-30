import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

type CustomError = Error & { status?: number };

export const errorMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(error);
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  res.status(status).json({ error: { status, message } });
};
