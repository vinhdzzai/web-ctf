const {
  createSession,
  getSessionUsername,
  deleteSession,
} = require("../database/db");

module.exports = {
  createSession(sessionId, username, ttlMs) {
    return createSession(sessionId, username, ttlMs);
  },
  getSessionUsername(sessionId) {
    return getSessionUsername(sessionId);
  },
  deleteSession(sessionId) {
    return deleteSession(sessionId);
  },
};
