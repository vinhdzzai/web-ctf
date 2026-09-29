const { listUnpublishedReports, searchReports } = require('../database/database');

function result(status, contentType, body) {
  return { status, contentType, body };
}

function consoleIndex() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>PUNX-1 Internal Ops Console</title>
<style>body{margin:24px;background:#e9ebf3;color:#222;font:14px Arial,sans-serif}main{max-width:760px}fieldset{border:1px solid #888;margin:0 0 16px;padding:12px}legend{font-weight:bold;color:#444}code{color:#174b77}</style></head>
<body><main><p>GALAXY OBSERVATORY / INTERNAL NETWORK</p><h1>PUNX-1 Operations Console</h1>
<p>Station services available on this loopback console:</p><fieldset><legend>ROUTE INDEX</legend><ul>
<li><code>GET /health</code> — health check</li>
<li><code>GET /feed</code> — unpublished articles for pre-publication review</li>
<li><code>GET or POST /report?search=&lt;query&gt;</code> — search internal station reports</li>
</ul></fieldset><p>Console address: 127.0.0.1:3000</p></main></body></html>`;
}

async function dispatchInternalRequest(method, target) {
  if (target.pathname === '/' && method === 'GET') {
    return result(200, 'text/html; charset=utf-8', consoleIndex());
  }

  if (target.pathname === '/health' && method === 'GET') {
    return result(200, 'application/json', JSON.stringify({ status: 'ok', service: 'punx-1-ops-console' }));
  }

  if (target.pathname === '/feed' && method === 'GET') {
    const articles = await listUnpublishedReports();
    return result(200, 'application/json', JSON.stringify({ articles }));
  }

  if (target.pathname === '/report' && (method === 'GET' || method === 'POST')) {
    try {
      const reports = await searchReports(target.searchParams.get('search') || '');
      return result(200, 'application/json', JSON.stringify({ reports }));
    } catch (error) {
      return result(500, 'application/json', JSON.stringify({ error: error.message }));
    }
  }

  return result(404, 'application/json', JSON.stringify({ error: 'Internal endpoint not found.' }));
}

module.exports = { dispatchInternalRequest };
