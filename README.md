# Scripture Quest - Interactive Bible Learning App

A full-stack mobile application that enhances Bible learning through engaging, interactive games. Built with React Native (frontend) and Node.js (backend) using TypeScript.

## 🎯 Overview

Scripture Quest makes memorizing and understanding Bible scriptures fun and accessible through diverse game types including:
- Adventure-based Rescue Missions
- Interactive Bible Quizzes
- Memory Verse Challenges
- Four Pictures One Word
- Bible Pictionary
- Scripture Scavenger Hunts
- And many more!

## 🏗️ Architecture

### Frontend (React Native + TypeScript)
- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **UI Library**: NativeBase with Tailwind CSS
- **Navigation**: Expo Router
- **Real-time**: Socket.IO client

### Backend (Node.js + TypeScript)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + OAuth 2.0
- **Real-time**: Socket.IO
- **Testing**: Jest + Supertest

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+ (or MongoDB Atlas account)
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)
- Docker and Docker Compose (optional)

### Automated Setup
```bash
# Clone repository
git clone https://github.com/your-org/scripture-quest.git
cd scripture-quest

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Expo CLI
- iOS Simulator / Android Emulator

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Full-Stack Docker Setup
```bash
# Copy environment file
cp .env.example .env

# Start all services with Docker Compose
docker-compose -f docker-compose.full-stack.yml up -d

# Initialize database
docker-compose exec api node scripts/init-db.js
```

## 🧪 Testing

### Run All Tests
```bash
# Automated testing script
chmod +x scripts/test.sh
./scripts/test.sh
```

### Individual Test Suites
```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
npm test
npm run test:e2e
```

## 🚀 Deployment

### Quick Deployment
```bash
# Deploy to production
chmod +x scripts/deploy.sh
./scripts/deploy.sh production full-stack
```

### Individual Deployments
```bash
# Backend only
./scripts/deploy.sh production backend

# Frontend only
./scripts/deploy.sh production frontend
```

### Mobile App Deployment
```bash
# Build for app stores
eas build --platform all --profile production

# Submit to app stores
eas submit --platform all
```

## 📱 Features

### Game Types
- **Rescue Mission**: Adventure-based gameplay with squads
- **Bible Quiz**: Multiple-choice and open-ended questions
- **Memory Verse Relay**: Memorization challenges
- **Four Pictures One Word**: Visual Bible word guessing
- **Bible Pictionary**: Drawing and guessing Bible scenes
- **Scripture Scavenger Hunt**: Find verses by theme
- **Complete the Verse**: Fill-in-the-blank challenges
- **Bible Timeline**: Chronological event ordering
- **Beatitudes Match**: Match teachings to meanings
- **Audio Challenge**: Identify verses from audio clips

### User Features
- Journey-based progression system
- Multiplayer squads and real-time battles
- Community forums and verse sharing
- Kid-friendly mode with parental controls
- Offline gameplay for single-player games
- Achievement system with badges
- Memory Bank for verse review

### Admin Features
- Content management system
- User moderation tools
- Analytics dashboard
- Game configuration

## 🔒 Security

- JWT authentication with refresh tokens
- OAuth 2.0 integration (Google, Facebook)
- Input validation with Zod
- Rate limiting (100 requests/min)
- GDPR-compliant data handling
- Audit logging with Winston

## 🧪 Testing

### Backend
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend
```bash
cd frontend
npm test
npm run test:e2e
```

## 📊 API Documentation

Interactive Swagger documentation available at:
- Development: `http://localhost:3000/api-docs`
- Production: `https://api.scripturequest.com/api-docs`

## 🌐 Deployment

### Backend (AWS Elastic Beanstalk)
```bash
cd backend
npm run build
# Deploy via EB CLI or GitHub Actions
```

### Frontend (Expo)
```bash
cd frontend
npm run build:web
# Deploy via Vercel or Expo hosting
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
CORS_ORIGIN=http://localhost:8081
BIBLE_API_KEY=your-bible-api-key
REDIS_URL=redis://localhost:6379
```

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_BIBLE_API_KEY=your-bible-api-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

- [ ] AR Scavenger Hunt
- [ ] Voice Interaction
- [ ] Cross-platform sync
- [ ] Additional localizations
- [ ] AI-powered hints

## 📞 Support

For support, email support@scripturequest.com or join our community forums.