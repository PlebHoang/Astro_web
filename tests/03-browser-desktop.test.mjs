// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCdpSession } from './helpers/cdpClient.mjs';

test('Suite 3: Desktop Browser Interactive E2E & Hotkey Protocol (Chrome CDP)', async () => {
  const session = await createCdpSession('http://localhost:4321/');
  if (!session) {
    console.log('    ℹ Headless Chrome not detected on system paths; skipping desktop CDP session.');
    return;
  }

  const { evaluate, consoleErrors, cleanup } = session;

  try {
    // Poll until DOM and client scripts are fully hydrated
    for (let i = 0; i < 25; i++) {
      const ready = await evaluate(`document.readyState === 'complete' && !!document.getElementById('web-overlay') && !!document.getElementById('nav-stargaze-btn')`);
      if (ready) break;
      await new Promise(r => setTimeout(r, 150));
    }
    await new Promise(r => setTimeout(r, 200));

    // 1. Initial State: Stargaze inactive
    const initCheck = await evaluate(`(() => ({
      webOverlayHidden: document.getElementById('web-overlay')?.classList.contains('hidden'),
      cockpitHidden: document.getElementById('cockpit-ui')?.classList.contains('hidden')
    }))()`);
    assert.equal(initCheck.webOverlayHidden, false, 'Web overlay must initially be visible');
    assert.equal(initCheck.cockpitHidden, true, 'Cockpit UI must initially be hidden');

    // 2. Click #nav-stargaze-btn -> activate Stargaze
    const afterClick = await evaluate(`(() => {
      const btn = document.getElementById('nav-stargaze-btn');
      btn?.click();
      return {
        webOverlayHidden: document.getElementById('web-overlay')?.classList.contains('hidden'),
        cockpitHidden: document.getElementById('cockpit-ui')?.classList.contains('hidden'),
        cockpitOpacity100: document.getElementById('cockpit-ui')?.classList.contains('opacity-100')
      };
    })()`);
    assert.equal(afterClick.webOverlayHidden, true, 'Clicking nav-stargaze-btn must hide web overlay');
    assert.equal(afterClick.cockpitHidden, false, 'Clicking nav-stargaze-btn must display cockpit UI');
    assert.equal(afterClick.cockpitOpacity100, true, 'Cockpit UI must gain opacity-100 when active');

    // 3. Keypress [2] -> 150x Zoom active
    const key2Check = await evaluate(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2', code: 'Digit2', bubbles: true }));
      return {
        btn20xActive: document.getElementById('scope-btn-20x')?.classList.contains('bg-white'),
        btn150xActive: document.getElementById('scope-btn-150x')?.classList.contains('bg-white')
      };
    })()`);
    assert.equal(key2Check.btn150xActive, true, 'Keypress [2] must activate 150x zoom button');
    assert.equal(key2Check.btn20xActive, false, 'Keypress [2] must deactivate 20x finder button');

    // 4. Keypress [1] -> 20x Finder active
    const key1Check = await evaluate(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', code: 'Digit1', bubbles: true }));
      return {
        btn20xActive: document.getElementById('scope-btn-20x')?.classList.contains('bg-white'),
        btn150xActive: document.getElementById('scope-btn-150x')?.classList.contains('bg-white')
      };
    })()`);
    assert.equal(key1Check.btn20xActive, true, 'Keypress [1] must activate 20x finder button');
    assert.equal(key1Check.btn150xActive, false, 'Keypress [1] must deactivate 150x zoom button');

    // 5. Keypress [3] -> Random Anomaly Spawn
    await evaluate(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '3', code: 'Digit3', bubbles: true }));
    })()`);

    // 6. Keypress [H] -> HUD Cycle & Card HUD Telemetry Verification
    const cardHudCheck = await evaluate(`(() => {
      for (let i = 0; i < 4; i++) {
        const label = document.getElementById('hud-cycle-label')?.textContent || '';
        if (label.includes('Card')) break;
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', code: 'KeyH', bubbles: true }));
      }
      const cardEl = document.getElementById('hud-card-view');
      const pillEl = document.getElementById('hud-pill-view');
      const rect = cardEl ? cardEl.getBoundingClientRect() : null;
      return {
        cardVisible: cardEl && !cardEl.classList.contains('hidden'),
        pillHidden: pillEl && pillEl.classList.contains('hidden'),
        bottomPinned: rect && rect.bottom <= (window.innerHeight + 10) && rect.top > (window.innerHeight * 0.4),
        hasMissionTitle: !!document.getElementById('hud-mission-name')?.textContent?.trim()
      };
    })()`);
    assert.equal(cardHudCheck.cardVisible, true, 'Card HUD must become visible when selected');
    assert.equal(cardHudCheck.pillHidden, true, 'Pill HUD must be hidden when Card HUD is selected');
    assert.equal(cardHudCheck.bottomPinned, true, 'Card HUD must be pinned to the bottom of the viewport');
    assert.equal(cardHudCheck.hasMissionTitle, true, 'Card HUD must display active mission signal title');

    // 7. Keypress [T] in 150x Mode -> Reset view to 20x + Star Wars Theme toggle & Hyperspace Warp
    const keyTCheck = await evaluate(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '2', code: 'Digit2', bubbles: true }));
      const in150xBefore = document.getElementById('scope-btn-150x')?.classList.contains('bg-white');

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 't', code: 'KeyT', bubbles: true }));

      return {
        was150x: in150xBefore,
        btn20xActive: document.getElementById('scope-btn-20x')?.classList.contains('bg-white'),
        btn150xActive: document.getElementById('scope-btn-150x')?.classList.contains('bg-white'),
        themeActive: document.documentElement.classList.contains('theme-starwars')
      };
    })()`);
    assert.equal(keyTCheck.was150x, true, 'Pre-condition: 150x must be active before testing key T');
    assert.equal(keyTCheck.btn20xActive, true, 'Keypress [T] in stargaze mode must reset view to 20x wide finder');
    assert.equal(keyTCheck.btn150xActive, false, 'Keypress [T] in stargaze mode must deactivate 150x zoom');
    assert.equal(keyTCheck.themeActive, true, 'Keypress [T] must engage Star Wars theme');

    // 8. Return to Site button
    const returnCheck = await evaluate(`(() => {
      document.getElementById('btn-header-return')?.click();
      return {
        webOverlayHidden: document.getElementById('web-overlay')?.classList.contains('hidden'),
        cockpitHidden: document.getElementById('cockpit-ui')?.classList.contains('hidden'),
        discoveryBannerExists: !!document.getElementById('discovery-banner')
      };
    })()`);
    assert.equal(returnCheck.webOverlayHidden, false, 'Return button must restore web overlay');
    assert.equal(returnCheck.cockpitHidden, true, 'Return button must hide cockpit UI');
    assert.equal(returnCheck.discoveryBannerExists, false, 'Next target discovery popup must not exist in DOM');

    // 9. TAB Key Stargaze Toggle Protocol
    const tabEnterCheck = await evaluate(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
      return {
        webOverlayHidden: document.getElementById('web-overlay')?.classList.contains('hidden'),
        cockpitHidden: document.getElementById('cockpit-ui')?.classList.contains('hidden')
      };
    })()`);
    assert.equal(tabEnterCheck.webOverlayHidden, true, 'TAB key must activate stargaze mode and display HUD');
    assert.equal(tabEnterCheck.cockpitHidden, false, 'TAB key must reveal cockpit UI');

    const tabExitCheck = await evaluate(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
      return {
        webOverlayHidden: document.getElementById('web-overlay')?.classList.contains('hidden'),
        cockpitHidden: document.getElementById('cockpit-ui')?.classList.contains('hidden')
      };
    })()`);
    assert.equal(tabExitCheck.webOverlayHidden, false, 'TAB key must exit stargaze mode and restore web overlay');
    assert.equal(tabExitCheck.cockpitHidden, true, 'TAB key must hide cockpit HUD on exit');

    // 10. Observation Highlights Preview Dialog Protocol
    const dialogCheck = await evaluate(`(() => {
      const trigger = document.querySelector('[data-preview-trigger]');
      if (!trigger) return { error: 'data-preview-trigger not found' };
      trigger.click();
      const dlg = document.getElementById('ig-preview-dialog');
      const opened = dlg?.open;
      const title = document.getElementById('ig-modal-title')?.textContent;
      const hasImg = !!document.getElementById('ig-modal-img')?.getAttribute('src');

      document.getElementById('ig-preview-close')?.click();
      const closed = !dlg?.open;

      return { opened, closed, titleNonEmpty: (title || '').length > 0, hasImg };
    })()`);
    assert.equal(dialogCheck.opened, true, 'Clicking preview card must open native preview dialog');
    assert.equal(dialogCheck.titleNonEmpty, true, 'Preview dialog must populate post title');
    assert.equal(dialogCheck.hasImg, true, 'Preview dialog must load post image source');
    assert.equal(dialogCheck.closed, true, 'Clicking dialog close button must dismiss preview modal');

    // 11. Verify zero uncaught browser runtime exceptions
    assert.equal(consoleErrors.length, 0, `Browser must have zero uncaught exceptions: ${consoleErrors.join(', ')}`);
  } finally {
    cleanup();
  }
});
