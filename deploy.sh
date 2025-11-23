#!/bin/bash

# Expense & Income Manager - Production Quick Deploy Script
# This script automates the production deployment process

set -e

echo "🚀 Production Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check Node.js and npm
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_status "Node.js found: $(node -v)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_status "npm found: $(npm -v)"

# Check if .env.production exists
echo ""
echo "🔐 Checking environment configuration..."

if [ -f "backend/.env.production" ]; then
    print_status "Backend production config found"
else
    print_warning "Backend production config not found"
    echo "Create backend/.env.production with:"
    echo "  MONGO_URI=<your_mongodb_uri>"
    echo "  JWT_SECRET=<your_jwt_secret>"
    echo "  NODE_ENV=production"
    echo "  ALLOWED_ORIGINS=https://yourdomain.com"
fi

if [ -f "frontend/.env.production" ]; then
    print_status "Frontend production config found"
else
    print_warning "Frontend production config not found"
    echo "Create frontend/.env.production with:"
    echo "  VITE_API_URL=https://api.yourdomain.com/api"
fi

# Build backend
echo ""
echo "🔨 Building backend..."
cd backend
npm install --production
print_status "Backend dependencies installed"

# Build frontend
echo ""
echo "🔨 Building frontend..."
cd ../frontend
npm install
npm run build
print_status "Frontend built successfully"
print_status "Output: frontend/dist"

# Run tests (optional)
echo ""
read -p "Run tests? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_warning "No test suite configured"
    print_warning "Manual testing recommended before deployment"
fi

# Summary
echo ""
echo "======================================"
echo "📦 Deployment Package Ready"
echo "======================================"
echo ""
echo "Backend:"
echo "  - Location: ./backend"
echo "  - Start: npm run prod"
echo "  - Environment: .env.production"
echo ""
echo "Frontend:"
echo "  - Location: ./frontend/dist"
echo "  - Deploy to: Vercel/Netlify"
echo "  - Environment: .env.production"
echo ""
echo "🚀 Next Steps:"
echo "  1. Backend → Deploy to Railway.app"
echo "  2. Frontend → Deploy to Vercel.app"
echo "  3. Update CORS_ORIGINS with deployed URL"
echo "  4. Update frontend API_URL"
echo "  5. Test health check: GET /health"
echo "  6. Monitor logs and performance"
echo ""
print_status "Deployment package ready!"
echo ""
