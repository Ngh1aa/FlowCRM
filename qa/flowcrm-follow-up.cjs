const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

const base = new URL(process.env.FLOWCRM_BASE_URL || 'http://127.0.0.1:8000/FlowCRM/');
const evidence = process.env.FLOWCRM_EVIDENCE_DIR;
const widths = [1440, 1280, 768, 390, 375];
const appointment = 'Confirm website scope';
const taskName = 'Send updated proposal';
const editedAppointment = 'Approve website scope';
const editedTask = 'Send final proposal';

async function enterDemo(page, route = 'pipeline.html') {
  const url = new URL(route, base).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  assert.equal(response.url(), url);
  await expect(page).toHaveURL(url);
  await expect(page.locator('#loginForm')).toHaveCount(0);
  await expect(page.locator('#userProfile')).toContainText('An Nguyen');
}

async function verifyFlow(browser, width) {
  const mobile = width <= 390;
  const context = await browser.newContext({
    viewport: { width, height: mobile ? 812 : 900 },
    hasTouch: mobile,
    isMobile: mobile,
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    const url = message.location().url;
    if (message.type() === 'error' && url.startsWith(base.origin) && !url.endsWith('/favicon.ico')) {
      errors.push(message.text() + ' at ' + url);
    }
  });
  page.on('response', response => {
    if (response.url().startsWith(base.origin) && response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
      errors.push(response.status() + ' ' + response.url());
    }
  });
  const activate = locator => mobile ? locator.tap() : locator.click();
  const screenshot = async name => {
    if (evidence && [1440, 390].includes(width)) {
      await page.screenshot({ path: path.join(evidence, name + '-' + width + '.png'), timeout: 30000 });
    }
  };
  const checkWidth = async () => assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true,
    'Page width at ' + width + 'px on ' + page.url()
  );

  try {
    await enterDemo(page);
    const deal = page.getByRole('button', { name: 'Website Redesign', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Website Redesign' });
    const stage = dialog.getByLabel('Stage');
    const date = dialog.getByLabel('Appointment date');
    const dueDate = dialog.getByLabel('Due date');
    const save = dialog.getByRole('button', { name: 'Save plan' });
    await checkWidth();
    if (mobile) {
      await activate(deal);
    } else {
      await deal.focus();
      await page.keyboard.press('Enter');
      await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(stage).toBeFocused();
    }
    await stage.selectOption({ label: 'Proposal' });
    await dialog.getByLabel('Appointment name').fill(appointment);
    await date.fill('2026-11-18');
    await dialog.getByLabel('Appointment time').fill('10:00');
    await dialog.getByLabel('Follow-up task').fill(taskName);
    await dueDate.fill('2026-11-17');
    await activate(save);
    assert.equal(await dueDate.evaluate(input => input.validity.customError), true);
    await expect(dialog.getByRole('link', { name: 'View appointment' })).toBeHidden();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.flowcrm_deals).some(deal => deal.plan)), false);
    await dueDate.fill('2026-11-18');
    if (mobile) await activate(save);
    else await save.press('Enter');
    await expect(dialog.getByRole('status')).toHaveText(/^Saved/);
    await screenshot('plan');
    await activate(dialog.getByRole('link', { name: 'View appointment' }));
    await expect(page).toHaveURL(/calendar\.html\?date=2026-11-18$/);
    await checkWidth();
    const chip = page.locator('.event-chip').filter({ hasText: appointment });
    await expect(page.locator('#calendarGrid').locator(chip)).toHaveCount(1);
    await expect(page.locator('.calendar-day').filter({ has: chip }).locator('.day-number')).toHaveText('18');
    await activate(page.locator('#viewDay'));
    await expect(page.locator('#calendarGrid')).toContainText('10:00 - ' + appointment);
    await screenshot('appointment');
    await activate(page.locator('#nextMonth'));
    await expect(page.locator('#calendarGrid')).not.toContainText(appointment);
    await activate(page.locator('#viewMonth'));
    await expect(page.locator('#calendarGrid .calendar-weekday')).toHaveText(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    await activate(page.locator('#nextMonth'));
    await expect(chip).toHaveCount(0);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(dialog).toBeVisible();
    const proposal = page.locator('[data-stage="proposal"]');
    await expect(proposal.locator('.kanban-column-title')).toHaveText('Proposal');
    await expect(proposal.getByRole('button', { name: 'Website Redesign', exact: true })).toHaveCount(1);

    await activate(dialog.getByRole('link', { name: 'View task' }));
    const rows = page.locator('#dealFollowUpsList article');
    await expect(rows).toHaveCount(1);
    await checkWidth();
    assert.equal(await page.locator('#dealFollowUpsTitle').evaluate(title =>
      title.getBoundingClientRect().top >= document.querySelector('.topbar').getBoundingClientRect().bottom
    ), true, 'Follow-up heading must clear the sticky header');
    await expect(rows).toContainText(taskName);
    await expect(rows).toContainText('Due Nov 18');
    await activate(rows.getByRole('button', { name: 'Mark complete' }));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(rows.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true');
    await screenshot('task');
    await activate(rows.getByRole('link', { name: 'Open deal' }));
    await expect(dialog.getByRole('status')).toHaveText('Task completed.');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(date).toHaveValue('2026-11-18');
    await expect(stage).toHaveValue('proposal');

    await dialog.getByLabel('Appointment name').fill(editedAppointment);
    await date.fill('2027-01-07');
    await dueDate.fill('2027-01-08');
    await dialog.getByLabel('Follow-up task').fill(editedTask);
    await activate(save);
    await expect(dialog.getByRole('status')).toHaveText(/^Saved/);
    await activate(dialog.getByRole('link', { name: 'View appointment' }));
    await expect(page).toHaveURL(/date=2027-01-07$/);
    await expect(page.getByLabel('Year', { exact: true })).toHaveValue('2027');
    await expect(page.locator('#calendarGrid')).toContainText(editedAppointment);
    await expect(page.locator('#eventsList')).not.toContainText(appointment);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await activate(dialog.getByRole('link', { name: 'View task' }));
    await expect(rows).toHaveCount(1);
    await expect(rows).toContainText(editedTask);
    await expect(rows.getByRole('button', { name: 'Mark complete' })).toHaveAttribute('aria-pressed', 'false');
    await activate(rows.getByRole('link', { name: 'Open deal' }));
    await expect(dialog).toBeVisible();
    if (mobile) await activate(dialog.getByRole('button', { name: 'Close' }));
    else await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(deal).toBeFocused();
    await expect(page).toHaveURL(new URL('pipeline.html', base).href);
    assert.deepEqual(errors, []);
    console.log('PASS ' + width + 'px · Signed-in entry, validation, calendar, task, edit, reload, focus, overflow');
  } finally {
    await context.close();
  }
}

