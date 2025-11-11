import { Response, NextFunction } from 'express';
import { AuthedRequest } from './auth';

/**
 * Middleware that requires authentication.
 * Must be used after the authenticate middleware.
 * Returns 401 if no user is present on the request.
 */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  next();
}
