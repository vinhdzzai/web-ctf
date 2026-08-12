const path = require("path");
const crypto = require("crypto");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "..", "database", "app.sqlite");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS flagggg (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flagabc123 TEXT NOT NULL,
    fakeflag TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price INTEGER NOT NULL
  );
`);

const insertDefaultUser = db.prepare(`
  INSERT OR IGNORE INTO users (username, password)
  VALUES (?, ?)
`);

const insertDefaultFlag = db.prepare(`
  INSERT OR IGNORE INTO flagggg (id, flagabc123, fakeflag)
  VALUES (1, ?, ?)
`);
insertDefaultFlag.run(
  "Flag{this_is_the_first_flaggg}",
  crypto.randomBytes(8).toString("hex"),
);

const insertDefaultProducts = db.prepare(`
  INSERT OR IGNORE INTO products (id, title, price)
  VALUES (1, 'Đà Nẵng - Hội An - Bà Nà', 2990000),
         (2, 'Ninh Bình - Tràng An - Hang Múa', 1990000),
         (3, 'Sapa - Fansipan - Bản Cát Cát', 3990000)
`);
insertDefaultProducts.run();

function getUserByUsername(username, password = null) {
  const Username = String(username ?? "");
  const Password = password == null ? null : String(password);

  const sql =
    password == null
      ? `SELECT CAST(id AS TEXT) AS id, CAST(username AS TEXT) AS username, CAST(password AS TEXT) AS password FROM users WHERE username = '${Username}'`
      : `SELECT CAST(id AS TEXT) AS id, CAST(username AS TEXT) AS username, CAST(password AS TEXT) AS password FROM users WHERE username = '${Username}' AND password = '${Password}'`;

  const user = db.prepare(sql).get();

  return user || null;
}

function createUser(username, password) {
  const result = db
    .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    .run(username, password);

  return { id: result.lastInsertRowid, username, password };
}

function createSession(sessionId, username, ttlMs = 1000 * 60 * 60) {
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  db.prepare("DELETE FROM sessions WHERE username = ?").run(username);

  db.prepare(
    `
    INSERT INTO sessions (id, username, expires_at)
    VALUES (?, ?, ?)
  `,
  ).run(sessionId, username, expiresAt);

  return sessionId;
}

function getSessionUsername(sessionId) {
  const row = db
    .prepare("SELECT username, expires_at FROM sessions WHERE id = ?")
    .get(sessionId);
  if (!row) return null;

  if (new Date(row.expires_at) <= new Date()) {
    deleteSession(sessionId);
    return null;
  }

  return row.username;
}

function deleteSession(sessionId) {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}

module.exports = {
  db,
  getUserByUsername,
  createUser,
  createSession,
  getSessionUsername,
  deleteSession,
};
