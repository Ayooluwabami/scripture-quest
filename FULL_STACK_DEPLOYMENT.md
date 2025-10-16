# Scripture Quest Full-Stack Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Development Environment](#development-environment)
5. [Production Deployment](#production-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Cloud Deployment](#cloud-deployment)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Overview

This guide covers the complete deployment of Scripture Quest, including both the backend API and frontend mobile application. The application consists of:

- **Backend**: Node.js/Express API with MongoDB
- **Frontend**: React Native mobile app with Expo
- **Database**: MongoDB Atlas (cloud) or local MongoDB
- **Cache**: Redis (optional)
- **Real-time**: Socket.IO for multiplayer features

## Prerequisites

### Required Software
- Node.js 18+ and npm
- Git
- Docker and Docker Compose
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)

### Required Accounts
- MongoDB Atlas account
- Expo account
- Vercel account (for web deployment)
- Apple Developer account (for iOS)
- Google Play Console account (for Android)

## Quick Start

### 1. Clone and Setup
```bash
# Clone repository
git clone https://github.com/your-org/scripture-quest.git
cd scripture-quest

# Install backend dependencies
cd backend
npm install
cp .env.example .env

# Install frontend dependencies
cd ..
npm install
cp .env.example .env
```

### 2. Configure Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scripture-quest
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
SESSION_SECRET=your-super-secret-session-key-min-32-characters
CORS_ORIGIN=http://localhost:8081
BIBLE_API_KEY=your-bible-api-key
```

#### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_BIBLE_API_KEY=your-bible-api-key-here
EXPO_PUBLIC_APP_NAME=Scripture Quest
EXPO_PUBLIC_DEBUG_MODE=true
```

### 3. Start Development Servers
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd ..
npm run dev
```

## Development Environment

### Backend Development Setup

#### 1. Database Setup
```bash
# Option 1: Local MongoDB
brew install mongodb/brew/mongodb-community
brew services start mongodb-community

# Option 2: MongoDB Atlas (recommended)
# Create cluster at https://cloud.mongodb.com
# Get connection string and update MONGODB_URI
```

#### 2. Redis Setup (Optional)
```bash
# Install Redis
brew install redis
brew services start redis

# Update .env
REDIS_URL=redis://localhost:6379
```

#### 3. Start Backend
```bash
cd backend
npm run dev
```

#### 4. Verify Backend
```bash
# Health check
curl http://localhost:3000/health

# API documentation
open http://localhost:3000/api-docs
```

### Frontend Development Setup

#### 1. Start Frontend
```bash
npm run dev
```

#### 2. Test on Different Platforms
```bash
# Web
npx expo start --web

# iOS Simulator (macOS only)
npx expo start --ios

# Android Emulator
npx expo start --android

# Physical device
npx expo start --tunnel
```

#### 3. Verify Frontend
- Check that app loads without errors
- Test authentication flow
- Verify API connectivity
- Test game mechanics

## Production Deployment

### Phase 1: Backend Deployment

#### Option 1: Vercel (Recommended for API)
```bash
cd backend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### Option 2: AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init scripture-quest-api
eb create production
eb deploy
```

#### Option 3: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Phase 2: Database Setup

#### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create new cluster (M0 free tier for development)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for cloud deployment)
5. Get connection string
6. Update production environment variables

#### Database Initialization
```bash
# Run initialization script
node scripts/init-db.js

# Or use MongoDB Compass to import sample data
```

### Phase 3: Frontend Deployment

#### Web Deployment
```bash
# Build for web
npm run build:web

# Deploy to Vercel
vercel --prod

# Configure environment variables
# EXPO_PUBLIC_API_URL=https://api.scripturequest.com
```

#### Mobile App Deployment

##### iOS Deployment
```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

##### Android Deployment
```bash
# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

## Docker Deployment

### Full-Stack Docker Setup

#### 1. Backend Docker
```bash
cd backend

# Build backend image
docker build -t scripture-quest-api .

# Run with Docker Compose
docker-compose up -d
```

#### 2. Frontend Docker (Web)
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:web

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Complete Docker Compose
```yaml
version: '3.8'

services:
  # Database
  mongodb:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  # Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # Backend API
  api:
    build: ./backend
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/scripture-quest?authSource=admin
      REDIS_URL: redis://redis:6379
    depends_on:
      - mongodb
      - redis
    networks:
      - app-network

  # Frontend Web
  web:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - app-network

volumes:
  mongodb_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

## Cloud Deployment

### AWS Complete Setup

