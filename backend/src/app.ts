import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { envConfig } from '@/config/env.config';
import { swaggerSpec } from '@/config/swagger';
import { errorHandler } from '@/middleware/errorHandler';
import { rateLimiter } from '@/middleware/rateLimiter';
import { logger } from '@/middleware/logger';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import gameRoutes from '@/routes/games';
import questionRoutes from '@/routes/questions';
import levelRoutes from '@/routes/levels';
import progressRoutes from '@/routes/progress';
import communityRoutes from '@/routes/community';

// Create Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: envConfig.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: envConfig.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
app.use(rateLimiter);

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/levels', levelRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/community', communityRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    data: null
  });
});

// Global error handler
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join game room
  socket.on('join-game', (gameId: string) => {
    socket.join(`game-${gameId}`);
    logger.info(`User ${socket.id} joined game ${gameId}`);
  });

  // Leave game room
  socket.on('leave-game', (gameId: string) => {
    socket.leave(`game-${gameId}`);
    logger.info(`User ${socket.id} left game ${gameId}`);
  });

  // Handle game moves
  socket.on('game-move', (data) => {
    socket.to(`game-${data.gameId}`).emit('game-update', data);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    socket.to(`game-${data.gameId}`).emit('chat-message', {
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

export { app, server, io };