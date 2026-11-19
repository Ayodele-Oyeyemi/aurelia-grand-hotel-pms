/**
 * The Aurelia Grand & Suites — Reservations Router
 * GET /api/reservations
 * GET /api/reservations/:id
 * POST /api/reservations
 * PATCH /api/reservations/:id
 */

const express = require('express');
const router = express.Router();
const store = require('../store/memoryStore');

// GET /api/reservations - List all reservations with optional filters
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    const reservations = store.getReservations({ status, search });
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Failed to retrieve reservations' });
  }
});

// GET /api/reservations/:id - Retrieve single reservation by ID or booking reference
router.get('/:id', (req, res) => {
  try {
    const reservation = store.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: `Reservation '${req.params.id}' not found` });
    }
    res.json(reservation);
  } catch (err) {
    console.error('Error fetching reservation by id:', err);
    res.status(500).json({ error: 'Failed to retrieve reservation' });
  }
});

// POST /api/reservations - Create a new reservation
router.post('/', (req, res) => {
  try {
    const body = req.body;
    const suiteId = body.suiteId || body.suite_id;
    const checkIn = body.checkIn || body.check_in;
    const checkOut = body.checkOut || body.check_out;

    if (!suiteId) {
      return res.status(400).json({ error: 'suiteId is required' });
    }
    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: 'checkIn and checkOut dates are required' });
    }
    if (!body.guestId && !body.guest_id && !body.guestInfo) {
      return res.status(400).json({ error: 'guestId or guestInfo must be provided' });
    }

    const reservation = store.createReservation(body);
    res.status(201).json(reservation);
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(400).json({ error: err.message || 'Failed to create reservation' });
  }
});

// PATCH /api/reservations/:id - Update reservation (status changes, check-in, check-out, room assignment)
router.patch('/:id', (req, res) => {
  try {
    const updated = store.updateReservation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: `Reservation '${req.params.id}' not found` });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating reservation:', err);
    res.status(400).json({ error: err.message || 'Failed to update reservation' });
  }
});

module.exports = router;