#### 1. Infrastructure as Code (CloudFormation)
```yaml
# infrastructure.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: Scripture Quest Infrastructure

Resources:
  # ECS Cluster
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: scripture-quest

  # Application Load Balancer
  LoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: scripture-quest-alb
      Scheme: internet-facing
      Type: application
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2

  # RDS for MongoDB alternative
  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: scripture-quest-db
      DBInstanceClass: db.t3.micro
      Engine: postgres
      MasterUsername: admin
      MasterUserPassword: !Ref DatabasePassword
```

#### 2. Deploy Infrastructure
```bash
# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file infrastructure.yml \
  --stack-name scripture-quest-infrastructure \
  --capabilities CAPABILITY_IAM
```

### Google Cloud Platform Setup

#### 1. Cloud Run Deployment
```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT_ID/scripture-quest-api ./backend
gcloud run deploy scripture-quest-api \
  --image gcr.io/PROJECT_ID/scripture-quest-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy frontend to Firebase Hosting
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## Environment Management

### Development
```bash
# Backend
cd backend
cp .env.example .env.development
npm run dev

# Frontend
cp .env.example .env.development
npm run dev
```

### Staging
```bash
# Backend
cp .env.example .env.staging
# Update with staging URLs and credentials

# Frontend
cp .env.example .env.staging
# Update EXPO_PUBLIC_API_URL to staging backend
```

### Production
```bash
# Backend
cp .env.example .env.production
# Update with production URLs and credentials

# Frontend
cp .env.example .env.production
# Update EXPO_PUBLIC_API_URL to production backend
```

## SSL/TLS Configuration

### 1. Obtain SSL Certificates
```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d api.scripturequest.com
sudo certbot certonly --standalone -d scripturequest.com
```

### 2. Configure Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name api.scripturequest.com;

    ssl_certificate /etc/letsencrypt/live/api.scripturequest.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.scripturequest.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring and Maintenance

### 1. Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2

# Start backend with PM2
pm2 start backend/dist/server.js --name scripture-quest-api

# Monitor
pm2 monit
pm2 logs scripture-quest-api
```

### 2. Database Monitoring
```javascript
// MongoDB monitoring
const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
```

### 3. Health Checks
```bash
# Backend health check
curl https://api.scripturequest.com/health

# Frontend health check
curl https://scripturequest.com

# Database health check
mongosh "mongodb+srv://..." --eval "db.adminCommand('ping')"
```

### 4. Log Management
```bash
# View backend logs
tail -f backend/logs/combined.log

# View error logs
tail -f backend/logs/error.log

# Rotate logs (add to crontab)
0 0 * * * /usr/sbin/logrotate /etc/logrotate.d/scripture-quest
```

## Backup and Recovery

### 1. Database Backup
```bash
# MongoDB backup
mongodump --uri="$MONGODB_URI" --out=backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="backup/$DATE"
aws s3 cp backup/$DATE s3://scripture-quest-backups/ --recursive
rm -rf backup/$DATE
```

### 2. Application Backup
```bash
# Backup application code
tar -czf scripture-quest-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=logs \
  .
```

### 3. Recovery Procedures
```bash
# Restore database
mongorestore --uri="$MONGODB_URI" backup/20240101/

# Restore application
tar -xzf scripture-quest-20240101.tar.gz
cd scripture-quest
npm install
```

## Security Checklist

### Pre-deployment Security
- [ ] Environment variables secured
- [ ] JWT secrets are strong (32+ characters)
- [ ] Database access restricted
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] SSL/TLS certificates installed
- [ ] Security headers configured
- [ ] Dependencies scanned for vulnerabilities

### Security Commands
```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Security scan
npm install -g snyk
snyk test
```

## Performance Optimization

### Backend Optimization
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Optimize database queries
const games = await Game.find(filter)
  .select('title description theme difficulty')
  .limit(20)
  .lean(); // Use lean() for read-only operations
```

### Frontend Optimization
```javascript
// Lazy load screens
const GameScreen = React.lazy(() => import('./screens/GameScreen'));

// Optimize images
import { Image } from 'expo-image';

// Use optimized image component
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  contentFit="cover"
  transition={200}
/>
```

## Scaling Strategies

### Horizontal Scaling
```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scripture-quest-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: scripture-quest-api
  template:
    metadata:
      labels:
        app: scripture-quest-api
    spec:
      containers:
      - name: api
        image: scripture-quest-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: scripture-quest-secrets
              key: mongodb-uri
