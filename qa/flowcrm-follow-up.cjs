const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

const base = new URL(process.env.FLOWCRM_BASE_URL || 'http://127.0.0.1:8000/FlowCRM/');
const evidence = process.env.FLOWCRM_EVIDENCE_DIR;
const widths = [1440, 1280, 768, 390, 375];
const appointment = 'Chốt phạm vi website';
const taskName = 'Gửi đề xuất đã cập nhật';
const editedAppointment = 'Duyệt phạm vi website';
const editedTask = 'Gửi đề xuất cuối';

async function enterDemo(page, route = 'pipeline.html') {
  const url = new URL(route, base).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  assert.equal(response.url(), url);
  await expect(page).toHaveURL(url);
  await expect(page.locator('#loginForm')).toHaveCount(0);
  await expect(page.locator('#userProfile')).toContainText('Người dùng Demo');
}

async function verifyFlow(browser, width) {
  const mobile = width <= 390;
  const context = await browser.newContext({
    viewport: { width, height: mobile ? 812 : 900 },
    hasTouch: mobile,
    isMobile: mobile,
    locale: 'vi-VN',
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
    const stage = dialog.getByLabel('Giai đoạn');
    const date = dialog.getByLabel('Ngày hẹn');
    const dueDate = dialog.getByLabel('Hạn hoàn thành');
    const save = dialog.getByRole('button', { name: 'Lưu kế hoạch' });
    await checkWidth();
    if (mobile) {
      await activate(deal);
    } else {
      await deal.focus();
      await page.keyboard.press('Enter');
      await expect(dialog.getByRole('button', { name: 'Đóng' })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(stage).toBeFocused();
    }
    await stage.selectOption({ label: 'Đề xuất' });
    await dialog.getByLabel('Tên lịch hẹn').fill(appointment);
    await date.fill('2026-11-18');
    await dialog.getByLabel('Giờ hẹn').fill('10:00');
    await dialog.getByLabel('Việc cần làm sau cuộc hẹn').fill(taskName);
    await dueDate.fill('2026-11-17');
    await activate(save);
    assert.equal(await dueDate.evaluate(input => input.validity.customError), true);
    await expect(dialog.getByRole('link', { name: 'Xem lịch hẹn' })).toBeHidden();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.flowcrm_deals).some(deal => deal.plan)), false);
    await dueDate.fill('2026-11-18');
    if (mobile) await activate(save);
    else await save.press('Enter');
    await expect(dialog.getByRole('status')).toHaveText(/^Đã lưu/);
    await screenshot('ke-hoach');
    await activate(dialog.getByRole('link', { name: 'Xem lịch hẹn' }));
    await expect(page).toHaveURL(/calendar\.html\?date=2026-11-18$/);
    await checkWidth();
    const chip = page.locator('.event-chip').filter({ hasText: appointment });
    await expect(page.locator('#calendarGrid').locator(chip)).toHaveCount(1);
    await expect(page.locator('.calendar-day').filter({ has: chip }).locator('.day-number')).toHaveText('18');
    await activate(page.locator('#viewDay'));
    await expect(page.locator('#calendarGrid')).toContainText('10:00 - ' + appointment);
    await screenshot('lich-hen');
    await activate(page.locator('#nextMonth'));
    await expect(page.locator('#calendarGrid')).not.toContainText(appointment);
    await activate(page.locator('#viewMonth'));
    await expect(page.locator('#calendarGrid .calendar-weekday')).toHaveText(['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']);
    await activate(page.locator('#nextMonth'));
    await expect(chip).toHaveCount(0);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(dialog).toBeVisible();
    const proposal = page.locator('[data-stage="proposal"]');
    await expect(proposal.locator('.kanban-column-title')).toHaveText('Đề xuất');
    await expect(proposal.getByRole('button', { name: 'Website Redesign', exact: true })).toHaveCount(1);

    await activate(dialog.getByRole('link', { name: 'Xem nhiệm vụ' }));
    const rows = page.locator('#dealFollowUpsList article');
    await expect(rows).toHaveCount(1);
    await checkWidth();
    assert.equal(await page.locator('#dealFollowUpsTitle').evaluate(title =>
      title.getBoundingClientRect().top >= document.querySelector('.topbar').getBoundingClientRect().bottom
    ), true, 'Follow-up heading must clear the sticky header');
    await expect(rows).toContainText(taskName);
    await expect(rows).toContainText('Hạn 18-11');
    await activate(rows.getByRole('button', { name: 'Đánh dấu hoàn thành' }));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(rows.getByRole('button', { name: 'Đã hoàn thành' })).toHaveAttribute('aria-pressed', 'true');
    await screenshot('nhiem-vu');
    await activate(rows.getByRole('link', { name: 'Mở cơ hội' }));
    await expect(dialog.getByRole('status')).toHaveText('Nhiệm vụ đã hoàn thành.');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(date).toHaveValue('2026-11-18');
    await expect(stage).toHaveValue('proposal');

    await dialog.getByLabel('Tên lịch hẹn').fill(editedAppointment);
    await date.fill('2027-01-07');
    await dueDate.fill('2027-01-08');
    await dialog.getByLabel('Việc cần làm sau cuộc hẹn').fill(editedTask);
    await activate(save);
    await expect(dialog.getByRole('status')).toHaveText(/^Đã lưu/);
    await activate(dialog.getByRole('link', { name: 'Xem lịch hẹn' }));
    await expect(page).toHaveURL(/date=2027-01-07$/);
    await expect(page.getByLabel('Năm', { exact: true })).toHaveValue('2027');
    await expect(page.locator('#calendarGrid')).toContainText(editedAppointment);
    await expect(page.locator('#eventsList')).not.toContainText(appointment);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await activate(dialog.getByRole('link', { name: 'Xem nhiệm vụ' }));
    await expect(rows).toHaveCount(1);
    await expect(rows).toContainText(editedTask);
    await expect(rows.getByRole('button', { name: 'Đánh dấu hoàn thành' })).toHaveAttribute('aria-pressed', 'false');
    await activate(rows.getByRole('link', { name: 'Mở cơ hội' }));
    await expect(dialog).toBeVisible();
    if (mobile) await activate(dialog.getByRole('button', { name: 'Đóng' }));
    else await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(deal).toBeFocused();
    await expect(page).toHaveURL(new URL('pipeline.html', base).href);
    assert.deepEqual(errors, []);
    console.log('PASS ' + width + 'px · Demo, validation, calendar, task, edit, reload, focus, overflow');
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
        { id: 42, title: 'Cơ hội cũ', customer: 'Khách cũ', stage: 'closed-won', probability: 81 },
      ]);
      localStorage.flowcrm_events = JSON.stringify([
        { title: 'Lịch cũ', date: '2026-11-18', startTime: '09:00' },
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
    await card.getByRole('button', { name: 'Cơ hội cũ' }).click();
    const legacyDialog = page.getByRole('dialog', { name: 'Cơ hội cũ' });
    await expect(legacyDialog.getByLabel('Giai đoạn')).toHaveValue('negotiation');
    await legacyDialog.getByLabel('Tên lịch hẹn').fill('Lịch theo dõi mới');
    await legacyDialog.getByLabel('Ngày hẹn').fill('2026-11-18');
    await legacyDialog.getByLabel('Giờ hẹn').fill('10:00');
    await legacyDialog.getByLabel('Việc cần làm sau cuộc hẹn').fill('Việc mới');
    await legacyDialog.getByLabel('Hạn hoàn thành').fill('2026-11-18');
    await legacyDialog.getByRole('button', { name: 'Lưu kế hoạch' }).click();
    await legacyDialog.getByRole('link', { name: 'Xem lịch hẹn' }).click();
    await expect(page.locator('#calendarGrid')).toContainText('Lịch theo dõi mới');
    await expect(page.locator('#calendarGrid')).toContainText('Lịch cũ');
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await legacyDialog.getByRole('link', { name: 'Xem nhiệm vụ' }).click();
    const row = page.locator('#dealFollowUpsList article');
    await row.getByRole('button', { name: 'Đánh dấu hoàn thành' }).click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(row.getByRole('button', { name: 'Đã hoàn thành' })).toBeVisible();
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
