import { Request, Response, NextFunction } from 'express';

export const notFoundMiddleware = (
  _: Request,
  __: Response,
  next: NextFunction,
) => {
  next({ status: 404, message: 'Not found' });
};
