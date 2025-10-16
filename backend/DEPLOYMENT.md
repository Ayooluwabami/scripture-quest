# Scripture Quest Backend Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Deployment](#cloud-deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

### Required Software
- Node.js 18+ and npm
- MongoDB 6.0+
- Redis 7+ (optional, for caching)
- Docker and Docker Compose (for containerized deployment)

### Required Accounts
- MongoDB Atlas account (for cloud database)
- AWS account (for cloud deployment)
- Domain registrar account (for custom domain)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/scripture-quest.git
cd scripture-quest/backend
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
# Environment
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
SESSION_SECRET=your-super-secret-session-key-min-32-characters

# CORS
CORS_ORIGIN=http://localhost:8081

# External APIs
BIBLE_API_KEY=your-bible-api-key

# Redis (optional)
REDIS_URL=redis://localhost:6379

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

## Local Development

### 1. Start Development Server
```bash
npm run dev
```

### 2. Run Tests
```bash
# Unit tests
npm test

# Test with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### 3. Linting and Type Checking
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npx tsc --noEmit
```

### 4. API Documentation
Access Swagger documentation at: `http://localhost:3000/api-docs`

## Docker Deployment

### 1. Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### 2. Production Docker Build
```bash
# Build production image
docker build -t scripture-quest-api .

# Run container
docker run -d \
  --name scripture-quest-api \
  -p 3000:3000 \
  --env-file .env.production \
  scripture-quest-api
```

### 3. Docker Environment Variables
Create `.env.production` for production deployment:
```env
NODE_ENV=production
MONGODB_URI=
JWT_SECRET=production-jwt-secret-key
SESSION_SECRET=production-session-secret-key
CORS_ORIGIN=https://scripturequest.com
```

## Cloud Deployment

### Option 1: AWS Elastic Beanstalk

#### 1. Install EB CLI
```bash
pip install awsebcli
```

#### 2. Initialize Elastic Beanstalk
```bash
eb init scripture-quest-api
```

#### 3. Create Environment
```bash
eb create production
```

#### 4. Deploy
```bash
# Build application
npm run build

# Deploy to EB
eb deploy
```

#### 5. Set Environment Variables
```bash
eb setenv NODE_ENV=production \
  MONGODB_URI=mongodb+srv://... \
  JWT_SECRET=... \
  SESSION_SECRET=... \
  CORS_ORIGIN=https://scripturequest.com
```

### Option 2: Vercel

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
vercel --prod
```

#### 3. Configure Environment Variables
In Vercel dashboard, add:
- `NODE_ENV=production`
- `MONGODB_URI=mongodb+srv://...`
- `JWT_SECRET=...`
- `SESSION_SECRET=...`
- `CORS_ORIGIN=https://scripturequest.com`

### Option 3: AWS ECS with Fargate

#### 1. Build and Push to ECR
```bash
# Create ECR repository
aws ecr create-repository --repository-name scripture-quest-api

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag image
docker build -t scripture-quest-api .
docker tag scripture-quest-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/scripture-quest-api:latest

# Push image
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/scripture-quest-api:latest
```

#### 2. Create ECS Task Definition
```json
{
  "family": "scripture-quest-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "scripture-quest-api",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/scripture-quest-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:scripture-quest/mongodb-uri"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/scripture-quest-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## Database Setup

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create new cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string

### Local MongoDB Setup
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connect to MongoDB
mongosh
```

### Database Initialization
```bash
# Run database initialization
node scripts/init-db.js
```

## SSL/TLS Configuration

### 1. Obtain SSL Certificate
```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d api.scripturequest.com
```

### 2. Configure Nginx
Update `nginx.conf` with your SSL certificate paths.

### 3. Auto-renewal
```bash
# Add to crontab
0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Maintenance

### 1. Health Checks
The API includes health check endpoints:
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

### 2. Logging
Logs are stored in:
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs

### 3. Monitoring Setup
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

### 4. Backup Strategy
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://..." --out=backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="backup/$DATE"
aws s3 cp backup/$DATE s3://scripture-quest-backups/ --recursive
```

## Performance Optimization

### 1. Database Optimization
- Ensure proper indexing
- Use aggregation pipelines for complex queries
- Implement connection pooling

### 2. Caching Strategy
```javascript
// Redis caching example
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache frequently accessed data
app.get('/api/v1/games', async (req, res) => {
  const cacheKey = `games:${JSON.stringify(req.query)}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Fetch from database and cache
  const games = await Game.find(filter);
  await client.setex(cacheKey, 300, JSON.stringify(games)); // 5 min cache
  
  res.json(games);
});
```

### 3. Load Balancing
Configure multiple instances behind a load balancer:
```yaml
# docker-compose.yml for load balancing
version: '3.8'
services:
  api1:
    build: .
    environment:
      - INSTANCE_ID=1
  api2:
    build: .
    environment:
      - INSTANCE_ID=2
  nginx:
    image: nginx
    ports:
      - "80:80"
    depends_on:
      - api1
      - api2
```

## Security Checklist

- [ ] Environment variables secured
- [ ] JWT secrets are strong (32+ characters)
- [ ] Database access restricted
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Audit logging enabled
- [ ] SSL/TLS certificates installed
- [ ] Security headers configured
- [ ] Dependencies updated

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check connection string
   mongosh "mongodb+srv://..."
   
   # Verify IP whitelist in MongoDB Atlas
   ```

2. **JWT Token Issues**
   ```bash
   # Verify JWT secret length
   node -e "console.log(process.env.JWT_SECRET.length)"
   ```

3. **CORS Errors**
   ```bash
   # Check CORS_ORIGIN matches frontend URL
   curl -H "Origin: http://localhost:8081" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS http://localhost:3000/api/v1/auth/login
   ```

### Log Analysis
```bash
# View error logs
tail -f logs/error.log

# Search for specific errors
grep "AUTHENTICATION_ERROR" logs/combined.log

# Monitor API requests
tail -f logs/combined.log | grep "POST /api/v1"
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancers (AWS ALB, Nginx)
- Implement session storage in Redis
- Use CDN for static assets

### Database Scaling
- MongoDB sharding for large datasets
- Read replicas for read-heavy operations
- Connection pooling optimization

### Caching Strategy
- Redis for session management
- Application-level caching for frequently accessed data
- CDN for static content

## Support and Maintenance

### Regular Tasks
- Monitor error logs daily
- Update dependencies monthly
- Backup database weekly
- Review security logs weekly
- Performance monitoring continuous

### Emergency Procedures
1. **Service Down**
   - Check health endpoints
   - Review error logs
   - Restart services if needed
   - Notify users if extended downtime

2. **Database Issues**
   - Check MongoDB Atlas status
   - Verify connection strings
   - Restore from backup if needed

3. **Security Incident**
   - Rotate JWT secrets
   - Review audit logs
   - Update affected users
   - Patch vulnerabilities immediately