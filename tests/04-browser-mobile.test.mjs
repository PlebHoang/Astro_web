// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCdpSession } from './helpers/cdpClient.mjs';

test('Suite 4: Mobile Viewport, Touch Gestures & Responsive Layout (Chrome CDP)', async () => {
  const session = await createCdpSession('http://localhost:4321/');
  if (!session) {
    console.log('    ℹ Headless Chrome not detected on system paths; skipping mobile CDP session.');
    return;
  }

  const { send, evaluate, consoleErrors, cleanup } = session;

  try {
    // Poll until DOM and client scripts are fully hydrated
    for (let i = 0; i < 25; i++) {
      const ready = await evaluate(`document.readyState === 'complete' && !!document.getElementById('web-overlay') && !!document.getElementById('nav-stargaze-btn')`);
      if (ready) break;
      await new Promise(r => setTimeout(r, 150));
    }
    await new Promise(r => setTimeout(r, 200));

    // Override viewport to mobile phone metrics (375x812, 2x DPR)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 200));

    // A. Mobile Canvas Touch-Action Verification
    const canvasTouchCheck = await evaluate(`(() => {
      const canvas = document.getElementById('sky-canvas');
      const style = window.getComputedStyle(canvas);
      return canvas?.classList.contains('touch-none') || style.touchAction === 'none';
    })()`);
    assert.equal(canvasTouchCheck, true, 'sky-canvas must have touch-action: none to prevent mobile gesture conflicts');

    // B. Mobile Navigation Drawer & In-Menu Theme Switcher
    const mobileNavCheck = await evaluate(`(() => {
      const mobileBtn = document.getElementById('nav-mobile-btn');
      const menu = document.getElementById('nav-mobile-menu');
      const themeBtn = document.getElementById('mobile-theme-toggle-btn');
      const themeLabel = document.getElementById('mobile-theme-label');

      mobileBtn?.click();
      const menuOpened = !menu?.classList.contains('hidden');

      if (document.documentElement.classList.contains('theme-starwars')) {
        themeBtn?.click();
      }

      themeBtn?.click();
      const isStarWars = document.documentElement.classList.contains('theme-starwars');
      const starWarsLabel = themeLabel?.textContent;

      themeBtn?.click();
      const isMonochrome = !document.documentElement.classList.contains('theme-starwars');
      const monoLabel = themeLabel?.textContent;

      mobileBtn?.click();
      const menuClosed = menu?.classList.contains('hidden');

      return { menuOpened, isStarWars, starWarsLabel, isMonochrome, monoLabel, menuClosed };
    })()`);
    assert.equal(mobileNavCheck.menuOpened, true, 'Clicking nav-mobile-btn must reveal mobile navigation drawer');
    assert.equal(mobileNavCheck.isStarWars, true, 'mobile-theme-toggle-btn must toggle Star Wars theme');
    assert.equal(mobileNavCheck.starWarsLabel, 'Star Wars', 'mobile-theme-label must display "Star Wars" when active');
    assert.equal(mobileNavCheck.isMonochrome, true, 'Toggling mobile theme twice must restore Monochrome theme');
    assert.equal(mobileNavCheck.monoLabel, 'Monochrome', 'mobile-theme-label must display "Monochrome"');
    assert.equal(mobileNavCheck.menuClosed, true, 'Clicking nav-mobile-btn again must close mobile drawer');

    // C. Mobile Navigation Drawer Auto-Dismiss on In-Page Link Click
    const drawerDismissCheck = await evaluate(`(() => {
      const mobileBtn = document.getElementById('nav-mobile-btn');
      const menu = document.getElementById('nav-mobile-menu');
      const inPageLink = document.querySelector('#nav-mobile-menu a[href^="#"].mobile-link');

      if (menu?.classList.contains('hidden')) mobileBtn?.click();
      const opened = !menu?.classList.contains('hidden');

      inPageLink?.click();
      const closedAfterClick = menu?.classList.contains('hidden');

      return { opened, closedAfterClick, linkFound: !!inPageLink };
    })()`);
    assert.equal(drawerDismissCheck.linkFound, true, 'In-page mobile navigation link must exist');
    assert.equal(drawerDismissCheck.opened, true, 'Mobile drawer must open when triggered');
    assert.equal(drawerDismissCheck.closedAfterClick, true, 'Clicking any navigation link in mobile drawer must auto-dismiss the menu');

    // D. Mobile Web Overlay Zero Horizontal Scrollbar & Viewport Containment Audit (375px)
    const mobileOverflowCheck = await evaluate(`(() => {
      const docScrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body.scrollWidth;
      const winWidth = window.innerWidth;

      const landmarkSelectors = ['#main-nav', '#hero', '#about-leadership', '#events-gallery', '#events', '#register', 'footer'];
      const landmarkOverflows = landmarkSelectors.map(sel => {
        const el = document.querySelector(sel);
        return {
          selector: sel,
          exists: !!el,
          scrollWidth: el?.scrollWidth || 0,
          overflow: (el?.scrollWidth || 0) > winWidth
        };
      });

      return {
        winWidth,
        docScrollWidth,
        bodyScrollWidth,
        hasHorizontalScrollbar: docScrollWidth > winWidth || bodyScrollWidth > winWidth,
        landmarkOverflows
      };
    })()`);
    assert.equal(mobileOverflowCheck.hasHorizontalScrollbar, false, `Mobile viewport 375px must have zero horizontal overflow (doc: ${mobileOverflowCheck.docScrollWidth}px, body: ${mobileOverflowCheck.bodyScrollWidth}px)`);
    for (const lm of mobileOverflowCheck.landmarkOverflows) {
      if (lm.exists) {
        assert.equal(lm.overflow, false, `Landmark ${lm.selector} must not overflow mobile 375px width (got ${lm.scrollWidth}px)`);
      }
    }

    // E. Mobile Native Preview Modal Responsive Geometry & Tap Dismissal
    const mobileDialogCheck = await evaluate(`(() => {
      const trigger = document.querySelector('[data-preview-trigger]');
      trigger?.click();
      const dlg = document.getElementById('ig-preview-dialog');
      const dlgRect = dlg?.getBoundingClientRect();
      const closeBtn = document.getElementById('ig-preview-close');
      const closeRect = closeBtn?.getBoundingClientRect();

      const dialogOpened = !!dlg?.open;
      const widthInBounds = dlgRect ? dlgRect.width <= window.innerWidth : false;
      const leftInBounds = dlgRect ? dlgRect.left >= 0 : false;
      const closeInBounds = closeRect ? (closeRect.right <= window.innerWidth && closeRect.left >= 0) : false;

      closeBtn?.click();
      const dialogClosed = !dlg?.open;

      return { dialogOpened, widthInBounds, leftInBounds, closeInBounds, dialogClosed };
    })()`);
    assert.equal(mobileDialogCheck.dialogOpened, true, 'Preview dialog must open on mobile tap');
    assert.equal(mobileDialogCheck.widthInBounds, true, 'Preview dialog width must not exceed mobile viewport width');
    assert.equal(mobileDialogCheck.leftInBounds, true, 'Preview dialog must not clip past the left mobile viewport edge');
    assert.equal(mobileDialogCheck.closeInBounds, true, 'Close button must remain fully accessible within mobile screen bounds');
    assert.equal(mobileDialogCheck.dialogClosed, true, 'Tapping close button on mobile must dismiss preview modal');

    // F. Mobile Stargaze Cockpit Layout & Offscreen Boundary Check
    const mobileCockpitCheck = await evaluate(`(() => {
      document.getElementById('nav-stargaze-btn')?.click();
      const header = document.querySelector('#cockpit-ui header');
      const returnBtn = document.getElementById('btn-header-return');
      const retRect = returnBtn?.getBoundingClientRect();
      const pill = document.getElementById('hud-pill-view')?.getBoundingClientRect();
      const pillText = document.getElementById('hud-pill-view')?.textContent;

      return {
        headerOverflow: (header?.scrollWidth || 0) > (header?.clientWidth || 0),
        returnInBounds: retRect ? (retRect.right <= window.innerWidth && retRect.left >= 0) : false,
        pillInBounds: pill ? (pill.right <= window.innerWidth && pill.left >= 0) : false,
        hasHuntLabel: (pillText || '').includes('HUNT:'),
        hasAlignLabel: (pillText || '').includes('ALIGN:')
      };
    })()`);
    assert.equal(mobileCockpitCheck.headerOverflow, false, 'Mobile cockpit header must not overflow horizontally');
    assert.equal(mobileCockpitCheck.returnInBounds, true, 'Return to Site button must be within mobile screen bounds');
    assert.equal(mobileCockpitCheck.pillInBounds, true, 'HUD telemetry pill must be within mobile screen bounds');
    assert.equal(mobileCockpitCheck.hasHuntLabel, true, 'HUD pill must display visible HUNT: label on mobile');
    assert.equal(mobileCockpitCheck.hasAlignLabel, true, 'HUD pill must display visible ALIGN: label on mobile');

    // G. Touch Gestures: Double-Tap Zoom Toggle, Pinch-to-Zoom & Pan Simulation
    const touchGestureCheck = await evaluate(`(async () => {
      const canvas = document.getElementById('sky-canvas');
      const btn20x = document.getElementById('scope-btn-20x');
      const btn150x = document.getElementById('scope-btn-150x');

      // 1. Double tap within 300ms to toggle zoom
      const t1 = new Touch({ identifier: 1, target: canvas, clientX: 180, clientY: 400 });
      window.dispatchEvent(new TouchEvent('touchstart', { touches: [t1], bubbles: true }));
      window.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));

      const t2 = new Touch({ identifier: 2, target: canvas, clientX: 180, clientY: 400 });
      window.dispatchEvent(new TouchEvent('touchstart', { touches: [t2], bubbles: true }));
      window.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));

      const zoom150xEngaged = btn150x?.classList.contains('bg-white');

      // 2. Another double tap to toggle back to 20x
      window.dispatchEvent(new TouchEvent('touchstart', { touches: [t1], bubbles: true }));
      window.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));
      window.dispatchEvent(new TouchEvent('touchstart', { touches: [t2], bubbles: true }));
      window.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));

      const zoom20xRestored = btn20x?.classList.contains('bg-white');

      // 3. Two-Finger Pinch-to-Zoom: Pinch-out (>40px delta) engages 150x zoom
      const p1 = new Touch({ identifier: 10, target: canvas, clientX: 150, clientY: 400 });
      const p2 = new Touch({ identifier: 11, target: canvas, clientX: 200, clientY: 400 });
      window.dispatchEvent(new TouchEvent('touchstart', { touches: [p1, p2], bubbles: true }));

      const p1Out = new Touch({ identifier: 10, target: canvas, clientX: 100, clientY: 400 });
      const p2Out = new Touch({ identifier: 11, target: canvas, clientX: 250, clientY: 400 });
      window.dispatchEvent(new TouchEvent('touchmove', { touches: [p1Out, p2Out], bubbles: true }));
      window.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));

      const pinchOut150x = btn150x?.classList.contains('bg-white');

      // 4. Two-Finger Pinch-in (<-40px delta) restores 20x finder
      const p1InStart = new Touch({ identifier: 20, target: canvas, clientX: 100, clientY: 400 });
      const p2InStart = new Touch({ identifier: 21, target: canvas, clientX: 250, clientY: 400 });
      window.dispatchEvent(new TouchEvent('touchstart', { touches: [p1InStart, p2InStart], bubbles: true }));

      const p1InMove = new Touch({ identifier: 20, target: canvas, clientX: 150, clientY: 400 });
      const p2InMove = new Touch({ identifier: 21, target: canvas, clientX: 200, clientY: 400 });
      window.dispatchEvent(new TouchEvent('touchmove', { touches: [p1InMove, p2InMove], bubbles: true }));
      window.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));

      const pinchIn20x = btn20x?.classList.contains('bg-white');

      // 5. Single-finger touch pan drag simulation: verify orientation/telemetry shift
      const alignBefore = document.getElementById('pill-alignment')?.textContent;
      const arrowTransformBefore = document.getElementById('target-dir-arrow')?.style.transform || '';

      const panTouchStart = new Touch({ identifier: 30, target: canvas, clientX: 180, clientY: 400 });
      window.dispatchEvent(new TouchEvent('touchstart', { touches: [panTouchStart], bubbles: true }));
      const panTouchMove = new Touch({ identifier: 30, target: canvas, clientX: 60, clientY: 280 });
      window.dispatchEvent(new TouchEvent('touchmove', { touches: [panTouchMove], bubbles: true }));
      window.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));

      await new Promise(r => setTimeout(r, 150));
      const alignAfter = document.getElementById('pill-alignment')?.textContent;
      const arrowTransformAfter = document.getElementById('target-dir-arrow')?.style.transform || '';
      const panShiftedTelemetry = (alignBefore !== alignAfter) || (arrowTransformBefore !== arrowTransformAfter);

      return { zoom150xEngaged, zoom20xRestored, pinchOut150x, pinchIn20x, panShiftedTelemetry };
    })()`);
    assert.equal(touchGestureCheck.zoom150xEngaged, true, 'Mobile double-tap on canvas must engage 150x zoom');
    assert.equal(touchGestureCheck.zoom20xRestored, true, 'Second mobile double-tap on canvas must restore 20x finder');
    assert.equal(touchGestureCheck.pinchOut150x, true, 'Two-finger pinch-out on mobile canvas must engage 150x zoom');
    assert.equal(touchGestureCheck.pinchIn20x, true, 'Two-finger pinch-in on mobile canvas must restore 20x finder');
    assert.equal(touchGestureCheck.panShiftedTelemetry, true, 'Single-finger touch pan drag must shift telescope orientation telemetry');

    // H. Mobile HUD Variants Responsive Containment Check
    const mobileHUDCheck = await evaluate(`(() => {
      const winW = window.innerWidth;
      const btnCycle = document.getElementById('btn-cycle-hud');

      const variants = ['pill', 'reticle', 'ticker', 'card'];
      const hudEls = {
        pill: document.getElementById('hud-pill-view'),
        reticle: document.getElementById('hud-reticle-view'),
        ticker: document.getElementById('hud-ticker-view'),
        card: document.getElementById('hud-card-view')
      };

      const checks = {};
      for (let i = 0; i < 4; i++) {
        const rawLabel = (document.getElementById('hud-cycle-label')?.textContent || '').toLowerCase();
        for (const v of variants) {
          if (rawLabel.includes(v)) {
            const el = hudEls[v];
            const r = el?.getBoundingClientRect();
            checks[v] = {
              visible: el && !el.classList.contains('hidden'),
              leftInBounds: r ? r.left >= -2 : false,
              rightInBounds: r ? r.right <= winW + 2 : false
            };
          }
        }
        btnCycle?.click();
      }
      return checks;
    })()`);
    for (const [variant, res] of Object.entries(mobileHUDCheck)) {
      assert.equal(res.visible, true, `HUD variant ${variant} must be visible when selected`);
      assert.equal(res.leftInBounds, true, `HUD variant ${variant} must not clip off left edge of mobile screen`);
      assert.equal(res.rightInBounds, true, `HUD variant ${variant} must not overflow off right edge of mobile screen`);
    }

    // Verify zero uncaught browser runtime exceptions
    assert.equal(consoleErrors.length, 0, `Browser must have zero uncaught exceptions: ${consoleErrors.join(', ')}`);
  } finally {
    cleanup();
  }
});
