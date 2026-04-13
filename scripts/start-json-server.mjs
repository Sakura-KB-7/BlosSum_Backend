import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const cwd = process.cwd();
const seedFile = path.resolve(process.env.DB_SEED_FILE || path.join(cwd, 'db.json'));
const defaultDbFile = process.env.RAILWAY_ENVIRONMENT ? '/data/db.json' : path.join(cwd, 'db.json');
const dbFile = path.resolve(process.env.DB_FILE || defaultDbFile);
const port = String(process.env.PORT || '3000');
const host = process.env.HOST || '0.0.0.0';
const forceSeed = process.env.DB_FORCE_SEED === '1';

function jsonServerBin() {
  return process.platform === 'win32'
    ? path.join(cwd, 'node_modules', '.bin', 'json-server.cmd')
    : path.join(cwd, 'node_modules', '.bin', 'json-server');
}

async function isValidJson(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

async function ensureDbFile() {
  if (dbFile === seedFile && !forceSeed) {
    return;
  }

  await mkdir(path.dirname(dbFile), { recursive: true });

  if (forceSeed) {
    await copyFile(seedFile, dbFile);
    return;
  }

  if (!existsSync(dbFile)) {
    await copyFile(seedFile, dbFile);
    return;
  }

  const fileStat = await stat(dbFile);
  if (fileStat.size === 0 || !(await isValidJson(dbFile))) {
    await copyFile(seedFile, dbFile);
  }
}

await ensureDbFile();

const child = spawn(jsonServerBin(), ['--watch', dbFile, '--host', host, '--port', port], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
