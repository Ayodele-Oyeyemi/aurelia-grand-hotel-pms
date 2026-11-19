/**
 * The Aurelia Grand & Suites — Suites Router
 * GET /api/suites
 * GET /api/suites/:id
 */

const express = require('express');
const router = express.Router();
const store = require('../store/memoryStore');

// GET /api/suites - List all suites with optional availability filter
router.get('/', (req, res) => {
  try {
    const { available_from, available_to, wing, category } = req.query;
    const suites = store.getSuites({ available_from, available_to, wing, category });
    res.json(suites);
  } catch (err) {
    console.error('Error fetching suites:', err);
    res.status(500).json({ error: 'Failed to retrieve suites' });
  }
});

// GET /api/suites/:id - Retrieve single suite by ID or slug
router.get('/:id', (req, res) => {
  try {
    const suite = store.getSuiteById(req.params.id);
    if (!suite) {
      return res.status(404).json({ error: `Suite '${req.params.id}' not found` });
    }
    res.json(suite);
  } catch (err) {
    console.error('Error fetching suite by id:', err);
    res.status(500).json({ error: 'Failed to retrieve suite' });
  }
});

module.exports = router;