```

### Database Scaling
```javascript
// MongoDB connection with replica set
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  readPreference: 'secondaryPreferred',
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});
```

## Troubleshooting

### Common Deployment Issues

1. **Backend Won't Start**
   ```bash
   # Check logs
   docker logs scripture-quest-api
   
   # Verify environment variables
   docker exec scripture-quest-api env | grep MONGODB_URI
   
   # Test database connection
   docker exec scripture-quest-api node -e "
     const mongoose = require('mongoose');
     mongoose.connect(process.env.MONGODB_URI)
       .then(() => console.log('DB Connected'))
       .catch(err => console.error('DB Error:', err));
   "
   ```

2. **Frontend Build Fails**
   ```bash
   # Clear cache
   npx expo start --clear
   
   # Check environment variables
   npx expo config --type public
   
   # Verify API connectivity
   curl $EXPO_PUBLIC_API_URL/health
   ```

3. **CORS Issues**
   ```bash
   # Test CORS
   curl -H "Origin: https://scripturequest.com" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS \
        https://api.scripturequest.com/api/v1/auth/login
   ```

### Debug Commands
```bash
# Backend debugging
cd backend
npm run dev -- --inspect

# Frontend debugging
npm run dev -- --dev-client

# Database debugging
mongosh "$MONGODB_URI" --eval "db.users.find().limit(5)"
```

## Deployment Automation

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Scripture Quest

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      # Test backend
      - name: Test Backend
        run: |
          cd backend
          npm ci
          npm test
      
      # Test frontend
      - name: Test Frontend
        run: |
          npm ci
          npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./backend

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build and Deploy Web
        run: |
          npm ci
          npm run build:web
          npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Mobile Apps
        run: |
          eas build --platform all --profile production --non-interactive
```

## Monitoring Setup

### 1. Application Monitoring
```javascript
// backend/src/middleware/monitoring.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
});
```

### 2. Error Tracking
```javascript
// Sentry integration
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

### 3. Uptime Monitoring
```bash
# Simple uptime check script
#!/bin/bash
URL="https://api.scripturequest.com/health"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $STATUS -ne 200 ]; then
  echo "API is down! Status: $STATUS"
  # Send alert (email, Slack, etc.)
fi
```

## Maintenance Procedures

### Regular Maintenance Tasks

#### Daily
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Verify database connectivity
- [ ] Check app store reviews

#### Weekly
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Backup database
- [ ] Performance analysis

#### Monthly
- [ ] Security audit
- [ ] Dependency vulnerability scan
- [ ] Infrastructure cost review
- [ ] User feedback analysis

### Maintenance Scripts
```bash
# Update dependencies
npm update
npm audit fix

# Database maintenance
mongosh "$MONGODB_URI" --eval "
  db.runCommand({compact: 'users'});
  db.runCommand({compact: 'games'});
  db.runCommand({compact: 'questions'});
"

# Log rotation
logrotate /etc/logrotate.d/scripture-quest
```

## Disaster Recovery

### 1. Backup Strategy
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
mongodump --uri="$MONGODB_URI" --out="backup/db/$DATE"

# Application backup
tar -czf "backup/app/scripture-quest-$DATE.tar.gz" \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=logs \
  .

# Upload to S3
aws s3 cp backup/ s3://scripture-quest-backups/ --recursive

# Cleanup old backups (keep last 30 days)
find backup/ -type f -mtime +30 -delete
```

### 2. Recovery Procedures
```bash
# Restore database
mongorestore --uri="$MONGODB_URI" backup/db/latest/

# Restore application
tar -xzf backup/app/scripture-quest-latest.tar.gz
cd scripture-quest
npm install
npm run build
pm2 restart scripture-quest-api
```

## Support and Documentation

### Getting Help
- **Documentation**: https://docs.scripturequest.com
- **API Docs**: https://api.scripturequest.com/api-docs
- **Support Email**: support@scripturequest.com
- **GitHub Issues**: https://github.com/your-org/scripture-quest/issues

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

### Deployment Checklist

#### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates valid
- [ ] Monitoring configured
- [ ] Backup strategy implemented

#### Post-deployment
- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Frontend loading correctly
- [ ] Authentication working
- [ ] Database connectivity verified
- [ ] Real-time features functional
- [ ] Mobile apps submitted to stores

#### Rollback Plan
1. Identify issue
2. Stop traffic to affected service
3. Restore previous version
4. Verify functionality
5. Investigate and fix issue
6. Redeploy when ready

This comprehensive deployment guide ensures a smooth, secure, and scalable deployment of the Scripture Quest application across all environments.