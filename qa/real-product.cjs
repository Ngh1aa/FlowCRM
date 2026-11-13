// Real-product checks: signed-in entry, no prototype wording, hidden workspace tools,
// sign out / sign in, register, console errors and dead links on every page.
// Run: FLOWCRM_BASE_URL=http://127.0.0.1:8000/FlowCRM/ node qa/real-product.cjs
const assert = require('node:assert/strict');
const { chromium, expect } = require('@playwright/test');

const base = new URL(process.env.FLOWCRM_BASE_URL || 'http://127.0.0.1:8000/FlowCRM/');
const root = new URL('../', base);
const pages = ['index', 'pipeline', 'customers', 'calendar', 'tasks', 'messages', 'reports', 'settings', 'login', 'register'];
const prototypeWording = /prototype|demo data|sandbox|simulat|fictional|state lab|portfolio review/i;
const credit = 'Concept product designed by Đỗ Anh Nghĩa.';
const url = route => new URL(route, base).href;

async function main() {
  const browser = await chromium.launch({ channel: process.env.FLOWCRM_BROWSER_CHANNEL || undefined });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text() + ' at ' + message.location().url);
  });
  page.on('response', response => {
    if (response.url().startsWith(base.origin) && response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
      errors.push(response.status() + ' ' + response.url());
    }
  });

  try {
    // 1. A first-time visitor opening the site root lands signed in on the dashboard.
    await page.goto(root.href, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(url('index.html'));
    await expect(page.locator('#loginForm')).toHaveCount(0);
    await expect(page.locator('#userProfile')).toContainText('An Nguyen');
    await expect(page.locator('#userProfile')).toContainText('Sales manager');
    console.log('PASS signed-in entry · root URL opens the dashboard as An Nguyen');

    // 2. No prototype wording, tools hidden, one credit line and no dead links on any page.
    for (const name of pages) {
      await page.goto(url(name + '.html'), { waitUntil: 'load' });
      if (name === 'login' || name === 'register') {
        await expect(page).toHaveURL(url('index.html'));
      }
      const text = await page.locator('body').innerText();
      assert.doesNotMatch(text, prototypeWording, name + ': prototype wording');
      assert.doesNotMatch(text, /Demo User/, name + ': placeholder user');
      await expect(page.locator('#demoTools')).toHaveCount(0);
      await expect(page.locator('.product-credit')).toHaveCount(1);
      await expect(page.locator('.product-credit')).toHaveText(credit);
      assert.equal(await page.locator('a[href="#"]').count(), 0, name + ': href="#"');
    }
    console.log('PASS ' + pages.length + ' pages · no prototype wording, no demo tools, one credit line, no href="#"');

    // 3. ?demo=1 shows the tools for the tab; Reset restores the seeded workspace; ?demo=0 hides them.
    await page.goto(url('pipeline.html?demo=1'), { waitUntil: 'load' });
    await expect(page.locator('#demoTools')).toBeVisible();
    await page.goto(url('customers.html'), { waitUntil: 'load' });
    await expect(page.locator('#demoTools')).toBeVisible();
    await page.evaluate(() => {
      localStorage.flowcrm_deals = '[]';
      localStorage.flowcrm_preference_pipeline = 'proposal';
    });
    await page.locator('#demoTools summary').click();
    await page.getByRole('button', { name: 'Reset demo data' }).click();
    await page.waitForLoadState('load');
    await expect(page.locator('#userProfile')).toContainText('An Nguyen');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.flowcrm_deals).length), 12);
    assert.equal(await page.evaluate(() => localStorage.getItem('flowcrm_preference_pipeline')), null);
    for (const name of pages) {
      await page.goto(url(name + '.html'), { waitUntil: 'load' });
      await expect(page.locator('#demoTools')).toBeVisible();
      assert.equal(await page.locator('a[href="#"]').count(), 0, name + ' with tools: href="#"');
    }
    await page.goto(url('index.html?demo=0'), { waitUntil: 'load' });
    await expect(page.locator('#demoTools')).toHaveCount(0);
    await page.goto(url('tasks.html'), { waitUntil: 'load' });
    await expect(page.locator('#demoTools')).toHaveCount(0);
    console.log('PASS demo tools · shown with ?demo=1 across pages, reset restores data, hidden again with ?demo=0');

    // 4. Sign out shows the login screen and work pages stay behind it until signing in.
    await page.goto(url('index.html'), { waitUntil: 'load' });
    await page.locator('#logoutBtn').click();
    await expect(page).toHaveURL(url('login.html'));
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
    await page.goto(url('reports.html'), { waitUntil: 'load' });
    await expect(page).toHaveURL(url('login.html?redirect=reports.html'));
    await expect(page.locator('#loginForm')).toBeVisible();
    const continueAs = page.getByRole('button', { name: 'Continue as An Nguyen' });
    await expect(continueAs).toBeVisible();

    await page.getByLabel('Email').fill('an.nguyen@flowcrm.vn');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page.locator('.toast')).toContainText('Incorrect email or password');
    await expect(page).toHaveURL(url('login.html?redirect=reports.html'));

    await page.getByLabel('Password').fill('flowcrm2026');
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await expect(page).toHaveURL(url('reports.html'));
    await expect(page.locator('#userProfile')).toContainText('An Nguyen');

    await page.locator('#logoutBtn').click();
    await expect(page).toHaveURL(url('login.html'));
    await page.getByRole('button', { name: 'Continue as An Nguyen' }).click();
    await expect(page).toHaveURL(url('index.html'));
    await expect(page.locator('#userProfile')).toContainText('An Nguyen');
    console.log('PASS sign out / sign in · login wall after sign-out, wrong password rejected, credentials and Continue as both work');

    // 5. Sign-up still creates a working account.
    await page.locator('#logoutBtn').click();
    await expect(page).toHaveURL(url('login.html'));
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page).toHaveURL(url('register.html'));
    await page.getByLabel('Full name').fill('Quynh Ho');
    await page.getByLabel('Email').fill('quynh.ho@flowcrm.vn');
    await page.getByLabel('Password', { exact: true }).fill('secret12');
    await page.getByLabel('Confirm password').fill('secret12');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL(url('index.html'));
    await expect(page.locator('#userProfile')).toContainText('Quynh Ho');
    console.log('PASS sign up · new account lands on the dashboard');

    assert.deepEqual(errors, []);
    console.log('PASS no console errors, page errors or failed local requests');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
