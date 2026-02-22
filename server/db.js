import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DB_PATH || './data/donjon.db';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo          TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash   TEXT NOT NULL,
    save_data       TEXT NOT NULL DEFAULT '',
    total_score          INTEGER NOT NULL DEFAULT 0,
    monsters_defeated    INTEGER NOT NULL DEFAULT 0,
    undead_defeated      INTEGER NOT NULL DEFAULT 0,
    traps_defeated       INTEGER NOT NULL DEFAULT 0,
    bosses_defeated      INTEGER NOT NULL DEFAULT 0,
    complete_wings       INTEGER NOT NULL DEFAULT 0,
    mana_potions_earned  INTEGER NOT NULL DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration : ajout des colonnes pour les bases existantes
for (const [col, type] of [
  ['undead_defeated',     'INTEGER NOT NULL DEFAULT 0'],
  ['mana_potions_earned', 'INTEGER NOT NULL DEFAULT 0'],
  ['trophies',            "TEXT NOT NULL DEFAULT '{}'"],
  ['trophy_xp',           'INTEGER NOT NULL DEFAULT 0'],
  ['level',               'INTEGER NOT NULL DEFAULT 1'],
  ['elite_defeated',      'INTEGER NOT NULL DEFAULT 0'],
  ['doubles_defeated',    'INTEGER NOT NULL DEFAULT 0'],
]) {
  try { db.exec(`ALTER TABLE players ADD COLUMN ${col} ${type}`); } catch {}
}

export default db;
