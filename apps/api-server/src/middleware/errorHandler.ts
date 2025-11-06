import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err);
  const message = err?.message || 'Internal Server Error';
  res.status(500).json({ error: 'Internal Server Error', details: message });
}


