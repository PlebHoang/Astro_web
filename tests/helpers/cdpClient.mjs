// @ts-check
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

export async function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address();
      const port = typeof addr === 'object' && addr ? addr.port : 9225;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

export function locateChrome() {
  const chromeCandidates = [
    '/home/khoi/.local/bin/google-chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  return chromeCandidates.find(p => fs.existsSync(p)) || null;
}

export async function createCdpSession(targetUrl = 'http://localhost:4321/') {
  const chromeBin = locateChrome();
  if (!chromeBin) {
    return null;
  }

  const cdpPort = await getFreePort();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `chrome-test-${cdpPort}-`));
  const chromeProc = spawn(chromeBin, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    `--user-data-dir=${tmpDir}`,
    `--remote-debugging-port=${cdpPort}`,
    targetUrl
  ], { stdio: 'ignore' });

  let isCleanedUp = false;
  const cleanup = () => {
    if (isCleanedUp) return;
    isCleanedUp = true;
    try { chromeProc.kill(); } catch {}
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  };

  try {
    let wsUrl = null;
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
        const data = await res.json();
        const page = data?.find(d => d.type === 'page') || data?.[0];
        if (page && page.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch {}
    }

    assert.ok(wsUrl, `Chrome CDP debugger websocket must be established on port ${cdpPort}`);

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const pending = new Map();
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(data.params.exceptionDetails?.text || 'Uncaught exception');
      }
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data);
        pending.delete(data.id);
      }
    };

    await new Promise(r => ws.onopen = r);

    const send = (method, params = {}) => new Promise(resolve => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Runtime.enable');
    await send('Page.enable');

    const evaluate = async (expression) => {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      if (res.result?.exceptionDetails) {
        throw new Error(res.result.exceptionDetails.text);
      }
      return res.result?.result?.value;
    };

    return {
      ws,
      send,
      evaluate,
      consoleErrors,
      cleanup: () => {
        try { ws.close(); } catch {}
        cleanup();
      }
    };
  } catch (err) {
    cleanup();
    throw err;
  }
}
