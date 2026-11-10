const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium, expect } = require('@playwright/test');

const base = new URL(process.env.FLOWCRM_BASE_URL || 'http://127.0.0.1:8000/FlowCRM/');
const evidence = process.env.FLOWCRM_EVIDENCE_DIR;
const routes = ['index', 'pipeline', 'customers', 'calendar', 'tasks', 'messages', 'reports', 'settings', 'login', 'register'];
const widths = [1440, 1280, 768, 390, 375, 320];

async function inspectRoutes(browser, width) {
  const mobile = width <= 390;
  const context = await browser.newContext({ viewport: { width, height: mobile ? 812 : 900 }, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(base.origin) && response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
        errors.push(response.status() + ' ' + response.url());
      }
    });
    for (const route of routes) {
      await page.evaluate(() => { if (location.protocol !== 'about:') localStorage.clear(); });
      await page.goto(new URL(route + '.html', base).href, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const metrics = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        inner: window.innerWidth,
        clippedProfile: [...document.querySelectorAll('.user-profile')].some(profile => {
          if (!profile.checkVisibility({ visibilityProperty: true })) return false;
          const role = profile.querySelector('.user-role');
          return role?.checkVisibility({ visibilityProperty: true }) &&
            role.getBoundingClientRect().bottom > profile.getBoundingClientRect().bottom - 3;
        }),
        unnamed: [...document.querySelectorAll('button')].filter(button =>
          button.checkVisibility({ visibilityProperty: true }) &&
          !button.textContent.trim() && !button.getAttribute('aria-label') && !button.title
        ).map(button => button.className),
        unlabelled: [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')].filter(input =>
          input.checkVisibility({ visibilityProperty: true }) && !input.labels?.length && !input.getAttribute('aria-label')
        ).map(input => input.id || input.className)
      }));
      assert.ok(metrics.scroll <= width + 1 && metrics.inner <= width + 1, route + ' ' + width + 'px: ' + JSON.stringify(metrics));
      assert.equal(metrics.clippedProfile, false, route + ' ' + width + 'px: profile role clipped');
      assert.deepEqual(metrics.unnamed, [], route + ' ' + width + 'px: unnamed buttons');
      assert.deepEqual(metrics.unlabelled, [], route + ' ' + width + 'px: unlabeled inputs');
      if (evidence && [1440, 390].includes(width)) {
        await page.screenshot({ path: path.join(evidence, route + '-' + width + '.png'), animations: 'disabled' });
      }
      assert.deepEqual(errors, [], route + ' ' + width + 'px: errors');
    }
    console.log('PASS 10 routes at ' + width + 'px · no viewport expansion, unnamed controls, local asset or JavaScript errors');
  } finally {
    await context.close();
  }
}

