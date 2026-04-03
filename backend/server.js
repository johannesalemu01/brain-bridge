require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');

// ── Routes ──
const authRoutes = require('./src/routes/auth.routes');
const plannerRoutes = require('./src/routes/planner.routes');
const qaRoutes = require('./src/routes/qa.routes');
const voiceRoutes = require('./src/routes/voice.routes');

const app = express();

// ── DB ──
connectDB();

// ── Security ──
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many requests, please try again later.',
  })
);

// ── Parsers ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/voice', voiceRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🧠 BrainBridge AI API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 BrainBridge API running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
