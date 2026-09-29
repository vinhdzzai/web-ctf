const express = require('express');
const { exportPdf, getAdmin, getDashboard, getLogin, postLogin } = require('../controllers/pageController');
const { requireAdmin, requireSession } = require('../middleware/requireSession');

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/dashboard', requireSession, getDashboard);
router.get('/admin', requireAdmin, getAdmin);
router.post('/admin/export', requireAdmin, exportPdf);

module.exports = router;
