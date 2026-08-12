const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const Database = require("better-sqlite3");
const { createSession } = require("../database/db");
const { login } = require("../controllers/authController");

function clearSessionsForUser(username) {
  const db = new Database(path.join(__dirname, "..", "database", "app.sqlite"));
  db.prepare("DELETE FROM sessions WHERE username = ?").run(username);
  db.close();
}

test("createSession should keep only one active session per username", () => {
  const username = "test-session-user";
  clearSessionsForUser(username);

  createSession("session-1", username, 1000 * 60 * 60);
  createSession("session-2", username, 1000 * 60 * 60);
  createSession("session-3", username, 1000 * 60 * 60);

  const db = new Database(path.join(__dirname, "..", "database", "app.sqlite"));
  const rows = db
    .prepare("SELECT id FROM sessions WHERE username = ?")
    .all(username);
  db.close();

  assert.equal(rows.length, 1);
  clearSessionsForUser(username);
});

test("login should be bypassed by a vulnerable SQL query", () => {
  let statusCode = 200;
  let responseBody = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
    cookie() {},
  };

  login(
    { body: { username: "admin' OR 1=1--", password: "wrong-password" } },
    res,
    () => {},
  );

  assert.equal(statusCode, 200);
  assert.equal(responseBody.message, "Login thành công");
  assert.equal(responseBody.username, "admin");
});
