/**
 * The Aurelia Grand & Suites — Housekeeping Router
 * GET   /api/housekeeping
 * PATCH /api/housekeeping/:roomNumber
 */

const express = require('express');
const router = express.Router();
const store = require('../store/memoryStore');

// GET /api/housekeeping - Return all housekeeping tasks sorted by floor and room number
router.get('/', (req, res) => {
  try {
    const tasks = store.getHousekeepingTasks();
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching housekeeping tasks:', err);
    res.status(500).json({ error: 'Failed to retrieve housekeeping tasks' });
  }
});

// PATCH /api/housekeeping/:roomNumber - Update task status, attendant, priority, or notes
router.patch('/:roomNumber', (req, res) => {
  try {
    const { roomNumber } = req.params;
    const updated = store.updateHousekeepingTask(roomNumber, req.body);
    if (!updated) {
      return res.status(404).json({ error: `Housekeeping task for room '${roomNumber}' not found` });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating housekeeping task:', err);
    res.status(400).json({ error: err.message || 'Failed to update housekeeping task' });
  }
});

module.exports = router;
