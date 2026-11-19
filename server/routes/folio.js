/**
 * The Aurelia Grand & Suites — Folio Router
 * GET   /api/folio/:reservationId
 * POST  /api/folio/:reservationId
 * PATCH /api/folio/:reservationId/settle
 */

const express = require('express');
const router = express.Router();
const store = require('../store/memoryStore');

// GET /api/folio/:reservationId - Return all folio items for a reservation
router.get('/:reservationId', (req, res) => {
  try {
    const { reservationId } = req.params;
    const items = store.getFolioItems(reservationId);
    res.json(items);
  } catch (err) {
    console.error('Error fetching folio items:', err);
    res.status(500).json({ error: 'Failed to retrieve folio items' });
  }
});

// POST /api/folio/:reservationId - Add a folio charge/item
router.post('/:reservationId', (req, res) => {
  try {
    const { reservationId } = req.params;
    const { category, description, amount, quantity, is_paid, isPaid } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (amount === undefined || isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const item = store.addFolioItem(reservationId, {
      category: category || 'other',
      description,
      amount: Number(amount),
      quantity: quantity !== undefined ? Number(quantity) : 1,
      is_paid: is_paid || isPaid || false
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('Error adding folio item:', err);
    res.status(400).json({ error: err.message || 'Failed to add folio item' });
  }
});

// PATCH /api/folio/:reservationId/settle - Settle folio: mark all items paid and balance_due to 0
router.patch('/:reservationId/settle', (req, res) => {
  try {
    const { reservationId } = req.params;
    const result = store.settleFolio(reservationId);
    res.json(result);
  } catch (err) {
    console.error('Error settling folio:', err);
    res.status(400).json({ error: err.message || 'Failed to settle folio' });
  }
});

module.exports = router;
