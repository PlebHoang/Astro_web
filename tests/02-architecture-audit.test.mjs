// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');
const distDir = path.join(rootDir, 'dist');

test('Suite 2: Codebase Architecture, Mount Limits & Anti-Bloat Audit', async (t) => {
  await t.test('1. Client Script TypeScript & Syntax Compilation', () => {
    const cockpitSource = fs.readFileSync(path.join(rootDir, 'src/components/TelescopeCockpit.astro'), 'utf-8');
    const scriptMatch = cockpitSource.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, 'TelescopeCockpit.astro must contain a client <script> block');

    const scriptCode = scriptMatch[1];
    const transformed = esbuild.transformSync(scriptCode, {
      loader: 'ts',
      target: 'es2022',
      format: 'cjs'
    });
    assert.ok(transformed.code.length > 1000, 'Client script must compile to valid JavaScript');

    assert.doesNotThrow(() => {
      new Function(transformed.code);
    }, 'Client script must not have syntax or declaration errors');
  });

  await t.test('2. Dual-Mode Elements & Navpill Coexistence', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    assert.ok(indexHtml.includes('id="sky-canvas"'), 'Sky canvas must exist for telescope simulation');
    assert.ok(indexHtml.includes('id="web-overlay"'), 'Web overlay container must exist on homepage');
    assert.ok(indexHtml.includes('id="nav-stargaze-btn"'), 'Navbar Stargaze button must exist as unified navpill');
    assert.ok(!indexHtml.includes('id="stargaze-floating-toggle-wrap"'), 'Redundant floating toggle wrap must be eliminated');
    assert.ok(indexHtml.includes('id="btn-header-return"'), 'In-header non-overlapping Return to Site button must exist');
    assert.ok(indexHtml.includes('Whirlpool') || indexHtml.includes('M51'), 'M51 Whirlpool galaxy must be featured');
  });

  await t.test('3. Events Gallery, News Removal, RSVP Removal & PowerApp Registration', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    assert.ok(!indexHtml.includes('My Club News'), 'My Club News section must be removed');
    assert.ok(indexHtml.includes('id="events-gallery"'), 'Events Gallery section must exist');
    assert.ok(indexHtml.includes('id="gallery-track"'), 'Gallery carousel scroll track must exist');
    assert.ok(indexHtml.includes('View Post on Instagram'), 'Gallery cards must link to Instagram');

    assert.ok(!indexHtml.includes('RSVP →'), 'RSVP link must be removed from Club Events');
    assert.ok(indexHtml.includes('No RSVP'), 'Events calendar must state No RSVP / Drop-in');

    assert.ok(indexHtml.includes('apps.powerapps.com'), 'PowerApp registration URL must be present');
    assert.ok(indexHtml.includes('id="btn-powerapp-register"'), 'PowerApp registration button must exist');
    assert.ok(!indexHtml.includes('id="membership-form"'), 'Obsolete mockup form must be removed');
  });

  await t.test('4. Standalone Lab & 4 HUD Prototypes', () => {
    const labHtml = fs.readFileSync(path.join(distDir, 'telescope-lab', 'index.html'), 'utf-8');

    assert.ok(labHtml.includes('id="sky-canvas"'), 'Sky canvas must exist in standalone lab');
    assert.ok(!labHtml.includes('id="web-overlay"'), 'Standalone lab must not have web-overlay container');
    assert.ok(labHtml.includes('scope-btn-20x'), '20x finder mode button must exist');
    assert.ok(labHtml.includes('scope-btn-150x'), '150x zoom mode button must exist');
    assert.ok(labHtml.includes('btn-spawn-target'), 'New Anomaly spawner button must exist');
    assert.ok(labHtml.includes('id="key-cap-3"'), 'Keybind [3] cap must exist for Random Anomaly');
    assert.ok(!labHtml.includes('id="key-cap-r"'), 'Obsolete Keybind [R] cap must not exist');
    assert.ok(labHtml.includes('id="btn-cycle-hud"'), 'HUD layout switcher button must exist');

    assert.ok(labHtml.includes('id="hud-pill-view"'), 'Prototype 1: Floating Pill HUD must exist');
    assert.ok(labHtml.includes('id="hud-reticle-view"'), 'Prototype 2: Optical Reticle HUD must exist');
    assert.ok(labHtml.includes('id="hud-ticker-view"'), 'Prototype 3: Edge Ticker HUD must exist');
    assert.ok(labHtml.includes('id="hud-card-view"'), 'Prototype 0: Classic Card HUD must exist');
  });

  await t.test('5. Bloat Removal & Over-Engineering Cleanliness', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const labHtml = fs.readFileSync(path.join(distDir, 'telescope-lab', 'index.html'), 'utf-8');

    assert.ok(!pkg.dependencies?.three, 'three must be removed from dependencies');
    assert.ok(!pkg.devDependencies?.['@types/three'], '@types/three must be removed from devDependencies');
    assert.ok(!indexHtml.includes('id="mini-sky-canvas"'), 'Duplicate mini-sky-canvas must be eliminated');
    assert.ok(!fs.existsSync(path.join(rootDir, 'src/components/ThreeStarfield.astro')), 'ThreeStarfield.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(rootDir, 'src/components/AudioSynthesizer.astro')), 'AudioSynthesizer.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(rootDir, 'src/components/BlackHoleCursor.astro')), 'BlackHoleCursor.astro must be deleted');
    assert.ok(!fs.existsSync(path.join(rootDir, 'src/pages/telescope-cluster.astro')), 'telescope-cluster.astro must be deleted');
    assert.ok(!indexHtml.includes('id="btn-toggle-preview"'), 'Orphaned btn-toggle-preview must be removed');
    assert.ok(!labHtml.includes('id="btn-toggle-preview"'), 'Orphaned btn-toggle-preview must be removed from lab');
    assert.ok(!indexHtml.includes('id="audio-toggle-btn"'), 'Audio toggle button must be removed pending sound design session');
  });

  await t.test('6. Hero Headline Integrity, Theme Switcher & Redundancy Removal', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    assert.ok(indexHtml.includes('EXPLORE THE COSMOS'), 'Hero headline must include EXPLORE THE COSMOS');
    assert.ok(indexHtml.includes('ASTRONOMICAL SOCIETY'), 'Hero headline must include ASTRONOMICAL SOCIETY');
    assert.ok(!indexHtml.includes("MY CLUB'S HOMEPAGE"), 'Obsolete placeholder headline must be eliminated');

    assert.ok(indexHtml.includes('id="theme-toggle-btn"'), 'Theme toggle button must exist');
    assert.ok(indexHtml.includes('starwars-pop'), 'Star Wars pop accent hook must exist');

    assert.ok(!indexHtml.includes('id="btn-cockpit-exit"'), 'Redundant btn-cockpit-exit must be removed');
    assert.ok(!indexHtml.includes('← Read Website'), 'Redundant Read Website text must be removed');
  });

  await t.test('7. Discovery Banner Text Removal Audit', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const labHtml = fs.readFileSync(path.join(distDir, 'telescope-lab', 'index.html'), 'utf-8');
    const sourceCode = fs.readFileSync(path.join(rootDir, 'src/components/TelescopeCockpit.astro'), 'utf-8');

    assert.ok(!indexHtml.includes('DISCOVERY CONFIRMED IN 150X HIGH ZOOM'), 'Discovery banner subtitle must be removed from homepage');
    assert.ok(!labHtml.includes('DISCOVERY CONFIRMED IN 150X HIGH ZOOM'), 'Discovery banner subtitle must be removed from telescope lab');
    assert.ok(!sourceCode.includes('DISCOVERY CONFIRMED IN 150X HIGH ZOOM'), 'Discovery banner subtitle must be removed from source component');
    assert.ok(!indexHtml.includes('id="discovery-banner"'), 'Discovery banner popup element must be removed from homepage');
    assert.ok(!indexHtml.includes('id="btn-next-hunt"'), 'Next target button must be removed from homepage');
    assert.ok(!sourceCode.includes('id="discovery-banner"'), 'Discovery banner popup must be removed from source component');
  });

  await t.test('8. Modular Sky Renderers, Sector Shuffle & 135-Degree Mount Limits', async () => {
    const renderersDir = path.join(rootDir, 'src/lib/renderers');
    const modules = ['canvasHelpers.ts', 'planets.ts', 'deepSky.ts', 'galaxies.ts', 'sectorShuffle.ts'];

    for (const mod of modules) {
      const filePath = path.join(renderersDir, mod);
      assert.ok(fs.existsSync(filePath), `${mod} must exist in src/lib/renderers/`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;
      assert.ok(lines < 250, `${mod} must remain under 250 lines (Anti-Blob rule), currently ${lines}`);
    }

    const cockpitSrc = fs.readFileSync(path.join(rootDir, 'src/components/TelescopeCockpit.astro'), 'utf-8');
    assert.ok(cockpitSrc.includes('const YAW_LIMIT = 1.18'), 'YAW_LIMIT must be 1.18 rad (~135° total field of view)');
    assert.ok(cockpitSrc.includes('const PITCH_MIN = -0.55'), 'PITCH_MIN must be -0.55 rad');
    assert.ok(cockpitSrc.includes('const PITCH_MAX = 0.85'), 'PITCH_MAX must be 0.85 rad');
    assert.ok(cockpitSrc.includes('randomizeSectorPositions'), 'TelescopeCockpit must invoke randomizeSectorPositions');

    const sectorSrc = fs.readFileSync(path.join(renderersDir, 'sectorShuffle.ts'), 'utf-8');
    const { transformSync } = await import('esbuild');
    const { code } = transformSync(sectorSrc, { loader: 'ts', format: 'cjs' });
    const modObj = { exports: {} };
    const fn = new Function('module', 'exports', code);
    fn(modObj, modObj.exports);
    const moduleExports = modObj.exports;

    assert.equal(typeof moduleExports.randomizeSectorPositions, 'function', 'randomizeSectorPositions must be exported');

    const testTargets = [
      { id: '1', name: 'T1', type: 'planet_jupiter', x: 0, y: 0, z: 0 },
      { id: '2', name: 'T2', type: 'galaxy_m51', x: 0, y: 0, z: 0 }
    ];
    const testWhirlpool = [{ baseX: 0, baseY: 0, baseZ: 0 }];
    const testAndromeda = [{ baseX: 0, baseY: 0, baseZ: 0 }];

    moduleExports.randomizeSectorPositions(testTargets, testWhirlpool, testAndromeda);

    assert.notEqual(testTargets[0].x, 0, 'Target coordinates must be randomized');
    assert.ok(testTargets[0].x >= -520 && testTargets[0].x <= 520, 'Target X must fall within 135° cone [-520, 520]');
    assert.ok(testTargets[0].y >= -320 && testTargets[0].y <= 480, 'Target Y must fall within pitch bounds [-320, 480]');
    assert.equal(testWhirlpool[0].baseX, testTargets[1].x, 'Whirlpool particles must track M51 target position');
    assert.notEqual(testAndromeda[0].baseX, 0, 'Andromeda particles must be randomized to an active sector');

    const celestialDir = path.join(rootDir, 'public/images/celestial');
    const requiredImages = [
      'saturn_cassini_alpha.webp',
      'jupiter_alpha.webp',
      'mars_hubble_alpha.webp',
      'pillars_jwst_feathered.webp',
      'orion_feathered.webp'
    ];
    for (const img of requiredImages) {
      assert.ok(fs.existsSync(path.join(celestialDir, img)), `Photographic asset ${img} must exist in public/images/celestial/`);
    }

    assert.ok(cockpitSrc.includes('const panSensitivity = isHighZoom ? 0.0008 : 0.0035'), '150x zoom must engage 0.0008 rad/px micro-stepper sensitivity');
  });
});
