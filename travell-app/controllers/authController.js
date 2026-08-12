const crypto = require("crypto");
const sessions = require("../store/sessions");
const { getUserByUsername, createUser } = require("../database/db");

exports.register = (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập username và password" });
  }

  const existingUser = getUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ message: "Tên người dùng đã tồn tại" });
  }

  createUser(username, password);
  return res.status(201).json({ message: "Đăng ký thành công" });
};

exports.login = (req, res) => {
  const { username, password } = req.body || {};
  const normalizedUsername =
    typeof username === "string" ? username.trim() : "";
  const user = getUserByUsername(normalizedUsername, password);

  if (!user) {
    return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
  }

  const sessionId = crypto.randomBytes(16).toString("hex");
  const authenticatedUsername = user.username || normalizedUsername;

  sessions.createSession(sessionId, authenticatedUsername);

  res.cookie("sessionId", sessionId, {
    httpOnly: false,
    maxAge: 1000 * 60 * 60,
  });

  return res.json({
    message: "Login thành công",
    username: authenticatedUsername,
  });
};

exports.logout = (req, res) => {
  const sessionId = req.cookies && req.cookies.sessionId;
  if (sessionId) sessions.deleteSession(sessionId);

  res.clearCookie("sessionId");
  res.json({ message: "Đã đăng xuất" });
};
