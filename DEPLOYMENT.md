# Scripture Quest Frontend Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Web Deployment](#web-deployment)
5. [Mobile App Deployment](#mobile-app-deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

### Required Software
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Required Accounts
- Expo account
- Apple Developer account (for iOS App Store)
- Google Play Console account (for Android)
- Vercel account (for web deployment)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/scripture-quest.git
cd scripture-quest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file and configure:
```bash
cp .env.example .env
```

Required environment variables:
```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# Bible API Integration
EXPO_PUBLIC_BIBLE_API_KEY=your-bible-api-key-here

# App Configuration
EXPO_PUBLIC_APP_NAME=Scripture Quest
EXPO_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
EXPO_PUBLIC_ENABLE_SOCIAL_LOGIN=true
EXPO_PUBLIC_ENABLE_DONATIONS=true
EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true

# Development
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_LOG_LEVEL=debug
```

## Local Development

### 1. Start Development Server
```bash
# Start Expo development server
npm run dev

# Or with specific platform
npx expo start --web
npx expo start --ios
npx expo start --android
```

### 2. Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# E2E tests (requires simulator/emulator)
npm run test:e2e
```

### 3. Linting
```bash
# Lint code
npm run lint
```

## Web Deployment

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Build for Web
```bash
npm run build:web
```

#### 3. Deploy to Vercel
```bash
# Deploy to production
vercel --prod

# Or connect GitHub repository for automatic deployments
```

#### 4. Configure Environment Variables
In Vercel dashboard, add:
- `EXPO_PUBLIC_API_URL=https://api.scripturequest.com`
- `EXPO_PUBLIC_BIBLE_API_KEY=your-bible-api-key`
- `EXPO_PUBLIC_ENABLE_SOCIAL_LOGIN=true`

### Option 2: Netlify

#### 1. Build for Web
```bash
npm run build:web
```

#### 2. Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: AWS S3 + CloudFront

#### 1. Build for Web
```bash
npm run build:web
```

#### 2. Deploy to S3
```bash
# Install AWS CLI
aws configure

# Sync to S3 bucket
aws s3 sync dist/ s3://scripture-quest-web --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Mobile App Deployment

### Prerequisites for Mobile Deployment

#### 1. Configure EAS
```bash
# Login to Expo
eas login

# Configure EAS
eas build:configure
```

#### 2. Update app.json for Production
```json
{
  "expo": {
    "name": "Scripture Quest",
    "slug": "scripture-quest",
    "version": "1.0.0",
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### iOS Deployment

#### 1. Build for iOS
```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

#### 2. Submit to App Store
```bash
# Submit to App Store Connect
eas submit --platform ios
```

#### 3. App Store Connect Configuration
1. Log into App Store Connect
2. Create new app
3. Upload build from EAS
4. Configure app metadata:
   - App name: "Scripture Quest"
   - Category: Education
   - Age rating: 4+
   - Keywords: "bible, scripture, games, education, christian"
5. Submit for review

### Android Deployment

#### 1. Build for Android
```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

#### 2. Submit to Google Play
```bash
# Submit to Google Play Console
eas submit --platform android
```

#### 3. Google Play Console Configuration
1. Log into Google Play Console
2. Create new app
3. Upload AAB file from EAS
4. Configure store listing:
   - App name: "Scripture Quest"
   - Category: Education
   - Content rating: Everyone
   - Target audience: All ages
5. Submit for review

### Build Profiles Configuration

Create `eas.json`:
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "http://localhost:3000"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api-staging.scripturequest.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.scripturequest.com"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Environment-Specific Configurations

### Development Environment
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_LOG_LEVEL=debug
```

### Staging Environment
```env
EXPO_PUBLIC_API_URL=https://api-staging.scripturequest.com
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_LOG_LEVEL=info
```

### Production Environment
```env
EXPO_PUBLIC_API_URL=https://api.scripturequest.com
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_LOG_LEVEL=error
```

## Performance Optimization

### 1. Bundle Optimization
```bash
# Analyze bundle size
npx expo export --platform web --dev false
npx webpack-bundle-analyzer dist/static/js/*.js
```

### 2. Image Optimization
- Use WebP format for images
- Implement lazy loading
- Optimize image sizes for different screen densities

### 3. Code Splitting
```javascript
// Implement lazy loading for screens
const GameScreen = React.lazy(() => import('./screens/GameScreen'));

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <GameScreen />
</Suspense>
```

## Testing Before Deployment

### 1. Pre-deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] API endpoints accessible
- [ ] Authentication working
- [ ] Game mechanics functional
- [ ] Offline mode working
- [ ] Performance acceptable

### 2. Device Testing
```bash
# Test on iOS simulator
npx expo start --ios

# Test on Android emulator
npx expo start --android

# Test on physical device
npx expo start --tunnel
```

### 3. Cross-platform Testing
- Test on various iOS devices (iPhone, iPad)
- Test on various Android devices (different screen sizes)
- Test web version on different browsers

## Monitoring and Analytics

### 1. Expo Analytics
```javascript
// Track user events
import { Analytics } from 'expo-analytics';

const analytics = new Analytics('your-tracking-id');

// Track screen views
analytics.screen('GameScreen');

// Track events
analytics.event('game_completed', {
  game_type: 'quiz',
  score: 150,
  duration: 300
});
```

### 2. Error Tracking
```javascript
// Implement error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to error tracking service
    console.error('App Error:', error, errorInfo);
  }
}
```

### 3. Performance Monitoring
```javascript
// Monitor app performance
import { Performance } from 'expo-performance';

Performance.mark('game-start');
// ... game logic
Performance.mark('game-end');
Performance.measure('game-duration', 'game-start', 'game-end');
```

## Troubleshooting

### Common Issues

1. **Metro Bundle Error**
   ```bash
   # Clear Metro cache
   npx expo start --clear
   
   # Reset npm cache
   npm start -- --reset-cache
   ```

2. **Build Failures**
   ```bash
   # Check EAS build logs
   eas build:list
   
   # View specific build
   eas build:view [build-id]
   ```

3. **Environment Variable Issues**
   ```bash
   # Verify environment variables
   npx expo config --type public
   ```

### Debug Mode
```bash
# Enable debug mode
EXPO_PUBLIC_DEBUG_MODE=true npm run dev

# View detailed logs
npx expo start --dev-client
```

## Maintenance

### Regular Tasks
- Update Expo SDK monthly
- Update dependencies weekly
- Monitor crash reports daily
- Review app store ratings weekly

### App Store Updates
1. Update version in `app.json`
2. Build new version with EAS
3. Submit to app stores
4. Monitor deployment status

### Rollback Procedure
```bash
# Revert to previous version
eas build --platform all --profile production --clear-cache

# Or use app store rollback features
```

## Support and Documentation

### User Support
- In-app help system
- Email support: support@scripturequest.com
- Community forums for user questions

### Developer Documentation
- API documentation: https://api.scripturequest.com/api-docs
- Component documentation in Storybook
- Code comments and README files