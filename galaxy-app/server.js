const app = require('./app');
const { closeDatabase, initializeDatabase } = require('./database/database');

const PORT = Number(process.env.PORT) || 8000;
let server;
let shuttingDown = false;

async function start() {
  await initializeDatabase();
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Galaxy CTF is running at http://localhost:${PORT}`);
  });
}

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  if (server) {
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
    return;
  }

  await closeDatabase();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start().catch((error) => {
  console.error('Unable to start Galaxy CTF:', error);
  process.exitCode = 1;
});
