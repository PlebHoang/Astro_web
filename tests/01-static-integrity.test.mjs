// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');
const distDir = path.join(rootDir, 'dist');

test('Suite 1: Static Integrity & Dev Server Safety', async (t) => {
  await t.test('1. Dist Directory & Static Routes Generation', () => {
    assert.ok(fs.existsSync(distDir), 'dist/ directory must exist (run npm run build first)');
    
    const indexPath = path.join(distDir, 'index.html');
    const labPath = path.join(distDir, 'telescope-lab', 'index.html');
    const clusterPath = path.join(distDir, 'telescope-cluster', 'index.html');

    assert.ok(fs.existsSync(indexPath), 'dist/index.html must exist');
    assert.ok(fs.existsSync(labPath), 'dist/telescope-lab/index.html must exist');
    assert.ok(fs.existsSync(clusterPath), 'dist/telescope-cluster/index.html redirect must exist');

    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    const labHtml = fs.readFileSync(labPath, 'utf-8');
    const clusterHtml = fs.readFileSync(clusterPath, 'utf-8');

    assert.ok(indexHtml.length > 500, 'index.html must not be empty');
    assert.ok(labHtml.length > 500, 'telescope-lab/index.html must not be empty');
    assert.ok(
      clusterHtml.includes('/telescope-lab'),
      'telescope-cluster redirect must link to /telescope-lab'
    );
  });

  await t.test('2. Dev Server Lockfile & Collision Protection (Astro line 157)', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    assert.ok(
      pkg.scripts?.dev?.includes('--force') || pkg.scripts?.dev?.includes('status'),
      'package.json dev script must handle existing server collisions to prevent index.js:157 crash'
    );

    const lockPath = path.join(rootDir, '.astro', 'dev.json');
    if (fs.existsSync(lockPath)) {
      const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
      assert.ok(typeof lockData.pid === 'number', 'dev.json lockfile must contain numeric PID');
      assert.ok(typeof lockData.port === 'number', 'dev.json lockfile must contain port number');
      assert.ok(typeof lockData.url === 'string', 'dev.json lockfile must contain server URL');
    }
  });

  await t.test('3. Live Dev Server HTTP Probe', async () => {
    const lockPath = path.join(rootDir, '.astro', 'dev.json');
    if (!fs.existsSync(lockPath)) {
      return;
    }

    const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
    const baseUrl = lockData.url || `http://localhost:${lockData.port || 4321}`;

    try {
      const [resIndex, resLab] = await Promise.all([
        fetch(`${baseUrl}/`),
        fetch(`${baseUrl}/telescope-lab`)
      ]);

      assert.equal(resIndex.status, 200, 'Homepage must return HTTP 200 OK');
      assert.equal(resLab.status, 200, 'Telescope Lab must return HTTP 200 OK');

      const htmlIndex = await resIndex.text();
      assert.ok(htmlIndex.includes('id="sky-canvas"'), 'Live homepage must render sky canvas');
    } catch (err) {
      assert.fail(`Live dev server probe failed at ${baseUrl}: ${err.message}`);
    }
  });

  await t.test('4. Vite Watcher Anti-Reload-Storm Protection', () => {
    const configContent = fs.readFileSync(path.join(rootDir, 'astro.config.mjs'), 'utf-8');
    assert.ok(
      configContent.includes("ignored: ['**/dist/**'"),
      'astro.config.mjs must configure Vite to ignore dist/ and dev artifacts to prevent multi-tab reload loops'
    );
  });
});
