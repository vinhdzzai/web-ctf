const { db } = require("../database/db");

function search(req, res) {
  const keyword = String(req.query.q || "").trim();

  // VULNERABLE LAB: user input is concatenated directly into SQL
  const sql = `
    SELECT id, title, price
    FROM products
    WHERE title LIKE '%${keyword}%'
  `;

  const rows = db.prepare(sql).all();

  // If the client accepts JSON, return JSON
  if (req.accepts("json") && !req.accepts("html")) {
    return res.json({ products: rows });
  }

  // Otherwise return a simple HTML page with results
  const itemsHtml = rows
    .map(
      (p) =>
        `<li><strong>${escapeHtml(p.title)}</strong> — <span class="muted">${p.price.toLocaleString()} VND</span></li>`,
    )
    .join("");

  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Tìm kiếm tour: ${escapeHtml(keyword)}</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="books-shell">
          <header class="books-header">
            <div>
              <p class="eyebrow">Travelly</p>
              <h1>Kết quả tìm kiếm</h1>
              <p>"${escapeHtml(keyword)}" — ${rows.length} kết quả</p>
            </div>
            <a class="back-link" href="/travel/books">← Quay lại</a>
          </header>

          <section style="padding:16px; display:flex; justify-content:center;">
            <div class="search-results-card">
              <ul>
                ${itemsHtml || '<li class="muted">Không tìm thấy kết quả</li>'}
              </ul>
            </div>
          </section>
        </div>
      </body>
    </html>
  `);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = { search };
