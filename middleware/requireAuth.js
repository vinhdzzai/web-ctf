const sessions = require("../store/sessions");

module.exports = function requireAuth(req, res, next) {
  const sessionId = req.cookies && req.cookies.sessionId;
  const username = sessions.getSessionUsername(sessionId);
  if (!username) return res.status(401).json({ message: "Chưa đăng nhập" });

  req.username = username;
  next();
};
