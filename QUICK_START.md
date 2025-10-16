# Scripture Quest - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Vercel account

### 1. Clone and Setup
```bash
git clone https://github.com/your-org/scripture-quest.git
cd scripture-quest

# Backend setup
cd backend
cp .env.example .env
npm install

# Frontend setup
cd ..
cp .env.example .env
npm install
```

### 2. Configure Environment
Update `backend/.env`:
```env
MONGODB_URI=
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
SESSION_SECRET=your-super-secret-session-key-min-32-characters
```

Update `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start Development
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### 4. Deploy to Vercel
```bash
# Deploy backend
cd backend
npm run build
vercel --prod

# Deploy frontend
cd ..
npm run build:web
vercel --prod
```

### 5. Access Your App
- **Local Development**: http://localhost:8081
- **Production**: https://scripture-quest.vercel.app
- **API Docs**: https://scripture-quest-api.vercel.app/api-docs

## 📱 Mobile App Deployment

### Build for Mobile
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS and Android
eas build --platform all --profile production
```

### Submit to App Stores
```bash
# Submit to App Store and Google Play
eas submit --platform all
```

## 🎮 Game Features

- **12+ Interactive Games**: Quiz, Rescue Mission, Memory Verse, Pictionary, etc.
- **Multiplayer Support**: Real-time squads and battles
- **Journey Progression**: Themed levels with rewards
- **Community Features**: Forums and verse sharing
- **Daily Challenges**: Streak tracking and badges

## 🛠 Development Commands

```bash
# Backend
npm run dev          # Start development server
npm test            # Run tests
npm run build       # Build for production
npm run lint        # Lint code

# Frontend
npm run dev         # Start Expo development
npm test           # Run tests
npm run build:web  # Build for web
npm run lint       # Lint code
```

## 📚 Documentation

- [Backend Deployment](backend/DEPLOYMENT.md)
- [Frontend Deployment](DEPLOYMENT.md)
- [Full-Stack Deployment](FULL_STACK_DEPLOYMENT.md)
- [Vercel Deployment](VERCEL_DEPLOYMENT.md)
- [API Documentation](https://scripture-quest-api.vercel.app/api-docs)

## 🆘 Support

- **Issues**: GitHub Issues
- **Email**: support@scripturequest.com
- **Documentation**: Full guides in project docs