// Wrapper for Node.js ESM execution to ensure stable environment cleanup hooks with native addons (better-sqlite3)
import('./dist/index.js').catch((err) => {
  console.error('[Acar Grup Server Fatal Error]:', err);
  process.exit(1);
});

