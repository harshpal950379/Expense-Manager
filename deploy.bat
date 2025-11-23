@echo off
REM Expense & Income Manager - Production Quick Deploy Script (Windows)
REM This script automates the production deployment process

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🚀 Production Deployment Script
echo ========================================
echo.

REM Check Node.js
echo 📋 Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm found: %NPM_VERSION%

REM Check environment configuration
echo.
echo 🔐 Checking environment configuration...

if exist "backend\.env.production" (
    echo ✅ Backend production config found
) else (
    echo ⚠️  Backend production config not found
    echo Create backend\.env.production with:
    echo   MONGO_URI=^<your_mongodb_uri^>
    echo   JWT_SECRET=^<your_jwt_secret^>
    echo   NODE_ENV=production
    echo   ALLOWED_ORIGINS=https://yourdomain.com
)

if exist "frontend\.env.production" (
    echo ✅ Frontend production config found
) else (
    echo ⚠️  Frontend production config not found
    echo Create frontend\.env.production with:
    echo   VITE_API_URL=https://api.yourdomain.com/api
)

REM Build backend
echo.
echo 🔨 Building backend...
cd backend
call npm install --production
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend build failed
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..

REM Build frontend
echo.
echo 🔨 Building frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend dependencies failed
    exit /b 1
)
echo ✅ Frontend dependencies installed

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend build failed
    exit /b 1
)
echo ✅ Frontend built successfully
echo ✅ Output: frontend\dist
cd ..

REM Summary
echo.
echo ========================================
echo 📦 Deployment Package Ready
echo ========================================
echo.
echo Backend:
echo   - Location: .\backend
echo   - Start: npm run prod
echo   - Environment: .env.production
echo.
echo Frontend:
echo   - Location: .\frontend\dist
echo   - Deploy to: Vercel/Netlify
echo   - Environment: .env.production
echo.
echo 🚀 Next Steps:
echo   1. Backend → Deploy to Railway.app
echo   2. Frontend → Deploy to Vercel.app
echo   3. Update CORS_ORIGINS with deployed URL
echo   4. Update frontend API_URL
echo   5. Test health check: GET /health
echo   6. Monitor logs and performance
echo.
echo ✅ Deployment package ready!
echo.

pause
