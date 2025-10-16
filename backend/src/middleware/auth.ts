import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { envConfig } from '@/config/env.config';
import { AuthenticationError, AuthorizationError } from './errorHandler';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'guest' | 'user' | 'admin';
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    const decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;

    // Verify user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.userId).select('-password');

      if (user) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, continue without user if token is invalid
    next();
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError();
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);

export const generateTokens = (user: any) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};