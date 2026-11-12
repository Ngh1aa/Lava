/* End-to-end flow test in a real browser (Playwright). Run:
 *   NODE_PATH=<folder containing playwright>/node_modules node tests/flow.test.cjs [screenshot-dir]
 * Serves the repo itself on a free local port (sessionStorage needs a real origin).
 * Everything is simulated (no server): this proves the interface and the flows, not delivery. */
const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const out = process.argv[2] || path.join(__dirname, 'shots');
fs.mkdirSync(out, { recursive: true });
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const res = [];
const step = async (name, fn) => {
  try { await fn(); res.push('PASS ' + name); } catch (e) { res.push('FAIL ' + name + ' :: ' + e.message.split('\n')[0]); }
};

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const BASE = `http://127.0.0.1:${server.address().port}/`;
  const b = await chromium.launch();
  for (const [w, h, scheme] of [[1280, 900, 'light'], [390, 844, 'dark']]) {
    const mobile = w < 1024;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(`${p.url()} ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(`${p.url()} ${m.text()}`); });
    const tag = `${w}-${scheme}`;
    const go = (u) => p.goto(BASE + u);
    const shot = (name) => p.screenshot({ path: `${out}/${tag}-${name}.png`, fullPage: true });
    const store = () => p.evaluate(() => JSON.parse(sessionStorage.getItem('lava.v1') || '{"shortlist":[],"bookings":[],"enquiries":[]}'));
    const navCount = () => p.evaluate(() => { const el = document.querySelector('.nav [data-shortlist-count]'); return el.hidden ? 0 : Number(el.textContent); });
    const openFilters = async () => { if (mobile && (await p.getAttribute('.filters-toggle', 'aria-expanded')) !== 'true') await p.click('.filters-toggle'); };
    const cardCodes = () => p.$$eval('#res-grid .res-card__title', (els) => els.map((e) => e.textContent.replace('Residence ', '')));

    await go('index.html');
    await p.evaluate(() => sessionStorage.clear());

    /* ---------- Home: brochure ---------- */
    await go('index.html');
    await step(`${tag} brochure: empty shows name and email errors, focus first field`, async () => {
      await p.click('#brochure-form button[type=submit]');
      assert.equal(await p.getAttribute('#b-name', 'aria-invalid'), 'true');
      assert.equal(await p.isVisible('#b-email-err'), true);
      assert.equal(await p.evaluate(() => document.activeElement.id), 'b-name');
    });
    await step(`${tag} brochure: offline shows error and keeps data, online saves`, async () => {
      await p.fill('#b-name', 'Nguyen Thi Huong');
      await p.fill('#b-email', 'huong@gmail');
      await p.click('#brochure-form button[type=submit]');
      assert.equal(await p.isVisible('#b-email-err'), true);
      await p.fill('#b-email', 'huong@gmail.com');
      await ctx.setOffline(true);
      await p.click('#brochure-form button[type=submit]');
      await p.waitForSelector('#brochure-form [data-net-error]:not([hidden])', { timeout: 3000 });
      assert.equal(await p.inputValue('#b-email'), 'huong@gmail.com');
      await ctx.setOffline(false);
      await p.click('#brochure-form button[type=submit]');
      await p.waitForSelector('#brochure-done:not([hidden])', { timeout: 3000 });
      assert.equal(await p.textContent('#brochure-done [data-out=email]'), 'huong@gmail.com');
      assert.match(await p.textContent('#brochure-done'), /nothing was sent/);
      assert.equal((await store()).enquiries[0].kind, 'brochure');
    });
    await step(`${tag} home: residence tabs and amenities plan still work`, async () => {
      await p.click('#tab-penthouse');
      assert.equal(await p.isVisible('#panel-penthouse'), true);
      await p.click('.dot[data-amen="2"]');
      assert.equal(await p.textContent('#amen-name'), 'Gym');
    });

    /* ---------- Home: enquiry form submits to a saved state ---------- */
    await step(`${tag} enquiry: step validation, back keeps data, submit saves with a reference`, async () => {
      await p.click('[data-step="1"] [data-next]');
      assert.equal(await p.isVisible('#e-name-err'), true);
      await p.fill('#e-name', 'Pham Quoc Bao');
      await p.click('[data-step="1"] [data-next]');
      await p.fill('#e-phone', '12345');
      await p.click('[data-step="2"] [data-next]');
      assert.equal(await p.isVisible('#e-phone-err'), true);
      await p.fill('#e-phone', '0912 345 678');
      await p.click('[data-step="2"] [data-next]');
      assert.equal(await p.isVisible('[data-step="3"]'), true);
      await p.click('[data-step="3"] [data-back]');
      assert.equal(await p.inputValue('#e-phone'), '0912 345 678');
      await p.click('[data-step="2"] [data-next]');
      await p.selectOption('#e-need', 'pricing');
      await p.selectOption('#e-unit', 'c-ph1');
      await p.fill('#e-msg', 'Is the pool heated?');
      await p.click('#enq-form button[type=submit]');
      await p.waitForSelector('#enq-done:not([hidden])', { timeout: 3000 });
      assert.match(await p.textContent('#enq-done [data-out=ref]'), /^LV-[A-Z0-9]{6}$/);
      assert.equal(await p.textContent('#enq-done [data-out=contact]'), 'Phone 0912345678');
      assert.equal(await p.textContent('#enq-done [data-out=unit]'), 'C-PH1, penthouse');
      assert.match(await p.textContent('#enq-done'), /nothing was sent/);
      const e = (await store()).enquiries.find((x) => x.kind === 'enquiry');
      assert.equal(e.unit, 'c-ph1');
      assert.equal(e.msg, 'Is the pool heated?');
      await p.locator('#contact').screenshot({ path: `${out}/${tag}-enquiry-done.png` });
    });
    await step(`${tag} enquiry: "Ask a question" link pre-selects that residence`, async () => {
      await go('index.html?ask=b-207#contact');
      assert.equal(await p.inputValue('#e-unit'), 'b-207');
      assert.equal(await p.inputValue('#e-need'), 'advice');
    });

    /* ---------- Listing: filter, sort, empty state, reset ---------- */
    await step(`${tag} listing: home type link opens filtered listing`, async () => {
      await go('index.html');
      await p.click('#tab-penthouse');
      await p.click('#panel-penthouse a[href^="residences.html"]');
      await p.waitForURL(/residences\.html\?type=penthouse/);
      assert.deepEqual((await cardCodes()).sort(), ['C-PH1', 'D-PH2']);
    });
    await step(`${tag} listing: filters by bedrooms and price, count and URL follow`, async () => {
      await go('residences.html');
      assert.equal(await p.textContent('#res-count'), '11 residences');
      await openFilters();
      await p.check('input[name=beds][value="3"]');
      await p.check('input[name=price][value="8-10"]');
      const codes = await cardCodes();
      assert.deepEqual(codes, ['B-207', 'D-310', 'C-212', 'A-G01']);
      assert.equal(await p.textContent('#res-count'), '4 of 11 residences');
      assert.match(p.url(), /beds=3/);
      assert.match(p.url(), /price=8-10/);
      await p.uncheck('input[name=status][value=sold]');
      assert.deepEqual(await cardCodes(), ['B-207', 'C-212', 'A-G01']);
      await shot('listing-filtered');
    });
    await step(`${tag} listing: no match shows empty state, reset restores all`, async () => {
      await p.check('input[name=beds][value="4"]');
      assert.equal(await p.isVisible('#res-empty'), true);
      assert.equal(await p.textContent('#res-count'), '0 of 11 residences');
      await p.click('#res-empty [data-reset-filters]');
      assert.equal(await p.textContent('#res-count'), '11 residences');
      assert.equal(await p.isVisible('#res-empty'), false);
    });
    await step(`${tag} listing: sort by price high to low`, async () => {
      await p.selectOption('#sort', 'price-desc');
      assert.equal((await cardCodes())[0], 'D-PH2');
      await p.selectOption('#sort', 'price-asc');
      assert.equal((await cardCodes())[0], 'A-101');
    });

    /* ---------- Filter, then detail, then shortlist ---------- */
    await step(`${tag} filter -> detail: card opens the right residence, Save updates header count`, async () => {
      await go('residences.html?beds=3&price=8-10');
      await p.click('#res-grid .res-card[data-id="b-207"] .res-card__title a');
      await p.waitForURL(/residence\.html\?id=b-207/);
      assert.equal(await p.textContent('#d-title'), 'Residence B-207');
      assert.equal(await p.textContent('#d-price'), 'VND 8.9 billion');
      assert.equal(await p.locator('#d-plan svg .fp-mark').count(), 9);
      await p.click('[data-gal="1"]');
      assert.equal(await p.textContent('#gal-pos'), '2 / 4');
      await p.click('#d-save');
      assert.equal(await p.getAttribute('#d-save', 'aria-pressed'), 'true');
      assert.equal(await p.textContent('#d-save [data-save-text]'), 'Saved');
      assert.equal(await navCount(), 1);
      await shot('detail');
    });
    await step(`${tag} detail: breadcrumb returns to the filtered list`, async () => {
      await p.click('[data-list-link]');
      await p.waitForURL(/residences\.html\?beds=3&price=8-10/);
      assert.equal(await p.textContent('#res-count'), '4 of 11 residences');
      // Saved state shows on the card too; save another from the card
      assert.equal(await p.getAttribute('.res-card[data-id="b-207"] [data-save]', 'aria-pressed'), 'true');
      await p.click('.res-card[data-id="a-g01"] [data-save]');
      assert.equal(await navCount(), 2);
    });
    await step(`${tag} detail: sold residence locks booking with a reason; unknown id shows not found`, async () => {
      await go('residence.html?id=a-101');
      assert.equal(await p.isDisabled('#d-book'), true);
      assert.equal(await p.isVisible('#d-lock'), true);
      await go('residence.html?id=zz-999');
      assert.equal(await p.isVisible('#missing'), true);
      assert.equal(await p.textContent('#missing-code'), 'zz-999');
    });
    await step(`${tag} shortlist: both saved residences side by side, remove with undo`, async () => {
      await go('shortlist.html');
      assert.equal(await p.locator('.cmp').count(), 2);
      assert.equal(await p.textContent('#sl-count'), '2 residences saved');
      await shot('shortlist');
      await p.click('[data-remove="a-g01"]');
      assert.equal(await p.locator('.cmp').count(), 1);
      await p.click('.toast__action');
      assert.equal(await p.locator('.cmp').count(), 2);
      assert.match(await p.getAttribute('#sl-book', 'href'), /ids=b-207,a-g01/);
    });

    /* ---------- Booking: full flow, then reschedule, then cancel ---------- */
    let ref;
    await step(`${tag} booking: from shortlist, both residences pre-ticked, max 3 enforced`, async () => {
      await p.click('#sl-book');
      await p.waitForURL(/book\.html\?ids=/);
      assert.deepEqual((await p.$$eval('input[name=res]:checked', (els) => els.map((e) => e.value))).sort(), ['a-g01', 'b-207']);
      await p.check('input[name=res][value="c-ph1"]');
      assert.equal(await p.isDisabled('input[name=res][value="b-104"]'), true);
      assert.equal(await p.isVisible('#pick-max'), true);
      await p.uncheck('input[name=res][value="c-ph1"]');
      assert.equal(await p.isDisabled('input[name=res][value="b-104"]'), false);
    });
    await step(`${tag} booking: time is required; taken slots are disabled`, async () => {
      await p.click('[data-step="1"] [data-next]');
      assert.equal(await p.isVisible('[data-step="2"]'), true);
      await p.click('[data-step="2"] [data-next]');
      assert.equal(await p.isVisible('#slot-err'), true);
      // Across the bookable days some slots must be taken and disabled
      const days = await p.$$eval('input[name=day]:not(:disabled)', (els) => els.map((e) => e.value));
      let sawTaken = false;
      for (const d of days.slice(0, 4)) {
        await p.check(`input[name=day][value="${d}"]`);
        if (await p.locator('.slot.is-off input:disabled').count()) sawTaken = true;
      }
      assert.equal(sawTaken, true);
      await p.check(`input[name=day][value="${days[0]}"]`);
      await p.locator('input[name=time]:not(:disabled)').first().check();
      assert.equal(await p.isVisible('#slot-err'), false);
      await shot('booking-time');
      await p.click('[data-step="2"] [data-next]');
    });
    await step(`${tag} booking: details validate inline, review shows the choices`, async () => {
      assert.equal(await p.isVisible('[data-step="3"]'), true);
      await p.click('[data-step="3"] [data-next]');
      assert.equal(await p.isVisible('#v-name-err'), true);
      await p.fill('#v-name', 'Le Minh Anh');
      await p.fill('#v-email', 'anh@');
      await p.locator('#v-email').blur();
      assert.equal(await p.isVisible('#v-email-err'), true);
      await p.fill('#v-email', 'anh@gmail.com');
      assert.equal(await p.isVisible('#v-email-err'), false);
      await p.fill('#v-phone', '0987 654 321');
      await p.click('[data-step="3"] [data-next]');
      assert.equal(await p.isVisible('[data-step="4"]'), true);
      const review = await p.textContent('#review');
      assert.match(review, /Residence B-207/);
      assert.match(review, /Residence A-G01/);
      assert.match(review, /45 minutes/);
      assert.match(review, /0987654321/);
    });
    await step(`${tag} booking: offline fails and keeps the review; online confirms with a reference`, async () => {
      await ctx.setOffline(true);
      await p.click('#book-submit');
      await p.waitForSelector('#book-form [data-net-error]:not([hidden])', { timeout: 3000 });
      assert.equal(await p.isVisible('[data-step="4"]'), true);
      await ctx.setOffline(false);
      await p.click('#book-submit');
      await p.waitForSelector('#book-done:not([hidden])', { timeout: 3000 });
      ref = await p.textContent('#done-summary [data-out=ref]');
      assert.match(ref, /^LV-[A-Z0-9]{6}$/);
      assert.equal(await p.textContent('#done-title'), 'Viewing booked');
      assert.match(await p.textContent('#book-done'), /nothing was sent/);
      const s = await store();
      assert.equal(s.bookings.length, 1);
      assert.equal(s.bookings[0].status, 'upcoming');
      await shot('booking-done');
    });
    let firstWhen;
    await step(`${tag} my viewings: lists the booking; reschedule to another time`, async () => {
      await p.click('#book-done a[href="viewings.html"]');
      await p.waitForURL(/viewings\.html/);
      assert.equal(await p.textContent('#vw-count'), '1 upcoming viewing');
      firstWhen = await p.textContent(`.vw[data-ref="${ref}"] .vw__title`);
      await p.click(`.vw[data-ref="${ref}"] a[href*="reschedule"]`);
      await p.waitForURL(/book\.html\?reschedule=/);
      assert.equal(await p.textContent('#book-title'), 'Reschedule viewing');
      assert.equal(await p.isVisible('[data-step="2"]'), true);
      const days = await p.$$eval('input[name=day]:not(:disabled)', (els) => els.map((e) => e.value));
      await p.check(`input[name=day][value="${days[days.length - 1]}"]`);
      await p.locator('input[name=time]:not(:disabled)').last().check();
      await p.click('[data-step="2"] [data-next]');
      await p.click('[data-step="3"] [data-next]');
      await p.click('#book-submit');
      await p.waitForSelector('#book-done:not([hidden])', { timeout: 3000 });
      assert.equal(await p.textContent('#done-title'), 'Viewing rescheduled');
      assert.equal(await p.textContent('#done-summary [data-out=ref]'), ref);
      await go('viewings.html');
      const when = await p.textContent(`.vw[data-ref="${ref}"] .vw__title`);
      assert.notEqual(when, firstWhen);
      assert.equal((await store()).bookings.length, 1);
    });
    await step(`${tag} my viewings: cancel asks first, Keep viewing changes nothing, confirm cancels`, async () => {
      await p.click(`[data-cancel="${ref}"]`);
      assert.equal(await p.isVisible('dialog.lava-dialog'), true);
      assert.match(await p.textContent('dialog.lava-dialog'), new RegExp(ref));
      await shot('cancel-dialog');
      await p.click('dialog.lava-dialog [data-dlg-cancel]');
      assert.equal((await store()).bookings[0].status, 'upcoming');
      await p.click(`[data-cancel="${ref}"]`);
      await p.click('dialog.lava-dialog [data-dlg-ok]');
      await p.waitForSelector(`.vw.is-cancelled[data-ref="${ref}"]`);
      assert.equal((await store()).bookings[0].status, 'cancelled');
      assert.equal(await p.textContent('#vw-count'), '0 upcoming viewings');
      assert.equal(await p.locator(`[data-cancel="${ref}"]`).count(), 0);
      await go(`book.html?reschedule=${ref}`);
      assert.equal(await p.isVisible('#book-missing'), true);
    });

    /* ---------- Shortlist clear and demo reset ---------- */
    await step(`${tag} shortlist: clear asks first, then shows the empty state`, async () => {
      await go('shortlist.html');
      await p.click('#sl-clear');
      await p.click('dialog.lava-dialog [data-dlg-cancel]');
      assert.equal(await p.locator('.cmp').count(), 2);
      await p.click('#sl-clear');
      await p.click('dialog.lava-dialog [data-dlg-ok]');
      assert.equal(await p.isVisible('#sl-empty'), true);
      assert.equal(await navCount(), 0);
    });
    await step(`${tag} reset demo data: confirm lists what goes, then everything is cleared`, async () => {
      await go('residence.html?id=c-305');
      await p.click('#d-save');
      assert.equal(await navCount(), 1);
      await p.click('[data-reset-demo]');
      const text = await p.textContent('dialog.lava-dialog');
      assert.match(text, /1 residence/);
      assert.match(text, /2 enquiries/);
      await p.click('dialog.lava-dialog [data-dlg-ok]');
      await p.waitForSelector('.toast', { timeout: 3000 });
      assert.equal(await p.textContent('.toast p'), 'Demo data reset');
      assert.equal(await navCount(), 0);
      const s = await store();
      assert.deepEqual([s.shortlist.length, s.bookings.length, s.enquiries.length], [0, 0, 0]);
      await go('viewings.html');
      assert.equal(await p.isVisible('#vw-empty'), true);
    });

    if (mobile) {
      await step(`${tag} mobile menu: opens, Esc closes, links go to pages`, async () => {
        await go('index.html');
        await p.click('.menu-btn');
        assert.equal(await p.isVisible('#mmenu'), true);
        await p.keyboard.press('Escape');
        assert.equal(await p.isVisible('#mmenu'), false);
        await p.click('.menu-btn');
        await p.click('#mmenu nav a[href="location.html"]');
        await p.waitForURL(/location\.html/);
      });
    }

    /* ---------- Every page loads without JS errors and has no dead links ---------- */
    await step(`${tag} every page: no href="#" and no JS errors`, async () => {
      for (const u of ['index.html', 'residences.html', 'residence.html?id=c-ph1', 'shortlist.html', 'book.html', 'viewings.html', 'location.html', 'developer.html', 'legal.html']) {
        await go(u);
        assert.equal(await p.locator('a[href="#"], a:not([href])').count(), 0, `dead link on ${u}`);
      }
      assert.deepEqual(errs, []);
    });
    await ctx.close();
  }
  await b.close();
  server.close();
  console.log(res.join('\n'));
  const failed = res.filter((r) => r.startsWith('FAIL')).length;
  console.log(`\n${res.length - failed}/${res.length} PASS`);
  process.exit(failed ? 1 : 0);
})();
