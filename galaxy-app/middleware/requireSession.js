function requireSession(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  if (req.session.role !== 'admin') return res.status(403).send('403 - Admin access required');
  next();
}

module.exports = { requireAdmin, requireSession };
