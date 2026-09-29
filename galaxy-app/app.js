const express = require('express');
const session = require('express-session');
const pageRoutes = require('./routes/pages');
const feedRoutes = require('./routes/feed');

const app = express();

app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(express.urlencoded({ extended: false }));
app.use(session({
  name: 'galaxy.sid',
  secret: process.env.SESSION_SECRET || 'local-ctf-session-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

app.use('/', pageRoutes);
app.use('/feed', feedRoutes);

module.exports = app;
