// Usage: start the app (.\run.ps1), then:  cd scripts; npm install; npm run shots
// Saves PNGs to docs/screenshots. Uses the installed Microsoft Edge (or Chrome) — no browser download.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const APP = process.env.APP_URL || 'http://localhost:8081';
const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots');
mkdirSync(out, { recursive: true });

async function launch() {
  for (const channel of ['msedge', 'chrome']) {
    try { return await chromium.launch({ channel }); } catch { /* try next */ }
  }
  throw new Error('Neither Microsoft Edge nor Google Chrome was found');
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const shot = async (name) => {
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(out, `${name}.png`) });
  console.log('saved', name);
};

await page.goto(`${APP}/login`, { waitUntil: 'networkidle' });
await shot('01-login');

await page.fill('input[type=email]', 'admin@clinic.test');
await page.fill('input[type=password]', 'password');
await page.click('button:has-text("Sign in")');
await page.waitForURL('**/dashboard');
await page.waitForSelector('.stat-value');
await shot('02-dashboard');

await page.goto(`${APP}/clients`, { waitUntil: 'networkidle' });
await page.waitForSelector('.profile-head');
await shot('03-clients');

await page.click('button:has-text("Edit")');
await shot('04-client-edit');

await page.goto(`${APP}/services`, { waitUntil: 'networkidle' });
await page.waitForSelector('.table tbody tr');
await page.click('.table tbody tr:nth-child(2)');
await shot('05-services');

await page.goto(`${APP}/staff`, { waitUntil: 'networkidle' });
await page.waitForSelector('.staff-card');
await shot('06-staff');

await page.goto(`${APP}/centers`, { waitUntil: 'networkidle' });
await page.waitForSelector('.center-card');
await shot('07-centers');

await browser.close();
console.log('Done ->', out);
