// import { Game } from '@/models/Game';
import { Question } from '@/models/Question';
import { User } from '@/models/User';
import { NotFoundError, AppError } from '@/middleware/errorHandler';
import { logger } from '@/middleware/logger';

interface GameSession {
  id: string;
  gameId: string;
  players: string[];
  currentQuestion: number;
  questions: any[];
  scores: { [playerId: string]: number };
  timeRemaining: number;
  status: 'waiting' | 'playing' | 'finished';
  startedAt?: Date;
  settings: any;
}

export class GameService {
  private activeSessions: Map<string, GameSession> = new Map();

  /**
   * Create a new game session
   */
  async createGameSession(game: any, userId: string): Promise<GameSession> {
    try {
      // Get random questions for the game
      const questions = await Question.aggregate([
        {
          $match: {
            gameTypes: { $in: [game.type] },
            isActive: true
          }
        },
        { $sample: { size: 10 } }
      ]);

      if (questions.length === 0) {
        throw new NotFoundError('No questions available for this game type');
      }

      // Create session
      const sessionId = this.generateSessionId();
      const session: GameSession = {
        id: sessionId,
        gameId: game._id.toString(),
        players: [userId],
        currentQuestion: 0,
        questions: questions.map(q => ({
          ...q,
          // Hide correct answer from client
          correctAnswer: q.answer,
          answer: undefined
        })),
        scores: { [userId]: 0 },
        timeRemaining: game.timeLimit || 600, // 10 minutes default
        status: 'waiting',
        settings: game.settings
      };

      this.activeSessions.set(sessionId, session);

      logger.info(`Game session created: ${sessionId} for game ${game.title}`);

      return {
        ...session,
        questions: session.questions.map(q => ({
          ...q,
          correctAnswer: undefined // Don't send correct answers to client
        }))
      };
    } catch (error) {
      logger.error('Error creating game session:', error);
      throw error;
    }
  }

  /**
   * Submit answer to game session
   */
  async submitAnswer(sessionId: string, questionId: string, answer: string | string[], userId: string): Promise<any> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new NotFoundError('Game session not found');
      }

      if (!session.players.includes(userId)) {
        throw new AppError('User not in this game session', 403, 'UNAUTHORIZED_SESSION_ACCESS');
      }

      const currentQuestion = session.questions[session.currentQuestion];
      if (!currentQuestion || currentQuestion._id.toString() !== questionId) {
        throw new AppError('Invalid question for current session state', 400, 'INVALID_QUESTION_STATE');
      }

      // Check answer
      const isCorrect = this.checkAnswer(currentQuestion.correctAnswer, answer);
      const points = this.calculatePoints(isCorrect, session.timeRemaining, currentQuestion.difficulty);

      // Update score
      session.scores[userId] += points;

      // Move to next question or finish game
      if (session.currentQuestion < session.questions.length - 1) {
        session.currentQuestion += 1;
      } else {
        session.status = 'finished';
        await this.updateUserProgress(userId, session);
      }

      // Update session
      this.activeSessions.set(sessionId, session);

      logger.info(`Answer submitted: ${isCorrect ? 'correct' : 'incorrect'} by user ${userId}`);

      return {
        correct: isCorrect,
        points,
        totalScore: session.scores[userId],
        nextQuestion: session.currentQuestion < session.questions.length - 1 ?
          session.questions[session.currentQuestion + 1] : null,
        gameFinished: session.status === 'finished'
      };
    } catch (error) {
      logger.error('Error submitting answer:', error);
      throw error;
    }
  }

  /**
   * Check if answer is correct
   */
  private checkAnswer(correctAnswer: string | string[], userAnswer: string | string[]): boolean {
    if (Array.isArray(correctAnswer)) {
      if (Array.isArray(userAnswer)) {
        return correctAnswer.every(ans => userAnswer.includes(ans));
      } else {
        return correctAnswer.includes(userAnswer);
      }
    } else {
      if (Array.isArray(userAnswer)) {
        return userAnswer.includes(correctAnswer);
      } else {
        return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
      }
    }
  }

  /**
   * Calculate points based on correctness, time, and difficulty
   */
  private calculatePoints(isCorrect: boolean, timeRemaining: number, difficulty: string): number {
    if (!isCorrect) return 0;

    let basePoints = 10;

    // Difficulty multiplier
    switch (difficulty) {
      case 'easy': basePoints = 10; break;
      case 'medium': basePoints = 15; break;
      case 'hard': basePoints = 20; break;
    }

    // Time bonus (up to 50% more points for quick answers)
    const timeBonus = Math.floor(basePoints * 0.5 * (timeRemaining / 600));

    return basePoints + timeBonus;
  }

  /**
   * Update user progress after game completion
   */
  private async updateUserProgress(userId: string, session: GameSession): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      const finalScore = session.scores[userId];

      // Update user stats
      user.stats.totalGamesPlayed += 1;
      user.stats.totalScore += finalScore;
      user.stats.lastActive = new Date();

      // Award badges based on performance
      if (finalScore >= 150 && !user.badges.includes('high-scorer')) {
        user.badges.push('high-scorer');
      }

      if (user.stats.totalGamesPlayed >= 50 && !user.badges.includes('game-veteran')) {
        user.badges.push('game-veteran');
      }

      await user.save();

      logger.info(`User progress updated: ${user.email} scored ${finalScore} points`);
    } catch (error) {
      logger.error('Error updating user progress:', error);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get active session by ID
   */
  getSession(sessionId: string): GameSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Remove session (cleanup)
   */
  removeSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }

  /**
   * Get all active sessions for a user
   */
  getUserSessions(userId: string): GameSession[] {
    return Array.from(this.activeSessions.values())
      .filter(session => session.players.includes(userId));
  }
}