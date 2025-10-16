#!/bin/bash

# Scripture Quest Setup Script
# This script sets up the development environment for Scripture Quest

set -e

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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Node.js if not present
install_nodejs() {
    if ! command_exists node; then
        log_info "Installing Node.js..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                brew install node
            else
                log_error "Homebrew not found. Please install Node.js manually from https://nodejs.org"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        else
            log_error "Unsupported OS. Please install Node.js manually from https://nodejs.org"
            exit 1
        fi
        
        log_success "Node.js installed successfully"
    else
        log_success "Node.js is already installed ($(node --version))"
    fi
}

# Install Docker if not present
install_docker() {
    if ! command_exists docker; then
        log_info "Installing Docker..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            log_info "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            curl -fsSL https://get.docker.com -o get-docker.sh
            sh get-docker.sh
            sudo usermod -aG docker $USER
            log_warning "Please log out and log back in for Docker permissions to take effect"
        fi
        
        log_success "Docker installation initiated"
    else
        log_success "Docker is already installed ($(docker --version))"
    fi
}

# Install MongoDB if not present
install_mongodb() {
    if ! command_exists mongosh; then
        log_info "Installing MongoDB tools..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            if command_exists brew; then
                brew tap mongodb/brew
                brew install mongodb-community
                brew install mongosh
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
            sudo apt-get update
            sudo apt-get install -y mongodb-mongosh
        fi
        
        log_success "MongoDB tools installed"
    else
        log_success "MongoDB tools are already installed"
    fi
}

# Install Expo CLI
install_expo() {
    if ! command_exists expo; then
        log_info "Installing Expo CLI..."
        npm install -g @expo/cli
        log_success "Expo CLI installed"
    else
        log_success "Expo CLI is already installed"
    fi
}

# Install EAS CLI
install_eas() {
    if ! command_exists eas; then
        log_info "Installing EAS CLI..."
        npm install -g eas-cli
        log_success "EAS CLI installed"
    else
        log_success "EAS CLI is already installed"
    fi
}

# Setup environment files
setup_environment() {
    log_info "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        log_info "Created backend/.env from example"
        log_warning "Please update backend/.env with your configuration"
    fi
    
    # Frontend environment
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log_info "Created .env from example"
        log_warning "Please update .env with your configuration"
    fi
    
    log_success "Environment files setup completed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Backend dependencies
    log_info "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Frontend dependencies
    log_info "Installing frontend dependencies..."
    npm install
    
    log_success "Dependencies installed successfully"
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    # Check if MongoDB is running locally
    if command_exists mongosh; then
        if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
            log_info "Local MongoDB is running, initializing database..."
            mongosh scripture-quest backend/mongo-init.js
            log_success "Local database initialized"
        else
            log_warning "Local MongoDB is not running"
            log_info "Please start MongoDB or configure MongoDB Atlas"
        fi
    else
        log_info "MongoDB not installed locally"
        log_info "Please configure MongoDB Atlas in your environment files"
    fi
}

# Verify setup
verify_setup() {
    log_info "Verifying setup..."
    
    # Check backend
    cd backend
    if npm run build > /dev/null 2>&1; then
        log_success "Backend builds successfully"
    else
        log_error "Backend build failed"
        exit 1
    fi
    cd ..
    
    # Check frontend
    if npm run lint > /dev/null 2>&1; then
        log_success "Frontend linting passed"
    else
        log_warning "Frontend linting issues found"
    fi
    
    log_success "Setup verification completed"
}

# Main setup function
main() {
    echo "🏗️  Scripture Quest Development Environment Setup"
    echo "================================================"
    
    install_nodejs
    install_docker
    install_mongodb
    install_expo
    install_eas
    setup_environment
    install_dependencies
    setup_database
    verify_setup
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update environment files with your configuration:"
    echo "   - backend/.env (MongoDB URI, JWT secrets, API keys)"
    echo "   - .env (API URL, feature flags)"
    echo ""
    echo "2. Start development servers:"
    echo "   Backend:  cd backend && npm run dev"
    echo "   Frontend: npm run dev"
    echo ""
    echo "3. Access the application:"
    echo "   - Backend API: http://localhost:3000"
    echo "   - API Docs: http://localhost:3000/api-docs"
    echo "   - Frontend: http://localhost:8081 (or scan QR code)"
    echo ""
    echo "4. For production deployment:"
    echo "   ./scripts/deploy.sh production full-stack"
    echo ""
    echo "📚 Documentation:"
    echo "   - Backend: backend/DEPLOYMENT.md"
    echo "   - Frontend: DEPLOYMENT.md"
    echo "   - Full Stack: FULL_STACK_DEPLOYMENT.md"
}

# Run main function
main "$@"