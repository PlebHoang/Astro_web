// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCdpSession } from './helpers/cdpClient.mjs';

test('Suite 5: Standalone Telescope Lab (/telescope-lab) E2E Protocol (Chrome CDP)', async () => {
  const session = await createCdpSession('http://localhost:4321/telescope-lab');
  if (!session) {
    console.log('    ℹ Headless Chrome not detected on system paths; skipping telescope lab CDP session.');
    return;
  }

  const { evaluate, consoleErrors, cleanup } = session;

  try {
    // Poll until DOM and client scripts are fully hydrated
    for (let i = 0; i < 25; i++) {
      const ready = await evaluate(`document.readyState === 'complete' && !!document.getElementById('sky-canvas') && !!document.getElementById('cockpit-ui')`);
      if (ready) break;
      await new Promise(r => setTimeout(r, 150));
    }
    await new Promise(r => setTimeout(r, 200));

    const labCDPCheck = await evaluate(`(() => {
      const canvas = document.getElementById('sky-canvas');
      const overlay = document.getElementById('web-overlay');
      const cockpit = document.getElementById('cockpit-ui');
      const btn150x = document.getElementById('scope-btn-150x');
      const btn20x = document.getElementById('scope-btn-20x');

      // Test keybind [2] in standalone lab
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2', code: 'Digit2', bubbles: true }));
      const zoom150xEngaged = btn150x?.classList.contains('bg-white');

      // Test keybind [1] in standalone lab
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', code: 'Digit1', bubbles: true }));
      const zoom20xEngaged = btn20x?.classList.contains('bg-white');

      return {
        hasOverlay: !!overlay,
        cockpitVisible: cockpit && !cockpit.classList.contains('hidden'),
        canvasPointerEvents: canvas ? window.getComputedStyle(canvas).pointerEvents : null,
        zoom150xEngaged,
        zoom20xEngaged
      };
    })()`);

    assert.equal(labCDPCheck.hasOverlay, false, '/telescope-lab must have zero web-overlay');
    assert.equal(labCDPCheck.cockpitVisible, true, '/telescope-lab must show cockpit UI immediately');
    assert.equal(labCDPCheck.canvasPointerEvents, 'auto', '/telescope-lab canvas pointer-events must be auto');
    assert.equal(labCDPCheck.zoom150xEngaged, true, '/telescope-lab keybind [2] must engage 150x zoom');
    assert.equal(labCDPCheck.zoom20xEngaged, true, '/telescope-lab keybind [1] must restore 20x finder');

    // Verify zero uncaught browser runtime exceptions
    assert.equal(consoleErrors.length, 0, `Browser must have zero uncaught exceptions: ${consoleErrors.join(', ')}`);
  } finally {
    cleanup();
  }
});
