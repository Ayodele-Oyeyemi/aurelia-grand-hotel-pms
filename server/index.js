/**
 * The Aurelia Grand & Suites — Express Backend Server
 * Monorepo PMS / Booking Engine API
 */

// Load environment variables if .env exists
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile();
  }
} catch (e) {
  // .env not present or already in environment
}

const express = require('express');
const cors = require('cors');
const store = require('./store/memoryStore');

const suitesRouter = require('./routes/suites');
const reservationsRouter = require('./routes/reservations');
const folioRouter = require('./routes/folio');
const housekeepingRouter = require('./routes/housekeeping');
const analyticsRouter = require('./routes/analytics');
const conciergeRouter = require('./routes/concierge');
const authRoutes = require('./routes/auth');
const keepAliveRouter = require('./routes/keepAlive');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root / Welcome Route
app.get('/', (req, res) => {
  res.json({
    hotel: 'The Aurelia Grand & Suites',
    location: 'Victoria Island, Lagos',
    version: '2.4.0',
    status: 'Operational',
    dataLayer: store.isSupabaseConfigured() ? 'Supabase' : 'Stateful In-Memory Engine',
    endpoints: {
      suites: '/api/suites',
      reservations: '/api/reservations',
      folio: '/api/folio/:reservationId',
      housekeeping: '/api/housekeeping',
      analytics: '/api/analytics',
      concierge: '/api/concierge',
      auth: '/api/auth',
      keepAlive: '/api/keep-alive'
    }
  });
});

// Health check endpoint
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dataLayer: store.getDataLayerInfo()
  });
});

// Mount API Routes
app.use('/api/suites', suitesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/folio', folioRouter);
app.use('/api/housekeeping', housekeepingRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/concierge', conciergeRouter);
app.use('/api/auth', authRoutes);
app.use('/api/keep-alive', keepAliveRouter);

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Server listener
if (require.main === module) {
  app.listen(PORT, () => {
    const layer = store.isSupabaseConfigured()
      ? 'Supabase Cloud Database (Connected)'
      : 'Stateful In-Memory Engine (Live Session Mutations Active)';

    console.log('================================================================');
    console.log('  ✦ THE AURELIA GRAND & SUITES — HOSPITALITY PMS SERVER ✦      ');
    console.log(`  Port:             http://localhost:${PORT}`);
    console.log(`  Active Data Layer: ${layer}`);
    console.log(`  Concierge AI:     ${process.env.GEMINI_API_KEY ? 'Gemini 2.5 Flash' : 'Smart Keyword Engine (Fallback Mode)'}`);
    console.log('================================================================');
  });
}

module.exports = app;
