#!/bin/bash

# Scripture Quest Deployment Script
# Usage: ./scripts/deploy.sh [environment] [component]
# Example: ./scripts/deploy.sh production full-stack

set -e

ENVIRONMENT=${1:-development}
COMPONENT=${2:-full-stack}

echo "🚀 Deploying Scripture Quest - Environment: $ENVIRONMENT, Component: $COMPONENT"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check environment file
    if [ "$ENVIRONMENT" = "production" ] && [ ! -f ".env.production" ]; then
        log_error "Production environment file not found"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Deploy backend
deploy_backend() {
    log_info "Deploying backend..."
    
    cd backend
    
    # Install dependencies
    npm ci
    
    # Run tests
    log_info "Running backend tests..."
    npm test
    
    # Build application
    log_info "Building backend..."
    npm run build
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # Deploy to production
        if command -v vercel &> /dev/null; then
            log_info "Deploying to Vercel..."
            vercel --prod --yes
        elif command -v eb &> /dev/null; then
            log_info "Deploying to Elastic Beanstalk..."
            eb deploy
        else
            log_warning "No deployment tool found, using Docker..."
            docker build -t scripture-quest-api .
            docker run -d --name scripture-quest-api -p 3000:3000 --env-file ../.env.production scripture-quest-api
        fi
    else
        # Development deployment
        log_info "Starting development server..."
        npm run dev &
    fi
    
    cd ..
    log_success "Backend deployment completed"
}

# Deploy frontend
deploy_frontend() {
    log_info "Deploying frontend..."
    
    # Install dependencies
    npm ci
    
    # Run tests
    log_info "Running frontend tests..."
    npm test
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # Build for web
        log_info "Building for web..."
        npm run build:web
        
        # Deploy web version
        if command -v vercel &> /dev/null; then
            log_info "Deploying web to Vercel..."
            vercel --prod --yes
        fi
        
        # Build mobile apps
        if command -v eas &> /dev/null; then
            log_info "Building mobile apps..."
            eas build --platform all --profile production --non-interactive
        fi
    else
        # Development deployment
        log_info "Starting development server..."
        npm run dev &
    fi
    
    log_success "Frontend deployment completed"
}

# Deploy full stack with Docker
deploy_full_stack() {
    log_info "Deploying full stack with Docker..."
    
    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Copy environment file
    if [ "$ENVIRONMENT" = "production" ]; then
        cp .env.production .env
    else
        cp .env.example .env
    fi
    
    # Build and start services
    log_info "Building Docker images..."
    docker-compose -f docker-compose.full-stack.yml build
    
    log_info "Starting services..."
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.full-stack.yml --profile production up -d
    else
        docker-compose -f docker-compose.full-stack.yml up -d
    fi
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "Backend is healthy"
    else
        log_error "Backend health check failed"
        exit 1
    fi
    
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "Frontend is healthy"
    else
        log_error "Frontend health check failed"
        exit 1
    fi
    
    log_success "Full stack deployment completed"
}

# Database setup
setup_database() {
    log_info "Setting up database..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Production database setup should be done manually"
        log_info "Please ensure MongoDB Atlas is configured and accessible"
    else
        # Local database setup
        if command -v mongosh &> /dev/null; then
            log_info "Initializing local database..."
            mongosh "$MONGODB_URI" backend/mongo-init.js
        else
            log_warning "MongoDB shell not found, skipping database initialization"
        fi
    fi
    
    log_success "Database setup completed"
}

# SSL setup
setup_ssl() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Setting up SSL certificates..."
        
        if command -v certbot &> /dev/null; then
            # Generate SSL certificates
            sudo certbot certonly --standalone \
                -d api.scripturequest.com \
                -d scripturequest.com \
                --non-interactive \
                --agree-tos \
                --email admin@scripturequest.com
            
            # Copy certificates
            sudo cp /etc/letsencrypt/live/api.scripturequest.com/fullchain.pem ssl/cert.pem
            sudo cp /etc/letsencrypt/live/api.scripturequest.com/privkey.pem ssl/key.pem
            sudo chown $(whoami):$(whoami) ssl/*.pem
            
            log_success "SSL certificates configured"
        else
            log_warning "Certbot not found, SSL setup skipped"
        fi
    fi
}

# Monitoring setup
setup_monitoring() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Setting up monitoring..."
        
        # Start monitoring services
        docker-compose -f docker-compose.full-stack.yml --profile monitoring up -d
        
        log_info "Monitoring services started:"
        log_info "- Prometheus: http://localhost:9090"
        log_info "- Grafana: http://localhost:3001 (admin/admin)"
        
        log_success "Monitoring setup completed"
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    
    # Stop background processes
    pkill -f "npm run dev" || true
    
    # Remove temporary files
    rm -f .env.tmp
    
    log_success "Cleanup completed"
}

# Trap cleanup on exit
trap cleanup EXIT

# Main deployment logic
main() {
    check_prerequisites
    
    case $COMPONENT in
        "backend")
            deploy_backend
            ;;
        "frontend")
            deploy_frontend
            ;;
        "full-stack")
            setup_database
            deploy_full_stack
            setup_ssl
            setup_monitoring
            ;;
        *)
            log_error "Invalid component: $COMPONENT"
            log_info "Valid components: backend, frontend, full-stack"
            exit 1
            ;;
    esac
    
    log_success "🎉 Scripture Quest deployment completed successfully!"
    
    # Display access information
    echo ""
    echo "📱 Access Information:"
    if [ "$COMPONENT" = "backend" ] || [ "$COMPONENT" = "full-stack" ]; then
        echo "   Backend API: http://localhost:3000"
        echo "   API Docs: http://localhost:3000/api-docs"
        echo "   Health Check: http://localhost:3000/health"
    fi
    
    if [ "$COMPONENT" = "frontend" ] || [ "$COMPONENT" = "full-stack" ]; then
        echo "   Frontend Web: http://localhost"
        echo "   Mobile App: Use Expo Go app with QR code"
    fi
    
    if [ "$COMPONENT" = "full-stack" ] && [ "$ENVIRONMENT" = "production" ]; then
        echo "   Monitoring:"
        echo "   - Prometheus: http://localhost:9090"
        echo "   - Grafana: http://localhost:3001"
    fi
}

# Run main function
main "$@"