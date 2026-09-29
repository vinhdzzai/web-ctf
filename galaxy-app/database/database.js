const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const databasePath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'store', 'galaxy.sqlite');
let connection;

function getConnection() {
  if (!connection) connection = new sqlite3.Database(databasePath);
  return connection;
}

function run(db, sql, parameters = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, parameters, function onRun(error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

function get(db, sql, parameters = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, parameters, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function all(db, sql, parameters = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, parameters, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

async function initializeDatabase() {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new sqlite3.Database(databasePath);

  await run(db, 'PRAGMA journal_mode = WAL');
  await run(db, `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin'))
  )`);
  await run(db, `CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    published INTEGER NOT NULL DEFAULT 0,
    summary TEXT NOT NULL DEFAULT ''
  )`);

  // VULN: weak seeded passwords keep the SQLi-exposed bcrypt hashes recoverable with a wordlist.
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  const seedUsers = [
    ['astronaut', 'orbit123', 'user'],
    ['stargazer', 'nebula42', 'user'],
    ['cosmonaut', 'milkyway7', 'user'],
    ['radio_operator', 'pulsar88', 'user'],
    ['adm1nistator', adminPassword, 'admin']
  ];
  for (const [username, password, role] of seedUsers) {
    const existingUser = await get(db, 'SELECT id FROM users WHERE username = ?', [username]);
    if (!existingUser) {
      await run(db, 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [
        username,
        bcrypt.hashSync(password, 10),
        role
      ]);
    }
  }

  const reportCount = await get(db, 'SELECT COUNT(*) AS count FROM reports');
  if (reportCount.count === 0) {
    const reports = [
      ['Tín hiệu vô tuyến từ Dải Ngân Hà', 'observatory-admin', 1, 'Ghi nhận mới tại vạch hydro 1.420 MHz.'],
      ['Sao neutron và vật chất siêu đặc', 'dr-lan', 1, 'Các phép đo thời gian xung mới từ đài quan sát.'],
      ['Ảnh hồng ngoại của vùng tạo sao', 'field-team-07', 1, 'Bản tin thiên văn học từ ca trực tuần này.'],
      ['PUNX-1 station credential rotation', 'ops-console', 0, 'Internal station maintenance report.']
    ];
    for (const report of reports) {
      await run(db, 'INSERT INTO reports (title, author, published, summary) VALUES (?, ?, ?, ?)', report);
    }
  }

  await new Promise((resolve, reject) => db.close((error) => error ? reject(error) : resolve()));
  connection = null;
}

function findUserByUsername(username) {
  return get(getConnection(), 'SELECT id, username, password_hash, role FROM users WHERE username = ?', [username]);
}

function listPublishedReports() {
  return all(getConnection(), 'SELECT id, title, author, summary FROM reports WHERE published = 1 ORDER BY id DESC');
}

function listUnpublishedReports() {
  return all(getConnection(), 'SELECT id, title, author, published, summary FROM reports WHERE published = 0 ORDER BY id DESC');
}

function searchReports(search) {
  // VULN: search is concatenated into SQL so the internal report search accepts UNION-based SQL injection.
  const sql = `SELECT id, title, author, published FROM reports WHERE title LIKE '%${search}%'`;
  return all(getConnection(), sql);
}

function closeDatabase() {
  if (!connection) return Promise.resolve();
  const db = connection;
  connection = null;
  return new Promise((resolve, reject) => {
    db.close((error) => error ? reject(error) : resolve());
  });
}

module.exports = {
  closeDatabase,
  findUserByUsername,
  initializeDatabase,
  listPublishedReports,
  listUnpublishedReports,
  searchReports
};
