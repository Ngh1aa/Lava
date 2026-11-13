/* Lava: shared layer for every page.
 *
 * There is no server. Everything the visitor creates (shortlist, viewings, enquiries) is kept in
 * sessionStorage under one key, so it survives moving between pages in the same tab and disappears
 * when the tab closes.
 *
 * Demo tools (hidden from visitors): open any page with ?demo=1 to show a small floating panel with
 * "Reset demo data" and "Fail the next request". The flag sticks for the tab; ?demo=0 turns it off.
 *
 * Exposes window.Lava: store, formatters, slot availability, card markup, toast and confirm dialog.
 */
window.Lava = (() => {
  'use strict';
  const D = window.LAVA_DATA;
  const KEY = 'lava.v1';
  const FLASH = 'lava.flash';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Storage (sessionStorage, with an in-memory fallback if it is blocked) ---------- */
  const memory = {};
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return memory[k] ?? null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { memory[k] = v; } },
    del(k) { try { sessionStorage.removeItem(k); } catch { delete memory[k]; } },
    keys() { try { return Object.keys(sessionStorage); } catch { return Object.keys(memory); } },
  };
  const empty = () => ({ shortlist: [], bookings: [], enquiries: [] });
  const read = () => {
    try { return Object.assign(empty(), JSON.parse(ss.get(KEY)) || {}); } catch { return empty(); }
  };
  const write = (s) => { ss.set(KEY, JSON.stringify(s)); document.dispatchEvent(new CustomEvent('lava:change')); };
  const update = (fn) => { const s = read(); fn(s); write(s); return s; };

  const byId = (id) => D.residences.find((r) => r.id === String(id || '').toLowerCase());

  const store = {
    read,
    shortlist: {
      list: () => read().shortlist.filter(byId),
      has: (id) => read().shortlist.includes(id),
      add: (id) => update((s) => { if (!s.shortlist.includes(id)) s.shortlist.push(id); }),
      remove: (id) => update((s) => { s.shortlist = s.shortlist.filter((x) => x !== id); }),
      set: (ids) => update((s) => { s.shortlist = ids.slice(); }),
      clear: () => update((s) => { s.shortlist = []; }),
    },
    bookings: {
      list: () => read().bookings,
      get: (ref) => read().bookings.find((b) => b.ref === ref),
      add: (b) => update((s) => { s.bookings.push(b); }),
      patch: (ref, changes) => update((s) => {
        const b = s.bookings.find((x) => x.ref === ref);
        if (b) Object.assign(b, changes, { updatedAt: new Date().toISOString() });
      }),
    },
    enquiries: {
      list: () => read().enquiries,
      add: (e) => update((s) => { s.enquiries.push(e); }),
    },
    draft: {
      get: (k) => { try { return JSON.parse(ss.get('lava.draft.' + k)); } catch { return null; } },
      set: (k, v) => ss.set('lava.draft.' + k, JSON.stringify(v)),
      clear: (k) => ss.del('lava.draft.' + k),
    },
    note: { get: (k) => ss.get('lava.note.' + k), set: (k, v) => ss.set('lava.note.' + k, v) },
    reset: () => { ss.keys().filter((k) => k.startsWith('lava.')).forEach((k) => ss.del(k)); },
  };

  /* ---------- Demo mode (?demo=1 / ?demo=0, remembered for the tab) ---------- */
  // Keys deliberately do not start with "lava." so Reset demo data keeps the tools open.
  const DEMO = 'lavaDemo';
  const FAIL = 'lavaDemoFail';
  const demoParam = new URLSearchParams(window.location.search).get('demo');
  if (demoParam === '1') ss.set(DEMO, '1');
  if (demoParam === '0') { ss.del(DEMO); ss.del(FAIL); }
  const demoOn = () => ss.get(DEMO) === '1';

  /* Every "send" goes through here: a short wait, then it fails when offline, or when the demo
   * tools asked for the next request to fail (that flag is used once). */
  const send = (ms = 800) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!navigator.onLine) { reject(new Error('offline')); return; }
      if (demoOn() && ss.get(FAIL) === '1') {
        ss.del(FAIL);
        const box = document.querySelector('[data-demo-fail]');
        if (box) box.checked = false;
        reject(new Error('failed'));
        return;
      }
      resolve();
    }, ms);
  });

  /* ---------- Formatting ---------- */
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const price = (bn) => `VND ${bn.toFixed(1)} billion`;
  const title = (r) => `Residence ${r.code}`;
  const level = (r) => (r.level === 0 ? 'Ground floor' : `Level ${r.level}`);
  const typeLine = (r) => `${D.TYPES[r.type].short}, ${level(r).toLowerCase()}`;
  const parseISO = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const dateLong = (iso) => parseISO(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateParts = (iso) => {
    const d = parseISO(iso);
    return { wd: d.toLocaleDateString('en-GB', { weekday: 'short' }), day: d.getDate(), mon: d.toLocaleDateString('en-GB', { month: 'short' }) };
  };
  const time = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
  };
  const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

  /* ---------- Viewing slots ---------- */
  const viewingDays = () => {
    const out = [];
    const start = new Date();
    for (let i = 1; i <= D.VIEWING.days; i += 1) out.push(toISO(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)));
    return out;
  };
  // Other people's bookings: a fixed pattern so the same slot is always taken on the same date.
  const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const slotTaken = (iso, hhmm, ignoreRef) => {
    if (hash(`${iso}|${hhmm}`) % 10 < 3) return 'taken';
    const mine = read().bookings.some((b) => b.status === 'upcoming' && b.ref !== ignoreRef && b.date === iso && b.time === hhmm);
    return mine ? 'yours' : '';
  };
  const newRef = () => {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let r = 'LV-';
    for (let i = 0; i < 6; i += 1) r += abc[Math.floor(Math.random() * abc.length)];
    return r;
  };

  /* ---------- Markup ---------- */
  const icon = (id, cls = 'ds-icon ds-icon--sm') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const badge = (status) => {
    const s = D.STATUS[status];
    return `<span class="ds-badge ds-badge--${s.badge}">${icon(s.icon)}${s.label}</span>`;
  };
  const img = (key, cls = '', sizes = '') => {
    const i = D.IMG[key];
    return `<img${cls ? ` class="${cls}"` : ''} src="${i.src}" width="${i.w}" height="${i.h}" alt="${esc(i.alt)}" loading="lazy"${sizes ? ` sizes="${sizes}"` : ''}>`;
  };
  const saveBtn = (r) => {
    const on = store.shortlist.has(r.id);
    return `<button class="save-btn" type="button" data-save="${r.id}" aria-pressed="${on}" aria-label="Save ${r.code} to shortlist">${icon('app-i-heart', 'ds-icon')}</button>`;
  };
  const facts = (r) => `<ul class="facts"><li>${icon('app-i-bed')}${plural(r.beds, 'bed')}</li><li>${icon('app-i-bath')}${plural(r.baths, 'bath')}</li><li>${icon('app-i-area')}${r.interior} m²</li></ul>`;
  const card = (r, headingLevel = 2) => `
    <article class="res-card" data-id="${r.id}">
      <div class="res-card__media">${img(r.gallery[0])}<span class="res-card__badge">${badge(r.status)}</span></div>
      <div class="res-card__body">
        <h${headingLevel} class="res-card__title"><a href="residence.html?id=${r.id}">${title(r)}</a></h${headingLevel}>
        <p class="res-card__type">${typeLine(r)}</p>
        ${facts(r)}
        <div class="res-card__foot"><span class="res-card__price">${price(r.price)}</span>${saveBtn(r)}</div>
      </div>
    </article>`;

  /* ---------- Motion helper ---------- */
  const enter = (el, y = 12) => {
    if (el && !reduceMotion) el.animate([{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  const toastHost = document.createElement('div');
  toastHost.className = 'toast-host';
  toastHost.setAttribute('role', 'status');
  toastHost.setAttribute('aria-live', 'polite');
  const toast = (message, action) => {
    clearTimeout(toastTimer);
    toastHost.replaceChildren();
    const t = document.createElement('div');
    t.className = 'toast';
    const p = document.createElement('p');
    p.textContent = message;
    t.append(p);
    if (action) {
      const a = document.createElement(action.href ? 'a' : 'button');
      a.className = 'toast__action';
      a.textContent = action.label;
      if (action.href) a.href = action.href; else { a.type = 'button'; a.addEventListener('click', () => { action.run(); hideToast(); }); }
      t.append(a);
    }
    toastHost.append(t);
    enter(t, 16);
    toastTimer = setTimeout(hideToast, 6000);
  };
  const hideToast = () => { clearTimeout(toastTimer); toastHost.replaceChildren(); };

  /* ---------- Confirm dialog (native <dialog>: focus trap, Esc, inert page) ---------- */
  let dlg;
  const confirmDialog = ({ heading, body, confirm, cancel = 'Go back', danger = true }) => new Promise((resolve) => {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'ds-dialog lava-dialog';
      dlg.setAttribute('aria-labelledby', 'dlg-title');
      dlg.innerHTML = `<form method="dialog" class="ds-dialog__body">
          <h2 class="dlg__title" id="dlg-title"></h2>
          <div class="dlg__body"></div>
          <div class="ds-dialog__actions">
            <button class="ds-button ds-button--secondary" value="cancel" data-dlg-cancel></button>
            <button class="ds-button" value="ok" data-dlg-ok></button>
          </div>
        </form>`;
      document.body.append(dlg);
    }
    $('#dlg-title', dlg).textContent = heading;
    const b = $('.dlg__body', dlg);
    if (typeof body === 'string') b.innerHTML = body; else b.replaceChildren(body);
    $('[data-dlg-cancel]', dlg).textContent = cancel;
    const ok = $('[data-dlg-ok]', dlg);
    ok.textContent = confirm;
    ok.className = `ds-button ${danger ? 'ds-button--danger' : 'ds-button--primary'}`;
    const opener = document.activeElement;
    dlg.returnValue = '';
    dlg.addEventListener('close', () => {
      resolve(dlg.returnValue === 'ok');
      if (opener && opener.isConnected) opener.focus();
    }, { once: true });
    dlg.showModal();
    $('[data-dlg-cancel]', dlg).focus();
  });

  /* ---------- Shared page wiring ---------- */
  const syncShortlistUI = () => {
    const n = store.shortlist.list().length;
    $$('[data-shortlist-count]').forEach((el) => { el.textContent = String(n); el.hidden = n === 0; });
    $$('[data-save]').forEach((b) => {
      const on = store.shortlist.has(b.dataset.save);
      b.setAttribute('aria-pressed', String(on));
      const r = byId(b.dataset.save);
      if (b.dataset.saveLabel !== undefined) {
        $('[data-save-text]', b).textContent = on ? 'Saved' : 'Save to shortlist';
      } else if (r) b.setAttribute('aria-label', on ? `Remove ${r.code} from shortlist` : `Save ${r.code} to shortlist`);
    });
  };

  const toggleSave = (id) => {
    const r = byId(id);
    if (!r) return;
    if (store.shortlist.has(id)) {
      const before = store.shortlist.list();
      store.shortlist.remove(id);
      toast(`${r.code} removed from your shortlist`, { label: 'Undo', run: () => store.shortlist.set(before) });
    } else {
      store.shortlist.add(id);
      toast(`${r.code} saved to your shortlist`, { label: 'View shortlist', href: 'shortlist.html' });
    }
  };

  const resetDemo = async () => {
    const s = read();
    const n = { s: s.shortlist.length, b: s.bookings.filter((b) => b.status === 'upcoming').length, e: s.enquiries.length };
    const ok = await confirmDialog({
      heading: 'Reset demo data?',
      body: `<dl class="dlg-list"><dt>Shortlist</dt><dd>${plural(n.s, 'residence')}</dd><dt>Viewings</dt><dd>${plural(n.b, 'upcoming viewing')}</dd><dt>Enquiries</dt><dd>${plural(n.e, 'enquiry', 'enquiries')}</dd></dl>`,
      confirm: 'Reset demo data',
      cancel: 'Keep data',
    });
    if (!ok) return;
    store.reset();
    ss.set(FLASH, 'Demo data reset');
    window.location.reload();
  };

  const demoTools = () => {
    const box = document.createElement('details');
    box.className = 'demo-tools';
    box.innerHTML = `<summary>Demo tools</summary>
      <div class="demo-tools__body">
        <label class="demo-tools__check"><input type="checkbox" data-demo-fail${ss.get(FAIL) === '1' ? ' checked' : ''}> Fail the next request</label>
        <button class="demo-tools__btn" type="button" data-reset-demo>Reset demo data</button>
        <button class="demo-tools__btn" type="button" data-demo-hide>Hide demo tools</button>
      </div>`;
    $('[data-demo-fail]', box).addEventListener('change', (e) => { if (e.target.checked) ss.set(FAIL, '1'); else ss.del(FAIL); });
    $('[data-demo-hide]', box).addEventListener('click', () => { ss.del(DEMO); ss.del(FAIL); box.remove(); });
    document.body.append(box);
  };

  const init = () => {
    document.body.append(toastHost);
    if (demoOn()) demoTools();
    document.addEventListener('click', (e) => {
      const save = e.target.closest('[data-save]');
      if (save) { e.preventDefault(); toggleSave(save.dataset.save); }
      if (e.target.closest('[data-reset-demo]')) { e.preventDefault(); resetDemo(); }
    });
    document.addEventListener('lava:change', syncShortlistUI);
    syncShortlistUI();
    const flash = ss.get(FLASH);
    if (flash) { ss.del(FLASH); toast(flash); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  return {
    data: D, store, byId, esc, price, title, level, typeLine, dateLong, dateParts, time, plural,
    viewingDays, slotTaken, newRef, send, demo: demoOn, icon, badge, img, card, facts, saveBtn, enter, toast, confirm: confirmDialog,
    sync: syncShortlistUI, reduceMotion, $, $$,
  };
})();