async function inspectActions(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 812 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    const go = route => page.goto(new URL(route + '.html', base).href, { waitUntil: 'domcontentloaded' });
    await go('pipeline');
    const menu = page.getByRole('button', { name: 'Mở menu' });
    await menu.focus();
    await menu.press('Enter');
    await expect(page.getByRole('navigation', { name: 'Điều hướng chính' }).locator('[aria-current="page"]')).toHaveText('Pipeline');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    const search = page.getByLabel('Tìm cơ hội');
    await search.fill('không tìm thấy');
    await expect(page.getByText('Không có cơ hội phù hợp.')).toBeVisible();
    await search.fill('Website Redesign');
    await expect(page.getByRole('button', { name: 'Website Redesign', exact: true })).toBeVisible();
    await page.getByLabel('Lọc giai đoạn', { exact: true }).selectOption('proposal');
    await expect(page.getByText('Không có cơ hội phù hợp.')).toBeVisible();

    await go('customers');
    await page.getByRole('button', { name: 'Thêm khách hàng' }).click();
    const customerForm = page.getByRole('dialog', { name: 'Thêm khách hàng' });
    await expect(customerForm.getByLabel('Họ và tên')).toBeFocused();
    await customerForm.getByLabel('Họ và tên').fill('Khách QA');
    await customerForm.getByLabel('Email').fill('khachqa@example.com');
    await customerForm.getByRole('button', { name: 'Lưu khách hàng' }).click();
    await page.getByLabel('Tìm khách hàng').fill('Khách QA');
    await page.getByRole('button', { name: 'Sửa Khách QA' }).click();
    await page.getByLabel('Công ty').fill('Công ty QA');
    await page.getByRole('button', { name: 'Lưu khách hàng' }).click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Công ty QA', { exact: true })).toBeVisible();

    await go('calendar');
    const day = page.getByRole('button', { name: /^Thêm lịch hẹn ngày 18\// }).first();
    await day.press('Enter');
    const eventForm = page.getByRole('dialog');
    await expect(eventForm.locator('#eventDate')).toHaveValue(/-18$/);
    await page.keyboard.press('Escape');
    await expect(day).toBeFocused();

    await go('tasks');
    await page.getByRole('button', { name: 'Thêm nhiệm vụ' }).click();
    await page.getByLabel('Tên nhiệm vụ').fill('Việc QA');
    await page.getByRole('button', { name: 'Tạo nhiệm vụ', exact: true }).click();
    await page.getByRole('button', { name: 'Hoàn thành Việc QA' }).click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Hoàn thành', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Mở lại Việc QA' })).toHaveAttribute('aria-pressed', 'true');

    await go('messages');
    const tech = page.getByRole('button', { name: /Tech Solutions/ });
    await tech.tap();
    await expect(page.locator('.chat-name')).toHaveText('Tech Solutions');
    await page.getByRole('textbox', { name: 'Tin nhắn', exact: true }).fill('Tin nhắn QA');
    await page.getByRole('button', { name: 'Gửi tin nhắn' }).tap();
    await expect(page.getByRole('log')).toContainText('Tin nhắn QA');
    await page.getByRole('button', { name: 'Quay lại' }).tap();
    await expect(tech).toBeFocused();
    await page.getByRole('button', { name: /Alpha Corp/ }).tap();
    await expect(page.getByRole('log')).not.toContainText('Tin nhắn QA');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await tech.tap();
    await expect(page.getByRole('log')).toContainText('Tin nhắn QA');

    await go('reports');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Xuất chỉ số' }).tap();
    assert.equal((await download).suggestedFilename(), 'flowcrm-chi-so.csv');

    await go('settings');
    const settingsNav = page.getByRole('navigation', { name: 'Danh mục cài đặt' });
    await expect(page.getByRole('heading', { name: 'Hồ sơ' })).toBeVisible();
    await settingsNav.getByRole('link', { name: 'Giao diện' }).click();
    await expect(page.getByRole('heading', { name: 'Hồ sơ' })).toBeHidden();
    const sidebarSwitch = page.getByRole('switch', { name: 'Thu gọn thanh bên' });
    await sidebarSwitch.check();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(sidebarSwitch).toBeChecked();
    await settingsNav.getByRole('link', { name: 'Người dùng' }).click();
    await expect(page.getByText('Chưa có người dùng được tạo.')).toBeVisible();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(sidebarSwitch).toBeVisible();
    await settingsNav.getByRole('link', { name: 'Người dùng' }).click();
    await page.getByRole('button', { name: 'Thêm người dùng' }).tap();
    await expect(page.getByRole('dialog', { name: 'Thêm người dùng' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Thêm người dùng' })).toBeFocused();
    await settingsNav.getByRole('link', { name: 'Giao diện' }).click();
    await page.getByLabel('Hiệu ứng chuyển động').selectOption('reduce');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
    await settingsNav.getByRole('link', { name: 'Công việc' }).click();
    await page.getByLabel('Giai đoạn Pipeline').selectOption('proposal');
    await page.getByLabel('Nhóm nhiệm vụ').selectOption('completed');
    await page.getByLabel('Chế độ xem lịch').selectOption('week');
    await expect(page.getByRole('status').filter({ hasText: 'Đã lưu tùy chọn.' })).toBeVisible();

    await go('pipeline');
    await expect(page.locator('#pipelineStageFilter')).toHaveValue('proposal');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
    await page.goto(new URL('pipeline.html?deal=1', base).href);
    await expect(page.getByRole('dialog', { name: 'Website Redesign' })).toBeVisible();
    await go('tasks');
    await expect(page.getByRole('button', { name: 'Hoàn thành', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await go('calendar');
    await expect(page.getByRole('button', { name: 'Tuần', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.goto(new URL('calendar.html?date=2027-01-07', base).href);
    await expect(page.getByRole('button', { name: 'Tháng', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Năm', { exact: true })).toHaveValue('2027');

    await page.goto(new URL('settings.html#du-lieu', base).href);
    const exported = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Tải tệp JSON' }).click();
    const snapshot = JSON.parse(await fs.readFile(await (await exported).path(), 'utf8'));
    assert.deepEqual(Object.keys(snapshot), ['version', 'exportedAt', 'deals', 'customers', 'tasks', 'events']);
    assert.ok(snapshot.customers.some(customer => customer.company === 'Công ty QA'));
    assert.ok(snapshot.tasks.some(task => task.title === 'Việc QA' && task.completed));
    await settingsNav.getByRole('link', { name: 'Công việc' }).click();
    await page.getByRole('button', { name: 'Về mặc định' }).click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Giai đoạn Pipeline')).toHaveValue('');
    await expect(page.getByLabel('Nhóm nhiệm vụ')).toHaveValue('all');
    await expect(page.getByLabel('Chế độ xem lịch')).toHaveValue('month');
    console.log('PASS keyboard navigation, pipeline search/filter, customer create/edit, calendar date, task create/complete, thread isolation, CSV export and settings');
    console.log('PASS workspace preferences, direct links, defaults reset and scoped JSON export');
  } finally {
    await context.close();
  }
}

async function main() {
  if (evidence) await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.FLOWCRM_BROWSER_CHANNEL || undefined });
  try {
    const runs = await Promise.allSettled([...widths.map(width => inspectRoutes(browser, width)), inspectActions(browser)]);
    const failures = runs.filter(run => run.status === 'rejected');
    if (failures.length) throw new AggregateError(failures.map(run => run.reason), 'FlowCRM layout checks failed');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
