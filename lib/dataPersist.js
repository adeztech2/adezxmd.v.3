/**
 * Keeps the bot's settings files (data/*.json) in Postgres.
 *
 * Heroku has no permanent disk: every restart (about once a day) and every deploy
 * brings back the files from GitHub, so settings changed from WhatsApp would be lost.
 * When DATABASE_URL is set, this module:
 *   1. on start    copies the saved files from the database into data/
 *   2. while running  saves any file that changed (every 20 seconds and on shutdown)
 * Without DATABASE_URL it does nothing and the bot works as before.
 *
 * Each bot uses its own table (named after OWNER_NUMBER), so bots that share a
 * database never overwrite each other.
 */
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const DATA_DIR   = path.join(__dirname, '..', 'data');
const SKIP       = new Set(['messageCount.json']);          // changes constantly, not worth keeping
const SAFE_NAME  = /^[A-Za-z0-9_.-]+\.json$/;
const SAVE_EVERY = 20_000;

const url = (process.env.DATABASE_URL || '').trim();
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex');

let pool = null;
let ready = false;
let saving = false;
const lastSaved = new Map();   // file name -> hash of the content already in the database

function tableName() {
  const owner = (process.env.OWNER_NUMBER || '').replace(/\D/g, '');
  const id = owner || 'h' + sha(process.env.SESSION_ID || 'local').slice(0, 12);
  return `adez_xmd_files_${id}`;    // digits / hex only, safe inside SQL
}

function getPool() {
  if (!url) return null;
  if (!pool) {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: url,
      ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
      max: 2,
      connectionTimeoutMillis: 10_000,
    });
    pool.on('error', (e) => console.error('[dataPersist] pool error:', e.message));
  }
  return pool;
}

async function restore() {
  const p = getPool();
  if (!p) {
    console.log('[dataPersist] DATABASE_URL not set - settings are kept on local disk only (lost on Heroku restart).');
    return;
  }
  try {
    await p.query(`CREATE TABLE IF NOT EXISTS ${tableName()} (
      name TEXT PRIMARY KEY, content TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT now())`);
    const { rows } = await p.query(`SELECT name, content FROM ${tableName()}`);
    fs.mkdirSync(DATA_DIR, { recursive: true });
    for (const r of rows) {
      if (!SAFE_NAME.test(r.name) || SKIP.has(r.name)) continue;
      fs.writeFileSync(path.join(DATA_DIR, r.name), r.content);
      lastSaved.set(r.name, sha(r.content));
    }
    ready = true;
    console.log(`[dataPersist] restored ${rows.length} settings file(s) from the database.`);
  } catch (e) {
    // Do not save anything if we could not read first, or we might overwrite good data with defaults.
    console.error('[dataPersist] restore failed, settings will NOT be saved to the database:', e.message);
  }
}

async function save() {
  if (!ready || saving) return;
  saving = true;
  try {
    for (const name of fs.readdirSync(DATA_DIR)) {
      if (!SAFE_NAME.test(name) || SKIP.has(name)) continue;
      let content;
      try { content = fs.readFileSync(path.join(DATA_DIR, name), 'utf8'); } catch { continue; }
      const h = sha(content);
      if (lastSaved.get(name) === h) continue;
      await getPool().query(
        `INSERT INTO ${tableName()} (name, content, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (name) DO UPDATE SET content = EXCLUDED.content, updated_at = now()`,
        [name, content]
      );
      lastSaved.set(name, h);
    }
  } catch (e) {
    console.error('[dataPersist] save failed:', e.message);
  } finally {
    saving = false;
  }
}

async function init() {
  await restore();
  if (!ready) return;
  await save();                                     // first run: store the files shipped with the bot
  setInterval(save, SAVE_EVERY).unref?.();
  // Heroku sends SIGTERM before it restarts a dyno: save one last time.
  process.on('SIGTERM', async () => {
    await save();
    process.exit(0);
  });
}

module.exports = { init, save };
