import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests, slow down!',
});


