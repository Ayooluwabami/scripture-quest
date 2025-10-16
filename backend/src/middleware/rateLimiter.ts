import rateLimit from 'express-rate-limit';
import { envConfig } from '@/config/env.config';

export const rateLimiter = rateLimit({
  windowMs: envConfig.RATE_LIMIT_WINDOW, // 15 minutes by default
  max: envConfig.RATE_LIMIT_MAX, // 100 requests per window
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP, please try again later',
    data: null
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  handler: (_req, res) => {
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later',
      data: null
    });
  }
});

// Stricter rate limiting for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'Too many authentication attempts, please try again later',
    data: null
  },
  skipSuccessfulRequests: true
});