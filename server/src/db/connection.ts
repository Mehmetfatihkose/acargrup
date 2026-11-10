import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { initializeSchema } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.resolve(serverRoot, '.env') });
dotenv.config({ path: path.resolve(serverRoot, '../.env') });

const rawDbPath = process.env.DATABASE_PATH || './data/acargrup.sqlite';
const resolvedDbPath = path.isAbsolute(rawDbPath)
  ? rawDbPath
  : path.resolve(serverRoot, rawDbPath);

const dbDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!_db) {
    _db = new Database(resolvedDbPath);
    initializeSchema(_db);
  }
  return _db;
}

const closeDb = () => {
  try {
    if (_db && _db.open) {
      _db.close();
    }
  } catch {}
};

process.on('SIGINT', () => {
  closeDb();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});

process.on('beforeExit', () => {
  closeDb();
});

export const db: Database.Database = new Proxy({} as Database.Database, {
  get(_target, prop) {
    const inst = getDatabase();
    const val = (inst as any)[prop];
    return typeof val === 'function' ? val.bind(inst) : val;
  },
});

export default db;

