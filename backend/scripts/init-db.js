const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const { User } = require('../dist/models/User');
const { Game } = require('../dist/models/Game');
const { Question } = require('../dist/models/Question');
const { Level } = require('../dist/models/Level');
const { Community } = require('../dist/models/Community');

async function initializeDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Clearing existing data...');
      await User.deleteMany({});
      await Game.deleteMany({});
      await Question.deleteMany({});
      await Level.deleteMany({});
      await Community.deleteMany({});
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      email: 'admin@scripturequest.com',
      password: adminPassword,
      username: 'admin',
      role: 'admin',
      badges: ['founder'],
      stats: {
        totalGamesPlayed: 0,
        totalScore: 0,
        versesMemorized: 0,
        streakDays: 0,
        lastActive: new Date()
      }
    });
    await admin.save();

    // Create sample users
    console.log('👥 Creating sample users...');
    const sampleUsers = [
      {
        email: 'david@example.com',
        password: await bcrypt.hash('password123', 12),
        username: 'DavidsPsalm',
        role: 'user',
        badges: ['faith-warrior', 'quiz-champion'],
        stats: {
          totalGamesPlayed: 25,
          totalScore: 1250,
          versesMemorized: 15,
          streakDays: 5,
          lastActive: new Date()
        }
      },
      {
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 12),
        username: 'FaithfulSarah',
        role: 'user',
        badges: ['memory-master'],
        stats: {
          totalGamesPlayed: 40,
          totalScore: 2450,
          versesMemorized: 32,
          streakDays: 12,
          lastActive: new Date()
        }
      }
    ];

    await User.insertMany(sampleUsers);

    // Create sample questions
    console.log('❓ Creating sample questions...');
    const sampleQuestions = [
      {
        text: 'Who was the mother of Moses?',
        type: 'multiple-choice',
        answer: 'Jochebed',
        options: ['Jochebed', 'Miriam', 'Zipporah', 'Deborah'],
        reference: 'Numbers 26:59',
        hints: ['She was from the tribe of Levi', 'She hid Moses for three months'],
        theme: 'Characters',
        difficulty: 'medium',
        gameTypes: ['quiz', 'rescue'],
        createdBy: admin._id
      },
      {
        text: 'Complete the verse: "The Lord is my light and my salvation—whom shall I ___?"',
        type: 'fill-in',
        answer: 'fear',
        reference: 'Psalm 27:1',
        hints: ['This word expresses being afraid', 'Opposite of courage'],
        theme: 'Verses',
        difficulty: 'easy',
        gameTypes: ['memory', 'verse'],
        createdBy: admin._id
      },
      {
        text: 'I am an enemy of faith. I make people doubt God\'s promises. Who am I?',
        type: 'open-ended',
        answer: 'Doubt',
        reference: 'Rescue Mission',
        hints: ['I am the opposite of belief', 'I make people question'],
        theme: 'Spiritual Warfare',
        difficulty: 'medium',
        gameTypes: ['rescue'],
        createdBy: admin._id
      }
    ];

    const questions = await Question.insertMany(sampleQuestions);

    // Create sample games
    console.log('🎮 Creating sample games...');
    const sampleGames = [
      {
        type: 'rescue',
        title: 'Rescue Mission',
        description: 'Embark on an adventure to rescue the VVIP by defeating spiritual enemies',
        questions: questions.filter(q => q.gameTypes.includes('rescue')).map(q => q._id),
        theme: 'Adventure',
        difficulty: 'medium',
        isMultiplayer: true,
        maxPlayers: 4,
        timeLimit: 2400,
        settings: {
          allowHints: true,
          hintCost: 5,
          passOnWrong: false,
          randomizeQuestions: true
        },
        createdBy: admin._id
      },
      {
        type: 'quiz',
        title: 'Bible Quiz',
        description: 'Test your Bible knowledge with challenging questions',
        questions: questions.filter(q => q.gameTypes.includes('quiz')).map(q => q._id),
        theme: 'Knowledge',
        difficulty: 'easy',
        isMultiplayer: true,
        maxPlayers: 6,
        timeLimit: 900,
        settings: {
          allowHints: true,
          hintCost: 3,
          passOnWrong: true,
          randomizeQuestions: true
        },
        createdBy: admin._id
      },
      {
        type: 'memory',
        title: 'Memory Verse Challenge',
        description: 'Memorize and recite Bible verses under time pressure',
        questions: questions.filter(q => q.gameTypes.includes('memory')).map(q => q._id),
        theme: 'Memory',
        difficulty: 'medium',
        isMultiplayer: false,
        maxPlayers: 1,
        timeLimit: 300,
        settings: {
          allowHints: true,
          hintCost: 2,
          passOnWrong: false,
          randomizeQuestions: false
        },
        createdBy: admin._id
      }
    ];

    const games = await Game.insertMany(sampleGames);

    // Create sample levels
    console.log('📊 Creating sample levels...');
    const sampleLevels = [
      {
        journeyId: 'journey-of-faith',
        gameId: games[0]._id,
        orderIndex: 1,
        title: 'Confronting Fear',
        description: 'Learn to overcome fear through faith',
        difficulty: 'easy',
        tasks: [questions[0]._id],
        timeLimit: 600,
        pointsToPass: 50,
        rewards: {
          points: 100,
          badges: ['courage-beginner'],
          unlocks: ['level-2']
        },
        createdBy: admin._id
      },
      {
        journeyId: 'journey-of-faith',
        gameId: games[1]._id,
        orderIndex: 2,
        title: 'Defeating Doubt',
        description: 'Strengthen your faith by overcoming doubt',
        difficulty: 'medium',
        tasks: [questions[1]._id, questions[2]._id],
        timeLimit: 900,
        pointsToPass: 75,
        rewards: {
          points: 150,
          badges: ['faith-warrior'],
          unlocks: ['level-3']
        },
        prerequisites: ['level-1'],
        createdBy: admin._id
      }
    ];

    await Level.insertMany(sampleLevels);

    // Create sample community content
    console.log('💬 Creating sample community content...');
    const samplePosts = [
      {
        type: 'forum-post',
        title: 'Finding Peace in Difficult Times',
        content: 'I\'ve been struggling lately and found comfort in Philippians 4:7. How do you find peace when everything feels overwhelming?',
        category: 'Prayer & Support',
        author: sampleUsers[0]._id,
        likes: 24,
        replies: 12
      },
      {
        type: 'verse-card',
        content: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?',
        metadata: {
          reference: 'Psalm 27:1',
          background: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg'
        },
        author: sampleUsers[1]._id,
        likes: 45,
        shares: 12
      }
    ];

    await Community.insertMany(samplePosts);

    console.log('🎉 Database initialization completed successfully!');
    console.log('');
    console.log('📊 Created:');
    console.log(`   👤 Users: ${await User.countDocuments()}`);
    console.log(`   🎮 Games: ${await Game.countDocuments()}`);
    console.log(`   ❓ Questions: ${await Question.countDocuments()}`);
    console.log(`   📊 Levels: ${await Level.countDocuments()}`);
    console.log(`   💬 Community Posts: ${await Community.countDocuments()}`);
    console.log('');
    console.log('🔑 Admin Credentials:');
    console.log('   Email: admin@scripturequest.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👥 Sample User Credentials:');
    console.log('   Email: david@example.com / Password: password123');
    console.log('   Email: sarah@example.com / Password: password123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run initialization
initializeDatabase();