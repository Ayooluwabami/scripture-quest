# Scripture Quest - Vercel Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment to Vercel](#backend-deployment-to-vercel)
4. [Frontend Deployment to Vercel](#frontend-deployment-to-vercel)
5. [Environment Configuration](#environment-configuration)
6. [Domain Setup](#domain-setup)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Overview

This guide covers deploying Scripture Quest to Vercel, including both the backend API and frontend web application. Vercel provides excellent performance, automatic SSL, and seamless deployment from Git repositories.

## Prerequisites

### Required Accounts
- Vercel account (https://vercel.com)
- MongoDB Atlas account
- GitHub account (for repository hosting)
- Domain registrar account (optional, for custom domain)

### Required Software
- Node.js 18+
- Git
- Vercel CLI (`npm install -g vercel`)

## Backend Deployment to Vercel

### 1. Prepare Backend for Vercel

Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "dist/server.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. Build Backend
```bash
cd backend
npm install
npm run build
```

### 3. Deploy Backend
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy backend
cd backend
vercel --prod

# Follow prompts:
# - Link to existing project or create new
# - Set project name: scripture-quest-api
# - Set framework: Other
# - Set build command: npm run build
# - Set output directory: dist
```

### 4. Configure Backend Environment Variables

In Vercel Dashboard for backend project:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scripture-quest
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
SESSION_SECRET=your-super-secret-session-key-min-32-characters
CORS_ORIGIN=https://scripture-quest.vercel.app
BIBLE_API_KEY=your-bible-api-key
REDIS_URL=redis://your-redis-url
```

### 5. Test Backend Deployment
```bash
# Test health endpoint
curl https://scripture-quest-api.vercel.app/health

# Test API documentation
open https://scripture-quest-api.vercel.app/api-docs
```

## Frontend Deployment to Vercel

### 1. Prepare Frontend for Vercel

Update `vercel.json` in root:
```json
{
  "version": 2,
  "framework": "vite",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "EXPO_PUBLIC_API_URL": "https://scripture-quest-api.vercel.app"
  }
}
```

### 2. Build Frontend
```bash
# Install dependencies
npm install

# Build for web
npm run build:web
```

### 3. Deploy Frontend
```bash
# Deploy frontend (from root directory)
vercel --prod

# Follow prompts:
# - Link to existing project or create new
# - Set project name: scripture-quest
# - Set framework: Vite
# - Set build command: npm run build:web
# - Set output directory: dist
```

### 4. Configure Frontend Environment Variables

In Vercel Dashboard for frontend project:
```env
EXPO_PUBLIC_API_URL=https://scripture-quest-api.vercel.app
EXPO_PUBLIC_BIBLE_API_KEY=your-bible-api-key
EXPO_PUBLIC_APP_NAME=Scripture Quest
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_LOG_LEVEL=error
```

### 5. Test Frontend Deployment
```bash
# Test web application
open https://scripture-quest.vercel.app

# Test API connectivity
curl https://scripture-quest.vercel.app
```

## Environment Configuration

### Development Environment
```env
# Backend (.env)
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/scripture-quest
JWT_SECRET=dev-jwt-secret-key-min-32-characters
SESSION_SECRET=dev-session-secret-key-min-32-characters
CORS_ORIGIN=http://localhost:8081

# Frontend (.env)
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_LOG_LEVEL=debug
```

### Production Environment
```env
# Backend (Vercel Environment Variables)
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/scripture-quest
JWT_SECRET=production-jwt-secret-key-min-32-characters
SESSION_SECRET=production-session-secret-key-min-32-characters
CORS_ORIGIN=https://scripture-quest.vercel.app

# Frontend (Vercel Environment Variables)
EXPO_PUBLIC_API_URL=https://scripture-quest-api.vercel.app
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_LOG_LEVEL=error
```

## Domain Setup

### 1. Custom Domain Configuration

#### Backend Domain
1. In Vercel Dashboard → scripture-quest-api project
2. Go to Settings → Domains
3. Add domain: `api.scripturequest.com`
4. Configure DNS:
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

#### Frontend Domain
1. In Vercel Dashboard → scripture-quest project
2. Go to Settings → Domains
3. Add domain: `scripturequest.com`
4. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 2. Update Environment Variables
After domain setup, update CORS and API URLs:

Backend:
```env
CORS_ORIGIN=https://scripturequest.com
```

Frontend:
```env
EXPO_PUBLIC_API_URL=https://api.scripturequest.com
```

## Automated Deployment

### 1. GitHub Integration

Connect repositories to Vercel:
1. Import Git Repository in Vercel Dashboard
2. Select GitHub repository
3. Configure build settings
4. Enable automatic deployments

### 2. Deployment Scripts

Create `deploy-vercel.sh`:
```bash
#!/bin/bash

echo "🚀 Deploying Scripture Quest to Vercel"

# Deploy backend
echo "📡 Deploying backend..."
cd backend
npm run build
vercel --prod --confirm

# Deploy frontend
echo "🌐 Deploying frontend..."
cd ..
npm run build:web
vercel --prod --confirm

echo "✅ Deployment complete!"
echo "Backend: https://scripture-quest-api.vercel.app"
echo "Frontend: https://scripture-quest.vercel.app"
```

### 3. Environment-Specific Deployments

#### Staging Deployment
```bash
# Backend staging
cd backend
vercel --target staging

# Frontend staging
cd ..
vercel --target staging
```

#### Production Deployment
```bash
# Backend production
cd backend
vercel --prod

# Frontend production
cd ..
vercel --prod
```

## Monitoring and Maintenance

### 1. Vercel Analytics

Enable in Vercel Dashboard:
- Web Analytics for frontend performance
- Function logs for backend monitoring
- Real-time metrics and alerts

### 2. Health Monitoring

Create monitoring script:
```bash
#!/bin/bash
# monitor-vercel.sh

API_URL="https://scripture-quest-api.vercel.app"
WEB_URL="https://scripture-quest.vercel.app"

# Check API health
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
if [ $API_STATUS -ne 200 ]; then
  echo "❌ API is down! Status: $API_STATUS"
  # Send alert (email, Slack, etc.)
else
  echo "✅ API is healthy"
fi

# Check web app
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $WEB_URL)
if [ $WEB_STATUS -ne 200 ]; then
  echo "❌ Web app is down! Status: $WEB_STATUS"
  # Send alert
else
  echo "✅ Web app is healthy"
fi
```

### 3. Performance Optimization

#### Backend Optimization
- Enable Vercel Edge Functions for better performance
- Use Vercel KV for Redis caching
- Optimize bundle size with tree shaking

#### Frontend Optimization
- Enable Vercel Speed Insights
- Optimize images with Vercel Image Optimization
- Use Vercel Edge Network for global distribution

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs in Vercel Dashboard
   # Or use CLI
   vercel logs
   ```

2. **Environment Variable Issues**
   ```bash
   # Verify environment variables
   vercel env ls
   
   # Add missing variables
   vercel env add MONGODB_URI
   ```

3. **CORS Errors**
   ```bash
   # Verify CORS_ORIGIN matches frontend URL
   # Check in Vercel Dashboard → Settings → Environment Variables
   ```

4. **Function Timeout**
   ```bash
   # Increase timeout in vercel.json
   "functions": {
     "dist/server.js": {
       "maxDuration": 60
     }
   }
   ```

### Debug Commands
```bash
# View deployment logs
vercel logs --follow

# Check function performance
vercel inspect

# Test locally with Vercel dev
vercel dev
```

## Security Considerations

### 1. Environment Variables
- Never commit secrets to Git
- Use Vercel's encrypted environment variables
- Rotate secrets regularly

### 2. Domain Security
- Enable HTTPS redirect
- Configure security headers
- Use Vercel's DDoS protection

### 3. API Security
- Implement rate limiting
- Validate all inputs
- Monitor for suspicious activity

## Cost Optimization

### 1. Vercel Pricing
- Hobby plan: Free for personal projects
- Pro plan: $20/month for commercial use
- Enterprise: Custom pricing for large scale

### 2. Optimization Tips
- Use Edge Functions for better performance
- Optimize bundle sizes
- Monitor function execution time
- Use caching effectively

## Backup and Recovery

### 1. Code Backup
- Git repositories on GitHub
- Vercel automatic deployments
- Local development backups

### 2. Database Backup
```bash
# MongoDB Atlas automatic backups
# Manual backup script
mongodump --uri="$MONGODB_URI" --out=backup/$(date +%Y%m%d)
```

### 3. Recovery Procedures
```bash
# Rollback deployment
vercel rollback

# Restore from backup
mongorestore --uri="$MONGODB_URI" backup/latest/
```

This guide ensures a smooth, secure, and scalable deployment of Scripture Quest on Vercel with proper monitoring and maintenance procedures.