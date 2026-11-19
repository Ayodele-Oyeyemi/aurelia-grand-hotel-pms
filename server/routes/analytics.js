/**
 * The Aurelia Grand & Suites — Analytics Router
 * GET /api/analytics
 */

const express = require('express');
const router = express.Router();
const store = require('../store/memoryStore');

// GET /api/analytics - High-level PMS KPIs & metrics
router.get('/', (req, res) => {
  try {
    const analytics = store.getAnalytics();
    res.json(analytics);
  } catch (err) {
    console.error('Error calculating analytics:', err);
    res.status(500).json({ error: 'Failed to retrieve analytics data' });
  }
});

module.exports = router;
