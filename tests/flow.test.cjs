/* Kiểm luồng bằng trình duyệt thật (Playwright). Chạy:
 *   NODE_PATH=<thư mục có playwright>/node_modules node tests/flow.test.cjs [thư-mục-ảnh]
 * Gửi form là mô phỏng: test chứng minh giao diện và luồng, không chứng minh backend. */
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const file = path.join(__dirname, '..', 'index.html');
const out = process.argv[2] || path.join(__dirname, 'shots');
fs.mkdirSync(out, { recursive: true });
const res = [];
const step = async (name, fn) => {
  try { await fn(); res.push('PASS ' + name); } catch (e) { res.push('FAIL ' + name + ' :: ' + e.message.split('\n')[0]); }
};

(async () => {
  const b = await chromium.launch();
  for (const [w, h, scheme] of [[1280, 900, 'light'], [390, 844, 'dark']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(pathToFileURL(file).href);
    const tag = `${w}-${scheme}`;
    const shot = (sel, name) => p.locator(sel).screenshot({ path: `${out}/${tag}-${name}.png` });

    await step(`${tag} brochure: để trống thì báo lỗi tên và email, focus ô đầu`, async () => {
      await p.click('#brochure-form button[type=submit]');
      assert.equal(await p.getAttribute('#b-name', 'aria-invalid'), 'true');
      assert.equal(await p.isVisible('#b-email-err'), true);
      assert.equal(await p.evaluate(() => document.activeElement.id), 'b-name');
      await shot('#brochure', 'brochure-error');
    });
    await step(`${tag} brochure: email sai dạng bị chặn, gõ đúng thì lỗi tắt`, async () => {
      await p.fill('#b-name', 'Nguyễn Thị Hường');
      await p.fill('#b-email', 'huong@gmail');
      await p.click('#brochure-form button[type=submit]');
      assert.equal(await p.isVisible('#b-email-err'), true);
      await p.fill('#b-email', 'huong@gmail.com');
      assert.equal(await p.isVisible('#b-email-err'), false);
    });
    await step(`${tag} brochure: mất mạng thì hiện lỗi, giữ dữ liệu`, async () => {
      await ctx.setOffline(true);
      await p.click('#brochure-form button[type=submit]');
      await p.waitForSelector('#brochure-form [data-net-error]:not([hidden])', { timeout: 3000 });
      assert.equal(await p.inputValue('#b-email'), 'huong@gmail.com');
      await shot('#brochure', 'brochure-offline');
      await ctx.setOffline(false);
    });
    await step(`${tag} brochure: gửi lại thành công, nút khoá khi đang gửi, đúng email`, async () => {
      await p.click('#brochure-form button[type=submit]');
      assert.equal(await p.isDisabled('#brochure-form button[type=submit]'), true);
      await p.waitForSelector('#brochure-done:not([hidden])', { timeout: 3000 });
      assert.equal(await p.textContent('#brochure-done [data-out=email]'), 'huong@gmail.com');
      await shot('#brochure', 'brochure-done');
    });
    await step(`${tag} brochure: Sửa email quay về form, dữ liệu còn`, async () => {
      await p.click('[data-edit-brochure]');
      assert.equal(await p.inputValue('#b-email'), 'huong@gmail.com');
    });
    await step(`${tag} căn hộ: chọn Penthouse mở đúng thông số và ảnh; phím mũi tên chuyển tab`, async () => {
      await p.click('#tab-ph');
      assert.equal(await p.isVisible('#panel-ph'), true);
      assert.equal(await p.isVisible('#panel-vuon'), false);
      assert.ok((await p.getAttribute('#unit-img', 'src')).includes('penthouse'));
      await p.focus('#tab-ph');
      await p.keyboard.press('ArrowRight');
      assert.equal(await p.getAttribute('#tab-vuon', 'aria-selected'), 'true');
      await p.click('#tab-ph');
    });
    await step(`${tag} tiện ích: chấm trên mặt bằng và danh sách chọn cùng một mục`, async () => {
      await p.click('.dot[data-amen="2"]');
      assert.equal(await p.textContent('#amen-name'), 'Phòng gym');
      assert.equal(await p.getAttribute('.amen__btn[data-amen="2"]', 'aria-pressed'), 'true');
      await p.click('.amen__btn[data-amen="0"]');
      assert.equal(await p.getAttribute('.dot[data-amen="0"]', 'aria-pressed'), 'true');
      await shot('#tien-ich', 'tien-ich');
    });
    await step(`${tag} "Hỏi về căn này" điền sẵn Tư vấn + Penthouse, mở bước 1`, async () => {
      await p.click('#panel-ph a[data-need]');
      assert.equal(await p.inputValue('#e-need'), 'tu-van');
      assert.equal(await p.inputValue('#e-unit'), 'penthouse');
      assert.equal(await p.isVisible('[data-step="1"]'), true);
    });
    await step(`${tag} liên hệ: bước 1 trống bị chặn; bước 2 số sai bị chặn`, async () => {
      await p.click('[data-step="1"] [data-next]');
      assert.equal(await p.isVisible('#e-name-err'), true);
      await p.fill('#e-name', 'Phạm Quốc Bảo');
      await p.click('[data-step="1"] [data-next]');
      assert.equal(await p.isVisible('[data-step="2"]'), true);
      await p.fill('#e-phone', '12345');
      await p.click('[data-step="2"] [data-next]');
      assert.equal(await p.isVisible('#e-phone-err'), true);
      await shot('#lien-he', 'enq-step2-error');
      await p.fill('#e-phone', '0912 345 678');
      await p.click('[data-step="2"] [data-next]');
      assert.equal(await p.isVisible('[data-step="3"]'), true);
    });
    await step(`${tag} liên hệ: Quay lại giữ tên và số; đổi sang Email`, async () => {
      await p.click('[data-step="3"] [data-back]');
      assert.equal(await p.inputValue('#e-phone'), '0912 345 678');
      await p.click('[data-step="2"] [data-back]');
      assert.equal(await p.inputValue('#e-name'), 'Phạm Quốc Bảo');
      await p.click('[data-step="1"] [data-next]');
      await p.check('input[name=via][value=email]');
      assert.equal(await p.isVisible('#e-phone'), false);
      await p.fill('#e-email', 'bao@yahoo.com');
      await p.click('[data-step="2"] [data-next]');
      assert.equal(await p.isVisible('[data-step="3"]'), true);
    });
    await step(`${tag} liên hệ: chọn Hẹn xem thì hiện ngày; gửi ra tóm tắt đúng`, async () => {
      await p.selectOption('#e-need', 'xem');
      assert.equal(await p.isVisible('#e-day'), true);
      await p.selectOption('#e-day', 'Chủ Nhật, 15/11');
      await shot('#lien-he', 'enq-step3');
      await p.click('#enq-form button[type=submit]');
      await p.waitForSelector('#enq-done:not([hidden])', { timeout: 3000 });
      assert.equal(await p.textContent('[data-out=contact]'), 'bao@yahoo.com');
      assert.equal(await p.textContent('[data-out=need]'), 'Hẹn xem nhà mẫu, Chủ Nhật, 15/11');
      assert.equal(await p.textContent('[data-out=unit]'), 'Penthouse');
      await shot('#lien-he', 'enq-done');
    });
    await step(`${tag} liên hệ: Sửa thông tin về bước 3, lựa chọn còn`, async () => {
      await p.click('[data-edit-enq]');
      assert.equal(await p.isVisible('[data-step="3"]'), true);
      assert.equal(await p.inputValue('#e-unit'), 'penthouse');
    });
    if (w < 1024) {
      await step(`${tag} menu điện thoại: mở, Esc đóng, bấm link thì đóng`, async () => {
        await p.evaluate(() => window.scrollTo(0, 0));
        await p.click('.menu-btn');
        assert.equal(await p.isVisible('#mmenu'), true);
        await p.screenshot({ path: `${out}/${tag}-menu.png` });
        await p.keyboard.press('Escape');
        assert.equal(await p.isVisible('#mmenu'), false);
        await p.click('.menu-btn');
        await p.click('#mmenu nav a[href="#vi-tri"]');
        assert.equal(await p.isVisible('#mmenu'), false);
      });
    }
    await step(`${tag} không có lỗi JS`, async () => assert.deepEqual(errs, []));
    await ctx.close();
  }
  await b.close();
  console.log(res.join('\n'));
  process.exit(res.some((r) => r.startsWith('FAIL')) ? 1 : 0);
})();
