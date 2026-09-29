const express = require('express');
const { dispatchInternalRequest } = require('../internal/console');

const router = express.Router();
const allowedOrigins = new Set([
  'http://127.0.0.1:3000',
  'http://localhost:3000'
]);

router.get('/', async (req, res) => {
  try {
    const target = new URL(req.query.feed);

    // VULN: this simulates an SSRF pivot into a virtual internal console; it never makes a network request.
    if (!allowedOrigins.has(target.origin) || target.username || target.password) {
      return res.status(400).type('text/plain').send('Feed URL must point to the internal station console.');
    }

    for (const [key, rawValue] of Object.entries(req.query)) {
      if (key === 'feed' || key === 'method') continue;
      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      for (const value of values) target.searchParams.append(key, value);
    }

    const method = String(req.query.method || 'GET').toUpperCase();
    const result = await dispatchInternalRequest(method, target);
    res.status(result.status).type(result.contentType).send(result.body);
  } catch (error) {
    res.status(400).type('text/plain').send(`Feed URL error: ${error.message}`);
  }
});

module.exports = router;
