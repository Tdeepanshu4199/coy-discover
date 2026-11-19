require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const feedRoutes = require('./routes/feedRoutes');
const swipeRoutes = require('./routes/swipeRoutes');
const matchRoutes = require('./routes/matchRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes (supporting both /api/* and root /* as required by the prompt)
app.use('/api/feed', feedRoutes);
app.use('/feed', feedRoutes);

app.use('/api/swipe', swipeRoutes);
app.use('/swipe', swipeRoutes);

app.use('/api/matches', matchRoutes);
app.use('/matches', matchRoutes);

// Helper endpoints
const { getDemoUser, resetDemoState } = require('./controllers/matchController');
app.get('/api/me', getDemoUser);
app.get('/me', getDemoUser);
app.post('/api/reset', resetDemoState);
app.post('/reset', resetDemoState);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start server if not imported by test suite
if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 [Coy Backend Server] Running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to database during startup:', err);
    });
}

module.exports = app;
