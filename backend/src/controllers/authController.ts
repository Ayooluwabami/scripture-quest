import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { envConfig } from '@/config/env.config';
import { generateTokens } from '@/middleware/auth';
import { AuthenticationError, ValidationError, NotFoundError } from '@/middleware/errorHandler';
import { logger } from '@/middleware/logger';

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, username } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        throw new ValidationError('User with this email or username already exists');
      }

      // Create new user
      const user = new User({
        email,
        password,
        username,
        role: 'user'
      });

      await user.save();

      // Generate tokens
      const tokens = generateTokens(user);

      // Remove password from response
      const userResponse = user.toJSON();

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        data: {
          user: userResponse,
          tokens
        },
        message: 'User registered successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Update last active
      user.stats.lastActive = new Date();
      await user.save();

      // Generate tokens
      const tokens = generateTokens(user);

      // Remove password from response
      const userResponse = user.toJSON();

      logger.info(`User logged in: ${email}`);

      res.json({
        data: {
          user: userResponse,
          tokens
        },
        message: 'Login successful',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AuthenticationError('Refresh token required');
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, envConfig.JWT_SECRET) as any;

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Generate new tokens
      const tokens = generateTokens(user);

      res.json({
        data: { tokens },
        message: 'Token refreshed successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a production app, you might want to blacklist the token
      // For now, we'll just return a success response

      res.json({
        data: null,
        message: 'Logout successful',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.json({
        data: user.toJSON(),
        message: 'User profile retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists or not for security
        res.json({
          data: null,
          message: 'If the email exists, a password reset link has been sent',
          error: null
        });
        return;
      }

      // Generate reset token (in production, save this to database with expiry)
      const resetToken = jwt.sign(
        { userId: user._id, type: 'password-reset' },
        envConfig.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // TODO: Send email with reset link
      logger.info(`Password reset requested for: ${email}`);

      res.json({
        data: { resetToken }, // Remove this in production
        message: 'Password reset link sent to your email',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;

      // Verify reset token
      const decoded = jwt.verify(token, envConfig.JWT_SECRET) as any;

      if (decoded.type !== 'password-reset') {
        throw new AuthenticationError('Invalid reset token');
      }

      // Find user and update password
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      user.password = password;
      await user.save();

      logger.info(`Password reset completed for user: ${user.email}`);

      res.json({
        data: null,
        message: 'Password reset successful',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Google OAuth (placeholder)
   */
  async googleAuth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement Google OAuth
      res.redirect('/auth/google/callback');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Google OAuth callback (placeholder)
   */
  async googleCallback(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement Google OAuth callback
      res.json({
        data: null,
        message: 'Google OAuth not implemented yet',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Facebook OAuth (placeholder)
   */
  async facebookAuth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement Facebook OAuth
      res.redirect('/auth/facebook/callback');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Facebook OAuth callback (placeholder)
   */
  async facebookCallback(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement Facebook OAuth callback
      res.json({
        data: null,
        message: 'Facebook OAuth not implemented yet',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}