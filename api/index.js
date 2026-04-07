import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import connectDB from '../server/config/db.js';
import mongoose from 'mongoose';

// Import routes
import authRoutes from '../server/routes/authRoutes.js';
import clientRoutes from '../server/routes/clientRoutes.js';
import userRoutes from '../server/routes/userRoutes.js';
import aiRoutes from '../server/routes/aiRoutes.js';
import adminRoutes from '../server/routes/adminRoutes.js';
import { getApplicationById } from '../server/controllers/applicationController.js';
import { protect } from '../server/middleware/auth.js';

// Connect to MongoDB (cached for serverless)
let isConnected = false;
const connectIfNeeded = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};
connectIfNeeded().catch(console.error);

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration — allow localhost + any Vercel deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman) and listed origins
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==================== ROUTES ====================

// Health check
app.get('/api/health', async (req, res) => {
  await connectIfNeeded().catch(() => {});
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const dbName = mongoose.connection.name;
  res.status(200).json({
    success: true,
    message: 'Server is running',
    dbStatus,
    dbName,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/health', async (req, res) => {
  await connectIfNeeded().catch(() => {});
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ success: true, message: 'OK', dbStatus });
});

// Root API route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to TalentorAI Job Portal API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Application details route
app.get('/api/applications/:id', protect, getApplicationById);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
