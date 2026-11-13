/* Lava: motion, header, mobile menu and the home page (tabs, amenities, brochure, enquiry).
 * Loaded last on every page. No external libraries.
 * Form submission is SIMULATED (no server): waits 900 ms, then saves to sessionStorage through
 * window.Lava (js/app.js); offline fails and keeps the data. See docs/DESIGN-NOTES.md. */
(() => {
  'use strict';
  window.__lava = true; // tells the <head> failsafe that JS is running
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Motion: reveal on scroll ---------- */
  const COUNT_MS = 1400;
  const ease = (t) => 1 - Math.pow(1 - t, 4);
  const countUp = (el) => {
    const target = el.dataset.count;
    const parts = target.split('–').map(Number);
    if (parts.some(Number.isNaN)) return;
    const start = performance.now();
    const tick = (now) => {
      const k = ease(Math.min(1, (now - start) / COUNT_MS));
      el.textContent = parts.map((n) => Math.round(n * k)).join('–');
      if (k < 1) requestAnimationFrame(tick); else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  const reveal = (el) => {
    el.classList.add('is-in');
    if (!reduceMotion) $$('[data-count]', el).concat(el.matches('[data-count]') ? [el] : []).forEach(countUp);
  };
  const revealEls = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    // Clip-path reveals (mask, img) start fully clipped, and Chromium's IntersectionObserver
    // treats a clipped box as zero area, so those watch their parent instead.
    const byTrigger = new Map();
    revealEls.forEach((el) => {
      const trigger = el.matches('[data-reveal="mask"], [data-reveal="img"]') ? el.parentElement : el;
      if (!byTrigger.has(trigger)) byTrigger.set(trigger, []);
      byTrigger.get(trigger).push(el);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        byTrigger.get(e.target).forEach(reveal);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    byTrigger.forEach((_, trigger) => io.observe(trigger));
  }

  /* ---------- Motion: parallax on full-bleed photos ---------- */
  const parallax = $$('.hero__img, [data-parallax]');
  if (!reduceMotion && parallax.length) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallax.forEach((img) => {
        const box = img.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        const progress = (box.top + box.height / 2 - vh / 2) / vh; // -1..1 around the viewport centre
        img.style.translate = `0 ${(progress * -8).toFixed(2)}%`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Header: hides when scrolling down, returns when scrolling up ---------- */
  const hdr = $('#hdr');
  if (hdr) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const down = y > lastY && y > 320;
      if (!hdr.contains(document.activeElement)) hdr.classList.toggle('is-hidden', down);
      lastY = y;
    }, { passive: true });
    hdr.addEventListener('focusin', () => hdr.classList.remove('is-hidden'));
  }

  /* Current chapter in the nav */
  const navLinks = $$('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const a = byId.get(e.target.id);
        if (a && e.isIntersecting) {
          navLinks.forEach((l) => l.removeAttribute('aria-current'));
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Mobile menu ---------- */
  const menu = $('#mmenu');
  const menuBtn = $('.menu-btn');
  const openMenu = () => {
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    $('[data-close-menu]', menu).focus();
  };
  const closeMenu = (restoreFocus = true) => {
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus) menuBtn.focus();
  };
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', openMenu);
    $('[data-close-menu]', menu).addEventListener('click', () => closeMenu());
    $$('a', menu).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'Tab') {
        const f = $$('a, button', menu);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- 02 Residences: ARIA tabs, arrow keys switch, image cross-fades ---------- */
  const tabs = $$('.unit-tab');
  const unitImg = $('#unit-img');
  const swapImage = (src, alt) => {
    if (!unitImg || unitImg.getAttribute('src') === src) return;
    if (reduceMotion) { unitImg.src = src; unitImg.alt = alt; return; }
    unitImg.classList.add('is-swapping');
    setTimeout(() => {
      unitImg.src = src;
      unitImg.alt = alt;
      const show = () => unitImg.classList.remove('is-swapping');
      if (unitImg.complete) show(); else unitImg.addEventListener('load', show, { once: true });
    }, 280);
  };
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (tab.dataset.img) swapImage(tab.dataset.img, tab.dataset.alt || '');
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
    });
  });

  /* ---------- 05 Amenities: plan dots and list select the same item ---------- */
  const AMEN = [
    ['25 m pool', 'A saltwater pool with lap lanes and a children’s pool, looking straight onto the garden.', ['6am–9pm daily', 'Beside Block C']],
    ['Central garden', 'Over 1,800 m² of lawn and shade trees, with outdoor dining tables shared by all four blocks.', ['Open all day', 'Every block faces it']],
    ['Gym', 'Cardio and weights floors plus a private yoga studio with glass doors to the garden.', ['5:30am–10pm daily', 'Resident key card']],
    ['Residents’ lounge', 'A shared kitchen and a 16-seat table for family dinners, booked through building management.', ['8am–10pm daily', 'Book 24 hours ahead']],
    ['Garden loop', 'A walking loop around the garden that joins the coastal path.', ['600 m per lap', 'Lit at night']],
    ['Parking and storage', 'Two spaces per residence, a lockable storage room and EV chargers.', ['Open 24 hours', 'Resident key card']],
  ];
  const amenCtrls = $$('[data-amen]');
  const pickAmen = (i) => {
    amenCtrls.forEach((c) => c.setAttribute('aria-pressed', String(Number(c.dataset.amen) === i)));
    const [name, desc, meta] = AMEN[i];
    $('#amen-name').textContent = name;
    $('#amen-desc').textContent = desc;
    $('#amen-meta').replaceChildren(...meta.map((m) => Object.assign(document.createElement('span'), { textContent: m })));
    const detail = $('.amen__detail');
    if (detail && !reduceMotion) detail.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
  };
  amenCtrls.forEach((c) => c.addEventListener('click', () => pickAmen(Number(c.dataset.amen))));

  /* ---------- Shared validation ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^0\d{9}$/;
  const digits = (v) => v.replace(/[\s.-]/g, '');
  const setError = (input, msg) => {
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    const bad = Boolean(msg);
    input.setAttribute('aria-invalid', String(bad));
    if (err) err.hidden = !bad;
    return !bad;
  };
  const validate = (input, kind, required) => {
    const v = input.value.trim();
    if (!v) return setError(input, required);
    if (kind === 'email') return setError(input, !EMAIL.test(v));
    if (kind === 'phone') return setError(input, !PHONE.test(digits(v)));
    return setError(input, false);
  };
  // Clear an error as soon as the value becomes valid
  $$('.ds-field__control[aria-describedby]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') !== 'true') return;
      const kind = input.type === 'email' ? 'email' : input.type === 'tel' ? 'phone' : 'text';
      validate(input, kind, input.required || input.dataset.required === 'true');
    });
  });

  /* No server: Lava.send waits, then fails when offline (or when the demo tools ask it to) */
  const fakeSend = () => (window.Lava ? window.Lava.send(900) : Promise.resolve());
  const busy = (btn, on, label) => {
    if (on) { btn.dataset.label = btn.textContent; btn.textContent = label; }
    else if (btn.dataset.label) btn.textContent = btn.dataset.label;
    btn.disabled = on;
    btn.setAttribute('aria-busy', String(on));
  };
  const enter = (el) => {
    if (!reduceMotion) el.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
  };

  /* ---------- Brochure form ---------- */
  const bForm = $('#brochure-form');
  const bDone = $('#brochure-done');
  if (bForm) {
    const name = $('#b-name'), email = $('#b-email'), phone = $('#b-phone');
    const netErr = $('[data-net-error]', bForm);
    bForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      netErr.hidden = true;
      const ok = [validate(name, 'text', true), validate(email, 'email', true), validate(phone, 'phone', false)];
      const firstBad = [name, email, phone][ok.indexOf(false)];
      if (firstBad) { firstBad.focus(); return; }
      const btn = $('button[type="submit"]', bForm);
      busy(btn, true, 'Sending…');
      try {
        await fakeSend();
        if (window.Lava) window.Lava.store.enquiries.add({ ref: window.Lava.newRef(), kind: 'brochure', name: name.value.trim(), email: email.value.trim(), phone: digits(phone.value), createdAt: new Date().toISOString() });
        $('[data-out="email"]', bDone).textContent = email.value.trim();
        bForm.hidden = true;
        bDone.hidden = false;
        enter(bDone);
        bDone.focus();
      } catch {
        netErr.hidden = false;
        btn.focus();
      } finally {
        busy(btn, false);
      }
    });
    $('[data-edit-brochure]').addEventListener('click', () => {
      bDone.hidden = true;
      bForm.hidden = false;
      enter(bForm);
      email.focus();
      email.select();
    });
  }

  /* ---------- Three-step enquiry form ---------- */
  const eForm = $('#enq-form');
  const eDone = $('#enq-done');
  if (eForm) {
    const steps = $$('.step', eForm);
    const marks = $$('.steps li', eForm);
    const netErr = $('[data-net-error]', eForm);
    const name = $('#e-name'), phone = $('#e-phone'), email = $('#e-email');
    const need = $('#e-need'), unit = $('#e-unit');
    let cur = 1;

    const via = () => $('input[name="via"]:checked', eForm).value;
    const syncVia = () => {
      const v = via();
      $$('[data-via]', eForm).forEach((f) => { f.hidden = f.dataset.via !== v; });
      phone.dataset.required = String(v === 'call');
      email.dataset.required = String(v === 'email');
    };
    $$('input[name="via"]', eForm).forEach((r) => r.addEventListener('change', syncVia));
    syncVia();
    // Every residence can be picked by code
    const unitGroup = $('[data-unit-options]', eForm);
    if (unitGroup && window.Lava) {
      window.Lava.data.residences.forEach((r) => {
        unitGroup.append(new Option(`${r.code}, ${window.Lava.data.TYPES[r.type].short.toLowerCase()}`, r.id));
      });
    }

    const show = (n, focus = true) => {
      const changed = n !== cur;
      cur = n;
      steps.forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
      marks.forEach((m, i) => {
        if (i + 1 === n) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
        m.classList.toggle('is-done', i + 1 < n);
      });
      netErr.hidden = true;
      if (changed) enter(steps[n - 1]);
      if (focus) {
        const first = $('input:not([type="radio"]), select', steps[n - 1]);
        const target = n === 2 ? $('input[name="via"]:checked', eForm) : first;
        if (target) target.focus();
      }
    };
    const stepValid = (n) => {
      if (n === 1) { const ok = validate(name, 'text', true); if (!ok) name.focus(); return ok; }
      if (n === 2) {
        const input = via() === 'call' ? phone : email;
        const ok = validate(input, via() === 'call' ? 'phone' : 'email', true);
        if (!ok) input.focus();
        return ok;
      }
      return true;
    };
    $$('[data-next]', eForm).forEach((b) => b.addEventListener('click', () => { if (stepValid(cur)) show(cur + 1); }));
    $$('[data-back]', eForm).forEach((b) => b.addEventListener('click', () => show(cur - 1)));
    // Enter in a step 1–2 field moves on instead of submitting the whole form
    eForm.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && cur < 3 && e.target.matches('input')) {
        e.preventDefault();
        if (stepValid(cur)) show(cur + 1);
      }
    });

    eForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (cur !== 3) return;
      const btn = $('button[type="submit"]', eForm);
      busy(btn, true, 'Sending…');
      try {
        await fakeSend();
        const isCall = via() === 'call';
        const contact = isCall ? `Phone ${digits(phone.value)}` : email.value.trim();
        const ref = window.Lava ? window.Lava.newRef() : '';
        if (window.Lava) {
          window.Lava.store.enquiries.add({ ref, kind: 'enquiry', name: name.value.trim(), via: via(), contact, need: need.value, unit: unit.value, msg: $('#e-msg').value.trim(), createdAt: new Date().toISOString() });
        }
        const out = (k, v) => { $(`[data-out="${k}"]`, eDone).textContent = v; };
        out('ref', ref);
        out('name', name.value.trim());
        out('contact', contact);
        out('need', need.selectedOptions[0].text);
        out('unit', unit.selectedOptions[0].text);
        out('next', isCall
          ? `Reference ${ref}. A consultant will call you on ${digits(phone.value)} within one working day.`
          : `Reference ${ref}. We’ve emailed a copy to ${email.value.trim()}, and a consultant will reply within one working day.`);
        eForm.hidden = true;
        eDone.hidden = false;
        enter(eDone);
        eDone.focus();
      } catch {
        netErr.hidden = false;
        btn.focus();
      } finally {
        busy(btn, false);
      }
    });
    $('[data-edit-enq]').addEventListener('click', () => {
      eDone.hidden = true;
      eForm.hidden = false;
      show(3);
    });

    /* "Ask a question" on a residence page links to index.html?ask=<id>#contact:
       pre-select that residence and start at the first step still missing data. */
    const ask = new URLSearchParams(window.location.search).get('ask');
    if (ask && window.Lava && window.Lava.byId(ask)) {
      unit.value = window.Lava.byId(ask).id;
      need.value = 'advice';
      show(1, false);
    }
  }
})();
