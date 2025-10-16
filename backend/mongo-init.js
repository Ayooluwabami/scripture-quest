// MongoDB initialization script
db = db.getSiblingDB('scripture-quest');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'username', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 30
        },
        role: {
          enum: ['guest', 'user', 'admin']
        }
      }
    }
  }
});

db.createCollection('games', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['type', 'title', 'description', 'theme'],
      properties: {
        type: {
          enum: ['rescue', 'quiz', 'pictionary', 'memory', 'scavenger', 'verse', 'timeline', 'beatitudes', 'wordsearch', 'parable', 'audio', 'fourpictures']
        },
        difficulty: {
          enum: ['easy', 'medium', 'hard']
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ 'stats.totalScore': -1 });

db.games.createIndex({ type: 1, isActive: 1 });
db.games.createIndex({ theme: 1 });
db.games.createIndex({ difficulty: 1 });

db.questions.createIndex({ type: 1, isActive: 1 });
db.questions.createIndex({ gameTypes: 1 });
db.questions.createIndex({ theme: 1 });

db.levels.createIndex({ journeyId: 1, orderIndex: 1 }, { unique: true });
db.levels.createIndex({ gameId: 1 });

db.progress.createIndex({ userId: 1, completedAt: -1 });
db.progress.createIndex({ gameId: 1 });
db.progress.createIndex({ score: -1 });

db.community.createIndex({ type: 1, isActive: 1 });
db.community.createIndex({ author: 1 });
db.community.createIndex({ createdAt: -1 });

print('Database initialized successfully!');