async function verifyLegacy(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await enterDemo(page, 'pipeline.html?deal=1');
    const dialog = page.getByRole('dialog', { name: 'Website Redesign' });
    await expect(dialog).toBeVisible();
    await page.evaluate(() => localStorage.removeItem('flowcrm_session'));
    await page.goto(new URL('login.html?redirect=pipeline.html%3Fdeal%3D1', base).href, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new URL('pipeline.html?deal=1', base).href);
    await expect(dialog).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).include('#dealPlan').analyze();
    assert.deepEqual(violations.map(violation => violation.id), []);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await page.evaluate(() => {
      localStorage.flowcrm_deals = JSON.stringify([
        { id: 42, title: 'Old deal', customer: 'Old customer', stage: 'closed-won', probability: 81 },
      ]);
      localStorage.flowcrm_events = JSON.stringify([
        { title: 'Old appointment', date: '2026-11-18', startTime: '09:00' },
      ]);
      localStorage.flowcrm_tasks = '[]';
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    const card = page.locator('.kanban-card[data-id="42"]');
    const ownColumn = page.locator('[data-stage="closed-won"]');
    await expect(ownColumn.locator('.kanban-card')).toHaveCount(1);
    await card.dragTo(ownColumn.locator('.kanban-column-title'));
    await expect(card).toHaveAttribute('data-probability', '81');
    const target = page.locator('[data-stage="negotiation"]');
    await card.dragTo(target.locator('.kanban-column-title'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(target.locator('.kanban-card')).toHaveCount(1);
    await card.getByRole('button', { name: 'Old deal' }).click();
    const legacyDialog = page.getByRole('dialog', { name: 'Old deal' });
    await expect(legacyDialog.getByLabel('Stage')).toHaveValue('negotiation');
    await legacyDialog.getByLabel('Appointment name').fill('New follow-up appointment');
    await legacyDialog.getByLabel('Appointment date').fill('2026-11-18');
    await legacyDialog.getByLabel('Appointment time').fill('10:00');
    await legacyDialog.getByLabel('Follow-up task').fill('New follow-up task');
    await legacyDialog.getByLabel('Due date').fill('2026-11-18');
    await legacyDialog.getByRole('button', { name: 'Save plan' }).click();
    await legacyDialog.getByRole('link', { name: 'View appointment' }).click();
    await expect(page.locator('#calendarGrid')).toContainText('New follow-up appointment');
    await expect(page.locator('#calendarGrid')).toContainText('Old appointment');
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await legacyDialog.getByRole('link', { name: 'View task' }).click();
    const row = page.locator('#dealFollowUpsList article');
    await row.getByRole('button', { name: 'Mark complete' }).click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(row.getByRole('button', { name: 'Completed' })).toBeVisible();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.flowcrm_deals).length), 1);
    assert.equal(await page.evaluate(() => localStorage.flowcrm_tasks), '[]');
    console.log('PASS legacy · direct entry, old login link, numeric ID, same-column drop, saved drag, existing event and empty task list');
    console.log('PASS axe-core · planning dialog');
  } finally {
    await context.close();
  }
}

async function main() {
  if (evidence) await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.FLOWCRM_BROWSER_CHANNEL || undefined });
  try {
    const results = await Promise.allSettled(widths.map(width => verifyFlow(browser, width)));
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length) throw new AggregateError(failures.map(result => result.reason), 'Viewport checks failed');
    await verifyLegacy(browser);
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
