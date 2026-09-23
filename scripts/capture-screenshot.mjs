// Reusable Headless Chrome CDP Screenshot & Device Emulation Utility
// Usage:
//   node scripts/capture-screenshot.mjs [url] [desktop|mobile] [outputFilePath]
// Examples:
//   node scripts/capture-screenshot.mjs http://localhost:4321 mobile app_screenshot/mobile_preview.png
//   node scripts/capture-screenshot.mjs http://localhost:4321 desktop app_screenshot/desktop_preview.png

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCdpSession } from '../tests/helpers/cdpClient.mjs';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '..');

const targetUrl = process.argv[2] || 'http://localhost:4321/';
const mode = (process.argv[3] || 'mobile').toLowerCase();
const outputPath = process.argv[4]
  ? path.resolve(process.cwd(), process.argv[4])
  : path.join(rootDir, 'app_screenshot', `${mode}_${Date.now()}.png`);

console.log(`[CDP Capture] Target: ${targetUrl}`);
console.log(`[CDP Capture] Emulation Mode: ${mode}`);
console.log(`[CDP Capture] Output: ${outputPath}`);

const session = await createCdpSession(targetUrl);
if (!session) {
  console.error('[CDP Capture] Error: Chrome binary not found on system paths.');
  process.exit(1);
}

const { send, evaluate, cleanup } = session;

try {
  // Wait for initial DOM hydration
  await new Promise(r => setTimeout(r, 600));

  if (mode === 'mobile') {
    // iPhone 14 / modern Android viewport emulation with 3x Retina density
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await evaluate('window.dispatchEvent(new Event("resize"))');
    await new Promise(r => setTimeout(r, 400));
  } else {
    // Standard 1080p Desktop viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });
    await evaluate('window.dispatchEvent(new Event("resize"))');
    await new Promise(r => setTimeout(r, 400));
  }

  // Capture framebuffer
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const data = screenshot.result?.data || screenshot.data;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(data, 'base64'));
  console.log(`[CDP Capture] Successfully saved screenshot to ${outputPath}`);
} catch (err) {
  console.error('[CDP Capture] Error capturing screenshot:', err);
  process.exitCode = 1;
} finally {
  cleanup();
}
