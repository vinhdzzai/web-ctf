const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const bcrypt = require('bcryptjs');
const { findUserByUsername, listPublishedReports } = require('../database/database');

function getLogin(req, res) {
  res.render('login', { error: null });
}

async function postLogin(req, res, next) {
  try {
    const user = await findUserByUsername(req.body.username);
    const password = String(req.body.password || '');
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).render('login', { error: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) return next(sessionError);
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;
      return res.redirect(user.role === 'admin' ? '/admin' : '/dashboard');
    });
  } catch (error) {
    next(error);
  }
}

async function getDashboard(req, res, next) {
  try {
    const articles = await listPublishedReports();
    res.render('dashboard', { username: req.session.username, articles });
  } catch (error) {
    next(error);
  }
}

function getAdmin(req, res) {
  res.render('admin', { username: req.session.username });
}

async function exportPdf(req, res) {
  let tempDirectory;

  try {
    tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'galaxy-export-'));
    const inputPath = path.join(tempDirectory, 'report.html');
    const outputPath = path.join(tempDirectory, 'report.pdf');
    // VULN: administrator-supplied HTML is written without filtering and rendered with local-file access enabled.
    await fs.writeFile(inputPath, String(req.body.html || ''), 'utf8');
    const binary = process.env.WKHTMLTOPDF_BIN || 'wkhtmltopdf';
    await new Promise((resolve, reject) => {
      execFile(binary, ['--enable-local-file-access', inputPath, outputPath], { timeout: 45000 }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    res.download(outputPath, 'observatory-report.pdf', async () => {
      await fs.rm(tempDirectory, { recursive: true, force: true });
    });
  } catch (error) {
    if (tempDirectory) await fs.rm(tempDirectory, { recursive: true, force: true });
    res.status(500).type('text/plain').send(`PDF export failed: ${error.message}`);
  }
}

module.exports = { exportPdf, getAdmin, getDashboard, getLogin, postLogin };
