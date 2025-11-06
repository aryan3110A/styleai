import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export interface AuthedRequest extends Request {
  user?: { uid: string; [k: string]: any };
}

export async function authenticate(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) return next();
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, ...rest } = decoded as any;
    req.user = { uid, ...rest };
  } catch {
    // ignore invalid token
  }
  next();
}


