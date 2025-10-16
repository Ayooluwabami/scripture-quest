import request from 'supertest';
import { app } from '../src/app';
import { User } from '../src/models/User';
import { Game } from '../src/models/Game';

describe('Games Endpoints', () => {
  let authToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;

  beforeEach(async () => {
    // Create regular user
    const user = new User({
      email: 'user@example.com',
      password: 'password123',
      username: 'testuser',
      role: 'user'
    });
    await user.save();
    userId = user._id.toString();

    // Create admin user
    const admin = new User({
      email: 'admin@example.com',
      password: 'password123',
      username: 'admin',
      role: 'admin'
    });
    await admin.save();
    adminId = admin._id.toString();

    // Get auth tokens
    const userLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    authToken = userLogin.body.data.tokens.accessToken;

    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLogin.body.data.tokens.accessToken;
  });

  describe('GET /api/v1/games', () => {
    beforeEach(async () => {
      // Create test games
      const games = [
        {
          type: 'quiz',
          title: 'Bible Quiz',
          description: 'Test your Bible knowledge',
          theme: 'Knowledge',
          difficulty: 'medium',
          isMultiplayer: true,
          createdBy: adminId
        },
        {
          type: 'rescue',
          title: 'Rescue Mission',
          description: 'Adventure-based gameplay',
          theme: 'Adventure',
          difficulty: 'hard',
          isMultiplayer: true,
          createdBy: adminId
        }
      ];

      await Game.insertMany(games);
    });

    it('should return list of games', async () => {
      const response = await request(app)
        .get('/api/v1/games')
        .expect(200);

      expect(response.body.data.games).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter games by type', async () => {
      const response = await request(app)
        .get('/api/v1/games?type=quiz')
        .expect(200);

      expect(response.body.data.games).toHaveLength(1);
      expect(response.body.data.games[0].type).toBe('quiz');
    });

    it('should filter games by difficulty', async () => {
      const response = await request(app)
        .get('/api/v1/games?difficulty=hard')
        .expect(200);

      expect(response.body.data.games).toHaveLength(1);
      expect(response.body.data.games[0].difficulty).toBe('hard');
    });
  });

  describe('POST /api/v1/games', () => {
    it('should create game as admin', async () => {
      const gameData = {
        type: 'memory',
        title: 'Memory Verse Challenge',
        description: 'Memorize Bible verses',
        theme: 'Memory',
        difficulty: 'medium',
        isMultiplayer: false
      };

      const response = await request(app)
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(gameData)
        .expect(201);

      expect(response.body.data.title).toBe(gameData.title);
      expect(response.body.data.type).toBe(gameData.type);
    });

    it('should return 403 for non-admin user', async () => {
      const gameData = {
        type: 'memory',
        title: 'Memory Verse Challenge',
        description: 'Memorize Bible verses',
        theme: 'Memory'
      };

      const response = await request(app)
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData)
        .expect(403);

      expect(response.body.error).toBe('AUTHORIZATION_ERROR');
    });

    it('should return 401 without auth token', async () => {
      const gameData = {
        type: 'memory',
        title: 'Memory Verse Challenge',
        description: 'Memorize Bible verses',
        theme: 'Memory'
      };

      await request(app)
        .post('/api/v1/games')
        .send(gameData)
        .expect(401);
    });
  });

  describe('POST /api/v1/games/:id/session', () => {
    let gameId: string;

    beforeEach(async () => {
      const game = new Game({
        type: 'quiz',
        title: 'Test Quiz',
        description: 'Test description',
        theme: 'Test',
        createdBy: adminId
      });
      await game.save();
      gameId = game._id.toString();
    });

    it('should create game session for authenticated user', async () => {
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/session`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.gameId).toBe(gameId);
      expect(response.body.data.questions).toBeDefined();
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .post(`/api/v1/games/${gameId}/session`)
        .expect(401);
    });

    it('should return 404 for non-existent game', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .post(`/api/v1/games/${fakeId}/session`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});