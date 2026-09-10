// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

test('Project Integrity & Smoke Tests', async (t) => {
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

  await t.test('2. Homepage Dual-Mode Elements', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    // Canvas background
    assert.ok(indexHtml.includes('id="sky-canvas"'), 'Sky canvas must exist for telescope simulation');

    // Dual mode overlay & controls
    assert.ok(indexHtml.includes('id="web-overlay"'), 'Web overlay container must exist on homepage');
    assert.ok(indexHtml.includes('id="btn-stargaze-toggle"'), 'Floating Stargaze toggle button must exist');
    assert.ok(indexHtml.includes('id="nav-stargaze-btn"'), 'Navbar Stargaze button must exist');
    assert.ok(indexHtml.includes('id="viewfinder-trigger-stargaze"'), 'News viewfinder trigger button must exist');

    // Verify Whirlpool galaxy is integrated in target list
    assert.ok(indexHtml.includes('Whirlpool') || indexHtml.includes('M51'), 'M51 Whirlpool galaxy must be featured');
  });

  await t.test('3. Standalone Telescope Lab Elements', () => {
    const labHtml = fs.readFileSync(path.join(distDir, 'telescope-lab', 'index.html'), 'utf-8');

    // Sky canvas present
    assert.ok(labHtml.includes('id="sky-canvas"'), 'Sky canvas must exist in standalone lab');

    // No web-overlay in standalone mode
    assert.ok(!labHtml.includes('id="web-overlay"'), 'Standalone lab must not have web-overlay container');

    // Scope modes and HUD elements present
    assert.ok(labHtml.includes('scope-btn-20x'), '20x finder mode button must exist');
    assert.ok(labHtml.includes('scope-btn-150x'), '150x zoom mode button must exist');
    assert.ok(labHtml.includes('btn-spawn-target'), 'New Anomaly spawner button must exist');
  });

  await t.test('4. Bloat Removal & Over-Engineering Cleanliness', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const labHtml = fs.readFileSync(path.join(distDir, 'telescope-lab', 'index.html'), 'utf-8');

    // 1. Dependency check: three.js removed
    assert.ok(!pkg.dependencies?.three, 'three must be removed from dependencies');
    assert.ok(!pkg.devDependencies?.['@types/three'], '@types/three must be removed from devDependencies');

    // 2. Duplicate 2D mini canvas removed from homepage
    assert.ok(!indexHtml.includes('id="mini-sky-canvas"'), 'Duplicate mini-sky-canvas must be eliminated');

    // 3. Deleted component files must not exist
    assert.ok(!fs.existsSync(path.join(__dirname, 'src/components/ThreeStarfield.astro')), 'ThreeStarfield.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(__dirname, 'src/components/AudioSynthesizer.astro')), 'AudioSynthesizer.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(__dirname, 'src/components/BlackHoleCursor.astro')), 'BlackHoleCursor.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(__dirname, 'src/pages/telescope-cluster.astro')), 'telescope-cluster.astro must be deleted');

    // 4. Orphaned buttons eliminated
    assert.ok(!indexHtml.includes('id="btn-toggle-preview"'), 'Orphaned btn-toggle-preview must be removed');
    assert.ok(!labHtml.includes('id="btn-toggle-preview"'), 'Orphaned btn-toggle-preview must be removed from lab');
    assert.ok(!indexHtml.includes('id="audio-toggle-btn"'), 'Audio toggle button must be removed pending sound design session');
  });

  await t.test('5. Astro Config Redirects', () => {
    const configContent = fs.readFileSync(path.join(__dirname, 'astro.config.mjs'), 'utf-8');
    assert.ok(
      configContent.includes("'/telescope-cluster': '/telescope-lab'"),
      'Astro config must define native redirect for /telescope-cluster'
    );
  });
});
