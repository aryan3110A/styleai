import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests, slow down!',
  // Provide a safe key generator that falls back to headers or socket address
  keyGenerator: (req) => {
    try {
      // Prefer X-Forwarded-For (first value) when behind proxies
      const xff = (req.headers['x-forwarded-for'] as string) || '';
      if (xff) return xff.split(',')[0].trim();
      if ((req as any).ip) return (req as any).ip;
      if (req.socket && req.socket.remoteAddress) return req.socket.remoteAddress;
    } catch (e) {
      // ignore and fall through
    }
    return 'unknown';
  },
});


