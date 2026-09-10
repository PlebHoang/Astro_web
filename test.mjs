// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

test('Project Integrity & Deep QA Suite', async (t) => {
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
    // Verify package.json dev command prevents duplicate server crash
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    assert.ok(
      pkg.scripts?.dev?.includes('--force') || pkg.scripts?.dev?.includes('status'),
      'package.json dev script must handle existing server collisions to prevent index.js:157 crash'
    );

    // Verify lockfile structure if dev server is active
    const lockPath = path.join(__dirname, '.astro', 'dev.json');
    if (fs.existsSync(lockPath)) {
      const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
      assert.ok(typeof lockData.pid === 'number', 'dev.json lockfile must contain numeric PID');
      assert.ok(typeof lockData.port === 'number', 'dev.json lockfile must contain port number');
      assert.ok(typeof lockData.url === 'string', 'dev.json lockfile must contain server URL');
    }
  });

  await t.test('3. Live Dev Server HTTP Probe', async () => {
    const lockPath = path.join(__dirname, '.astro', 'dev.json');
    if (!fs.existsSync(lockPath)) {
      // Dev server not currently running; skip live ping
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
    const configContent = fs.readFileSync(path.join(__dirname, 'astro.config.mjs'), 'utf-8');
    assert.ok(
      configContent.includes("ignored: ['**/dist/**'"),
      'astro.config.mjs must configure Vite to ignore dist/ and dev artifacts to prevent multi-tab reload loops'
    );
  });

  await t.test('5. Client Script TypeScript & Syntax Compilation', () => {
    // Extract script content from TelescopeCockpit.astro and verify esbuild transforms without error
    const cockpitSource = fs.readFileSync(path.join(__dirname, 'src/components/TelescopeCockpit.astro'), 'utf-8');
    const scriptMatch = cockpitSource.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, 'TelescopeCockpit.astro must contain a client <script> block');

    const scriptCode = scriptMatch[1];
    
    // esbuild TypeScript transformation
    const transformed = esbuild.transformSync(scriptCode, {
      loader: 'ts',
      target: 'es2022'
    });
    assert.ok(transformed.code.length > 1000, 'Client script must compile to valid JavaScript');

    // Syntax check via new Function compilation (catches parse-time syntax/variable bugs)
    assert.doesNotThrow(() => {
      new Function(transformed.code);
    }, 'Client script must not have syntax or declaration errors');
  });

  await t.test('6. Dual-Mode Elements & Navpill Coexistence', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    assert.ok(indexHtml.includes('id="sky-canvas"'), 'Sky canvas must exist for telescope simulation');
    assert.ok(indexHtml.includes('id="web-overlay"'), 'Web overlay container must exist on homepage');
    // Unified Navpill inside Navbar (Redundant floating overlay eliminated)
    assert.ok(indexHtml.includes('id="nav-stargaze-btn"'), 'Navbar Stargaze button must exist as unified navpill');
    assert.ok(!indexHtml.includes('id="stargaze-floating-toggle-wrap"'), 'Redundant floating toggle wrap must be eliminated to prevent navpill overlap');
    assert.ok(indexHtml.includes('id="btn-header-return"'), 'In-header non-overlapping Return to Site button must exist');
    assert.ok(indexHtml.includes('Whirlpool') || indexHtml.includes('M51'), 'M51 Whirlpool galaxy must be featured');
  });

  await t.test('7. Events Gallery, News Removal, RSVP Removal & PowerApp Registration', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    // 1. News removed entirely
    assert.ok(!indexHtml.includes('My Club News'), 'My Club News section must be removed');

    // 2. Events Gallery Carousel present
    assert.ok(indexHtml.includes('id="events-gallery"'), 'Events Gallery section must exist');
    assert.ok(indexHtml.includes('id="gallery-track"'), 'Gallery carousel scroll track must exist');
    assert.ok(indexHtml.includes('View Post on Instagram'), 'Gallery cards must link to Instagram');

    // 3. RSVP removed from club events
    assert.ok(!indexHtml.includes('RSVP →'), 'RSVP link must be removed from Club Events');
    assert.ok(indexHtml.includes('No RSVP'), 'Events calendar must state No RSVP / Drop-in');

    // 4. Microsoft PowerApp registration link
    assert.ok(indexHtml.includes('apps.powerapps.com'), 'PowerApp registration URL must be present');
    assert.ok(indexHtml.includes('id="btn-powerapp-register"'), 'PowerApp registration button must exist');
    assert.ok(!indexHtml.includes('id="membership-form"'), 'Obsolete mockup form must be removed');
  });

  await t.test('8. Standalone Lab & 4 HUD Prototypes', () => {
    const labHtml = fs.readFileSync(path.join(distDir, 'telescope-lab', 'index.html'), 'utf-8');

    assert.ok(labHtml.includes('id="sky-canvas"'), 'Sky canvas must exist in standalone lab');
    assert.ok(!labHtml.includes('id="web-overlay"'), 'Standalone lab must not have web-overlay container');
    assert.ok(labHtml.includes('scope-btn-20x'), '20x finder mode button must exist');
    assert.ok(labHtml.includes('scope-btn-150x'), '150x zoom mode button must exist');
    assert.ok(labHtml.includes('btn-spawn-target'), 'New Anomaly spawner button must exist');
    assert.ok(labHtml.includes('id="key-cap-r"'), 'Keybind [R] cap must exist for Random Anomaly');
    assert.ok(labHtml.includes('id="btn-cycle-hud"'), 'HUD layout switcher button must exist');

    // All 4 HUD layouts
    assert.ok(labHtml.includes('id="hud-pill-view"'), 'Prototype 1: Floating Pill HUD must exist');
    assert.ok(labHtml.includes('id="hud-reticle-view"'), 'Prototype 2: Optical Reticle HUD must exist');
    assert.ok(labHtml.includes('id="hud-ticker-view"'), 'Prototype 3: Edge Ticker HUD must exist');
    assert.ok(labHtml.includes('id="hud-card-view"'), 'Prototype 0: Classic Card HUD must exist');
  });

  await t.test('9. Bloat Removal & Over-Engineering Cleanliness', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const labHtml = fs.readFileSync(path.join(distDir, 'telescope-lab', 'index.html'), 'utf-8');

    assert.ok(!pkg.dependencies?.three, 'three must be removed from dependencies');
    assert.ok(!pkg.devDependencies?.['@types/three'], '@types/three must be removed from devDependencies');
    assert.ok(!indexHtml.includes('id="mini-sky-canvas"'), 'Duplicate mini-sky-canvas must be eliminated');
    assert.ok(!fs.existsSync(path.join(__dirname, 'src/components/ThreeStarfield.astro')), 'ThreeStarfield.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(__dirname, 'src/components/AudioSynthesizer.astro')), 'AudioSynthesizer.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(__dirname, 'src/components/BlackHoleCursor.astro')), 'BlackHoleCursor.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(__dirname, 'src/pages/telescope-cluster.astro')), 'telescope-cluster.astro must be deleted');
    assert.ok(!indexHtml.includes('id="btn-toggle-preview"'), 'Orphaned btn-toggle-preview must be removed');
    assert.ok(!labHtml.includes('id="btn-toggle-preview"'), 'Orphaned btn-toggle-preview must be removed from lab');
    assert.ok(!indexHtml.includes('id="audio-toggle-btn"'), 'Audio toggle button must be removed pending sound design session');
  });
});
