const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const { limiter, authLimiter, helmetConfig } = require('./middleware/security');

// Connect to MongoDB
connectDB();

const app = express();

// ============ SECURITY MIDDLEWARE ============
app.use(helmetConfig);

// CORS Configuration - More secure for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'])
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parser middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// General rate limiting
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============ ROUTES ============

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const groupRoutes = require('./routes/groupRoutes');
const sharedExpenseRoutes = require('./routes/sharedExpenseRoutes');

// Auth routes with stricter rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// Other routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/shared-expenses', sharedExpenseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'MongoDB'
  });
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Expense & Income Manager + Splitwise API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV
  });
});

// ============ ERROR HANDLING ============

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============ SERVER START ============

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   Expense & Income Manager API Server         ║
╠════════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}
║  🌍 Environment: ${process.env.NODE_ENV}
║  📊 Database: MongoDB (${process.env.MONGO_URI ? 'Connected' : 'Connecting...'})
║  🔐 Auth: JWT + Helmet Security
║  🛡️  Rate Limiting: Enabled
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⏸️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⏸️  SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
