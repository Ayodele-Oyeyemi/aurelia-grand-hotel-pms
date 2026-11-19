/**
 * The Aurelia Grand & Suites — Keep-Alive Route
 * Prevents Render backend cold-starts and Supabase connection drops
 * by executing a lightweight real query on every ping.
 */

const express = require('express');
const router = express.Router();
const store = require('../store/memoryStore');

/**
 * GET /api/keep-alive
 *
 * Performs a live Supabase query (SELECT id FROM suites LIMIT 1) when
 * Supabase is configured; falls back gracefully to in-memory mode.
 * Returns a JSON payload with status, database ping result, and timestamp.
 */
router.get('/', async (req, res) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const isSupabase = store.isSupabaseConfigured();

  let databaseStatus = 'in-memory (no Supabase credentials)';
  let databaseLatencyMs = null;
  let error = null;

  if (isSupabase) {
    try {
      // Retrieve the raw supabase client from the store
      const supabase = store.getSupabaseClient();

      if (supabase) {
        const dbStart = Date.now();
        const { data, error: dbError } = await supabase
          .from('suites')
          .select('id')
          .limit(1);

        databaseLatencyMs = Date.now() - dbStart;

        if (dbError) {
          // Table may not exist yet (schema not applied) — still alive
          databaseStatus = `supabase-connected (query error: ${dbError.message})`;
          error = dbError.message;
        } else {
          databaseStatus = data && data.length > 0
            ? 'supabase-pinged (suite row confirmed)'
            : 'supabase-pinged (table empty or not seeded)';
        }
      } else {
        databaseStatus = 'supabase-configured (client unavailable)';
      }
    } catch (pingErr) {
      databaseStatus = `supabase-error: ${pingErr.message}`;
      error = pingErr.message;
    }
  }

  const totalLatencyMs = Date.now() - start;

  return res.json({
    status: 'alive',
    hotel: 'The Aurelia Grand & Suites',
    database: databaseStatus,
    dataLayer: isSupabase ? 'supabase' : 'in-memory',
    timestamp,
    latency: {
      total_ms: totalLatencyMs,
      database_ms: databaseLatencyMs
    },
    ...(error && { warning: error })
  });
});

module.exports = router;

