// @ts-check
import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.dirname(__filename);

const testFiles = [
  path.join(rootDir, 'tests/01-static-integrity.test.mjs'),
  path.join(rootDir, 'tests/02-architecture-audit.test.mjs'),
  path.join(rootDir, 'tests/03-browser-desktop.test.mjs'),
  path.join(rootDir, 'tests/04-browser-mobile.test.mjs'),
  path.join(rootDir, 'tests/05-browser-lab.test.mjs')
];

let hasFailure = false;

const testStream = run({
  files: testFiles,
  concurrency: true // Run all 5 suites simultaneously in parallel
});

testStream.on('test:fail', () => {
  hasFailure = true;
});

testStream.compose(new spec()).pipe(process.stdout);

testStream.on('end', () => {
  if (hasFailure) {
    process.exitCode = 1;
  }
});
